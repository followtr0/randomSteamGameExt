let pageContainer = null;
let libraryWrapper = null;
let randomizeButton = null;
const randomButtonIconUrl = chrome.runtime.getURL("icons/icon48.png");

function setButtonIcon(buttonElement) {
	buttonElement.innerHTML = `<img src="${randomButtonIconUrl}" alt="Random game" style="width: 34px; height: 34px; display: block; pointer-events: none;" />`;
}

function resetButtonState() {
	// Refresh reference if button was re-created
	if (!randomizeButton || !document.getElementById('randomGameButton')) {
		randomizeButton = document.getElementById('randomGameButton');
	}

	if (randomizeButton) {
		randomizeButton.style.width = "60px";
		randomizeButton.style.borderRadius = "50%";
		randomizeButton.style.padding = "0";
		randomizeButton.style.fontSize = "0";
		randomizeButton.textContent = "";
		randomizeButton.style.background = "#199fff";
		randomizeButton.style.backgroundImage = "none";
		setButtonIcon(randomizeButton);
	}
}

function createButton() {
	randomizeButton = document.createElement("button");
	randomizeButton.id = "randomGameButton";
	randomizeButton.style.cssText = `
		position: fixed !important;
		top: 150px !important;
		right: 40px !important;
		display: flex !important;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		min-width: 60px;
		margin: 0;
		padding: 0;
		font-size: 30px;
		font-weight: 600;
		color: white;
		background: #199fff !important;
		border: none !important;
		border-radius: 50% !important;
		cursor: pointer;
		z-index: 10000 !important;
	`;

	randomizeButton.addEventListener("mouseenter", function() {
		const modal = document.getElementById("extensionModalWinner");
		if (modal && modal.style.display === "flex") {
			return; // Don't show hover text if modal is open
		}

		// Verify button still exists
		if (!document.getElementById('randomGameButton')) {
			return;
		}

		this.style.width = "200px";
		this.style.borderRadius = "30px";
		this.style.padding = "0 24px";
		this.style.fontSize = "16px";
		this.innerHTML = "Get random game!";
		this.style.background = "#1a8cd8";
		this.style.backgroundImage = "none";
	});

	randomizeButton.addEventListener("mouseleave", function() {
		resetButtonState();
	});

	randomizeButton.textContent = "";
	randomizeButton.style.backgroundImage = "none";
	setButtonIcon(randomizeButton);

	// Inject button immediately
	if (!document.getElementById('randomGameButton')) {
		document.body.appendChild(randomizeButton);
	}
}

function ensureButtonExists() {
	const existingButton = document.getElementById('randomGameButton');
	if (!existingButton) {
		createButton();
	}
}

function initializeExtension() {
	pageContainer = getPageContainer();

	if (pageContainer) {
		libraryWrapper = getLibraryWrapper();

		if (libraryWrapper) {
			const currentLibraryElements = libraryWrapper.children;

			if (currentLibraryElements) {
				addListenersToGameTabs(currentLibraryElements);

				return true;
			}
		}
	}
	return false;
}

function setupButtonEventListener() {
	document.addEventListener('click', function(event) {
		if (!(event.target instanceof Element)) {
			return;
		}

		const randomButton = event.target.closest('#randomGameButton');
		if (randomButton) {
			resetButtonState();
			runRandomPickWhenReady();
		}
	});
}

function initializeUI() {
	// Inject modal and CSS immediately on page load
	injectModal();
	injectCSS();

	// Create button immediately on page load
	createButton();

	// Setup event delegation for button clicks
	setupButtonEventListener();

	// Try to initialize immediately, or watch for page changes
	if (!initializeExtension()) {
		const pageObserver = new MutationObserver(function() {
			initializeExtension();

			// Always ensure button exists (in case Steam removed it)
			ensureButtonExists();
		});

		pageObserver.observe(document, {
			childList: true,
			subtree: true
		});
	} else {
		// Even if initialized successfully, keep watching for button removal
		const pageObserver = new MutationObserver(function() {
			initializeExtension();
			ensureButtonExists();
		});

		pageObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
}

// Wait for DOM to be ready before initializing UI
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeUI);
} else {
	initializeUI();
}

function addListenersToGameTabs(libraryElements) {
	for (let i = 0; i < libraryElements.length; i++) {
		if (libraryElements[i].className.includes("sectionTabs")) {
			for (let j = 0; j < libraryElements[i].children.length; j++) {
				const tab = libraryElements[i].children[j];

				if (tab.textContent.includes("Recently") ||
					tab.textContent.includes("All Games") ||
					tab.textContent.includes("Perfect Games")
				) {
					if (tab.dataset.randomGameTabBound === 'true') {
						continue;
					}

					tab.dataset.randomGameTabBound = 'true';
					tab.addEventListener("click", function() {
						if (this.className.includes("active")) {
							return;
						}
						const gamesContainer = getGamesContainer();
						if (!gamesContainer) {
							return;
						}
						const gamesList = gamesContainer.children;
						// Show all hidden games when switching tabs
						for (let k = 0; k < gamesList.length; k++) {
							if (gamesList[k].style.display === "none") {
								gamesList[k].style.display = "";
							}
						}
						arrangeGames(gamesList, true, gamesContainer);
					});
				}
			}
		}
	}
}

function getGamesContainer() {
	initializeExtension();

	if (!libraryWrapper || libraryWrapper.children.length === 0) {
		return null;
	}

	const gamesContainer = libraryWrapper.children[libraryWrapper.children.length - 1];
	return gamesContainer;
}

function runRandomPickWhenReady() {
	const waitIntervalMs = 250;
	const maxWaitMs = 10000;
	const startedAt = Date.now();

	const tryPick = function() {
		const gamesContainer = getGamesContainer();
		if (!gamesContainer || gamesContainer.children.length === 0) {
			return false;
		}

		hideAllGamesExceptOne(gamesContainer);
		arrangeGames(gamesContainer.children, false, gamesContainer);
		return true;
	};

	if (tryPick()) {
		return;
	}

	const waitInterval = setInterval(function() {
		if (tryPick()) {
			clearInterval(waitInterval);
			return;
		}

		if (Date.now() - startedAt >= maxWaitMs) {
			clearInterval(waitInterval);
		}
	}, waitIntervalMs);
}

function arrangeGames(gamesList, arrangeAllGames, gamesContainer) {
	if (!gamesContainer) {
		return;
	}

	let heightOffset = 0;
	for (let i = 0; i < gamesList.length; i++) {
		// Skip hidden games unless we're arranging all games
		if (!arrangeAllGames && gamesList[i].style.display === "none") {
			continue;
		}
		const currentGame = gamesList[i];
		currentGame.style = "top: " + heightOffset + "px;";

		// Check if game has "RESUME" button (means it's a larger card)
		if (currentGame.textContent.includes("RESUME")) {
			heightOffset += 206;
		} else {
			heightOffset += 150;
		}
	}
	// Update the container height
	gamesContainer.style = "height: " + heightOffset + "px;";
}

function hideAllGamesExceptOne(gamesContainer) {
	if (!gamesContainer || gamesContainer.childElementCount === 0) {
		return;
	}

	const excludedTerms = ["test", "server", "beta"];
	const allGames = Array.from(gamesContainer.children);
	const parsedGames = allGames.map((gameElement) => {
		try {
			const gameData = extractGameData(gameElement);
			if (!gameData || !gameData.gameName) {
				return null;
			}

			return gameData;
		} catch (error) {
			return null;
		}
	}).filter((entry) => entry !== null);

	const selectableGames = parsedGames.filter((gameData) => {
		const gameName = gameData.gameName.toLowerCase();
		return !excludedTerms.some((term) => gameName.includes(term));
	});

	const gamePool = selectableGames.length > 0 ? selectableGames : parsedGames;
	if (gamePool.length === 0) {
		return;
	}

	// Pick a random game from the filtered container
	const randomIndex = Math.floor(Math.random() * gamePool.length);
	const gameData = gamePool[randomIndex];
	showModal(gameData.gameUrl, gameData.gameImg, gameData.gameName, gameData.gamePlayed, gameData.achievements);
}

function extractGameData(gameElement) {
	const gameUrl = gameElement.children[0].children[0].href;
	const gameImg = gameElement.children[0].children[0].children[0].children[0].children[0].srcset;
	const gameName = gameElement.children[0].children[1].children[0].textContent;

	const statsContainer = gameElement.children[0].children[2];
	let gamePlayed = "";
	let achievements = "";

	const firstChild = statsContainer.children[0];

	if (firstChild && firstChild.textContent.includes("TOTAL PLAYED")) {
		// Has playtime
		if (firstChild.textContent.includes("LAST TWO")) {
			gamePlayed = statsContainer.children[1].textContent.replace("TOTAL PLAYED", "");
		} else {
			gamePlayed = firstChild.textContent.replace("TOTAL PLAYED", "");
		}

		// Achievements are in the 3rd child (index 2)
		const achievementsDiv = statsContainer.children[2];
		if (achievementsDiv && achievementsDiv.textContent.includes("ACHIEVEMENTS")) {
			if (achievementsDiv.children[0] && achievementsDiv.children[0].children[1]) {
				achievements = achievementsDiv.children[0].children[1].textContent;
			}
		}
	} else if (firstChild && firstChild.textContent.includes("ACHIEVEMENTS")) {
		// No playtime, achievements are first
		if (firstChild.children[0] && firstChild.children[0].children[1]) {
			achievements = firstChild.children[0].children[1].textContent;
		}
	}

	return {
		gameUrl: gameUrl,
		gameImg: gameImg,
		gameName: gameName,
		gamePlayed: gamePlayed,
		achievements: achievements
	};
}

function getPageContainer() {
	// Path to parent of library wrapper: body > div > div > div:nth-of-type(2) > div > div
	const container = document.querySelector('body > div:first-of-type > div > div:nth-of-type(2) > div > div');
	if (container) {
		return container;
	}
}

function getLibraryWrapper() {
	// Library wrapper is the 2nd child (children[1]) - contains tabs and games
	const wrapper = pageContainer ? pageContainer.children[1] : null;
	if (wrapper) {
		return wrapper;
	}
}

function ensureModalExists() {
	let modal = document.getElementById("extensionModalWinner");
	if (!modal) {
		injectModal();
		modal = document.getElementById("extensionModalWinner");
	}

	return modal;
}

function showModal(gameUrl, gameImage, gameName, gamePlayed, achievements) {
	const modal = ensureModalExists();
	const suspenseDiv = document.getElementById("suspense");
	const winnerDiv = document.getElementById("winnerwinnerchickendinner");
	const showKoFiWidget = Math.random() < 0.5;

	// Ensure modal exists
	if (!modal || !suspenseDiv || !winnerDiv) {
		return;
	}

	// Reset button to emoji state
	resetButtonState();

	// Show the modal
	modal.style.display = "flex";

	// Show suspense, hide winner initially
	if (suspenseDiv) {
		suspenseDiv.style.display = "block";
	}
	winnerDiv.style.display = "none";
	winnerDiv.innerHTML = "";

	// Create game content HTML with buttons included
	const playtimeHTML = gamePlayed ? `<p><strong>Played time:</strong> ${gamePlayed}</p>` : '';
	const achievementsHTML = achievements ? `<p><strong>Achievements:</strong> ${achievements}</p>` : '';
	const koFiHTML = showKoFiWidget ? `
		<div id="kofiWidgetContainer">
			<a href="https://ko-fi.com/P5P41SRS6B" target="_blank" rel="noopener noreferrer">
				<img height="36" style="border: 0; height: 36px;" src="https://storage.ko-fi.com/cdn/kofi3.png?v=6" border="0" alt="Buy Me a Coffee at ko-fi.com" />
			</a>
		</div>
	` : "";
	const gameContent = `
		<div class="game-container">
			<div class="image-section">
				<a href="${gameUrl}" target="_blank">
					<img src="${gameImage}" alt="${gameName}">
				</a>
			</div>
			<div class="text-section">
				<p><strong>Game:</strong> ${gameName}</p>
				${playtimeHTML}
				${achievementsHTML}
			</div>
		</div>
		<div id="resetButton">
			<button id="closeModalButton">Close</button>
			<button id="goAgain">Choose Another</button>
		</div>
		${koFiHTML}
	`;

	// Populate the winner div after animation delay
	setTimeout(() => {
		if (suspenseDiv) {
			suspenseDiv.style.display = "none";
		}
		winnerDiv.innerHTML = gameContent;
		winnerDiv.style.display = "block";
	}, 2500);
}

function injectModal() {
	const modalHTML = `
  <div id="extensionModalWinner" style="display: none;">
    <div id="suspense">
      <p>looking for a game</p>
    </div>
    <div id="winnerwinnerchickendinner">
    </div>
  </div>
  `;

	document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function injectCSS() {
	const cssCode = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes flip {
    0% {
      transform: perspective(400px) rotateY(0);
    }
    50% {
      transform: perspective(400px) rotateY(180deg);
    }
    100% {
      transform: perspective(400px) rotateY(360deg);
    }
  }

  #extensionModalWinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 10001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease-in-out;
  }

  #suspense {
    background: linear-gradient(135deg, #199fff 0%, #1579c9 100%);
    border-radius: 16px;
    padding: 40px 60px;
    box-shadow: 0 20px 60px rgba(25, 159, 255, 0.5);
    animation: flip 2s ease-in-out 2, pulse 2s ease-in-out infinite;
    margin-bottom: 20px;
  }

  #suspense p {
    font-size: 32px;
    font-weight: 600;
    color: white;
    margin: 0;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  #winnerwinnerchickendinner {
    background: linear-gradient(135deg, rgba(25, 159, 255, 0.15) 0%, rgba(21, 121, 201, 0.15) 100%);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 25px 70px rgba(25, 159, 255, 0.3);
    max-width: 500px;
    width: 90%;
    border: 2px solid rgba(25, 159, 255, 0.5);
  }

  #winnerwinnerchickendinner:not(:empty) {
    animation: slideUp 0.5s ease-out;
  }

  .game-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .image-section {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .image-section a {
    display: block;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .image-section a:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }

  .image-section img {
    width: 100%;
    max-width: 400px;
    height: auto;
    display: block;
  }

  .text-section {
    width: 100%;
    text-align: center;
  }

  .text-section p {
    margin: 12px 0;
    font-size: 18px;
    color: #ffffff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  .text-section strong {
    color: #199fff;
    font-weight: 600;
  }

  #resetButton {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
    width: 100%;
  }

  #resetButton button {
    flex: 1;
    max-width: 200px;
    padding: 14px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  #closeModalButton {
    background: linear-gradient(135deg, #1579c9 0%, #0d5a8f 100%);
    color: white;
  }

  #closeModalButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(21, 121, 201, 0.6);
    background: linear-gradient(135deg, #1a8cd8 0%, #1579c9 100%);
  }

  #goAgain {
    background: linear-gradient(135deg, #199fff 0%, #1579c9 100%);
    color: white;
  }

  #goAgain:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(25, 159, 255, 0.6);
    background: linear-gradient(135deg, #33adff 0%, #199fff 100%);
  }

  #resetButton button:active {
    transform: translateY(0);
  }

  #kofiWidgetContainer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  `;

	const styleElement = document.createElement('style');
	styleElement.textContent = cssCode;
	document.head.append(styleElement);

	// Add event listeners to modal buttons after modal is injected
	setupModalEventListeners();
}

function setupModalEventListeners() {
	// Use event delegation since modal might not exist yet
	document.addEventListener('click', function(event) {
		if (event.target.id === 'closeModalButton') {
			const modal = document.getElementById('extensionModalWinner');
			const suspenseDiv = document.getElementById('suspense');
			const winnerDiv = document.getElementById('winnerwinnerchickendinner');
			if (modal) {
				modal.style.display = 'none';
			}
			if (suspenseDiv) {
				suspenseDiv.style.display = 'block';
			}
			if (winnerDiv) {
				winnerDiv.innerHTML = '';
				winnerDiv.style.display = 'none';
			}
		}

		if (event.target.id === 'goAgain') {
			const winnerDiv = document.getElementById('winnerwinnerchickendinner');
			if (winnerDiv) {
				winnerDiv.innerHTML = '';
				winnerDiv.style.display = 'none';
			}
			// Trigger another randomization without closing modal
			runRandomPickWhenReady();
		}
	});
}
