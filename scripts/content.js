let pageContainer = null;
let libraryWrapper = null;
let libraryElements = null;
let randomizeButton = null;
let hiddenGames = [];

const pageObserver = new MutationObserver(function(mutations, observerInstance) {
	debugger;
	pageContainer = getPageContainer();
	if (pageContainer) {
		libraryWrapper = getLibraryWrapper();
		if (libraryWrapper) {
			libraryElements = libraryWrapper.childNodes;
			if (libraryElements) {
				injectModal();
				injectCSS();

				randomizeButton = document.createElement("button");
				randomizeButton.style.marginBottom = "10px";
				randomizeButton.style.top = "0px";
				randomizeButton.style.left = "0px";
				randomizeButton.style.zIndex = "999";
				randomizeButton.style.backgroundColor = "#199fff";
				randomizeButton.style.padding = "20px";

				addListenersToGameTabs(libraryElements);

				randomizeButton.addEventListener("click", function() {
					randomizeButton.textContent = "Clicked!";
					hideAllGamesExceptOne(libraryElements[libraryElements.length - 1].children[5]);
					arrangeGames(libraryElements[libraryElements.length - 1].children, false);
					updateButtonText();
				});

				randomizeButton.textContent = "Click to get your random game!";
				libraryWrapper.insertAdjacentElement("afterbegin", randomizeButton);
				observerInstance.disconnect();
			}
		}
	}
});

function addListenersToGameTabs(libraryElements) {
	for (let i = 0; i < libraryElements.length; i++) {
		if (libraryElements[i].className.includes("sectionTabs")) {
			for (let j = 0; j < libraryElements[i].children.length; j++) {
				const tab = libraryElements[i].children[j];

				if (tab.textContent.includes("Recently") ||
					tab.textContent.includes("All Games") ||
					tab.textContent.includes("Perfect Games")
				) {
					tab.addEventListener("click", function() {
						if (this.className.includes("active")) {
							return;
						}
						const gamesList = libraryElements[libraryElements.length - 1].children;
						// Show all hidden games when switching tabs
						for (let k = 0; k < gamesList.length; k++) {
							if (gamesList[k].style.display === "none") {
								gamesList[k].style.display = "";
							}
						}
						arrangeGames(gamesList, true);
					});
				}
			}
		}
	}
}

function arrangeGames(gamesList, arrangeAllGames) {
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
	libraryElements[libraryElements.length - 1].style = "height: " + heightOffset + "px;";
}

function hideAllGamesExceptOne(gamesContainer) {
	hiddenGames = [];
	const usedIndices = [];
	let gamesHidden = 0;

	debugger;
	while (gamesHidden <= gamesContainer.childElementCount - 1) {
		let randomIndex = Math.floor(Math.random() * gamesContainer.childElementCount);
		
		// Find a unique random index
		while (usedIndices.includes(randomIndex)) {
			randomIndex = Math.floor(Math.random() * gamesContainer.childElementCount);
		}

		// Last game remaining is the winner
		if (gamesHidden === gamesContainer.childElementCount - 1) {
			const winningGame = gamesContainer.children[randomIndex];
			winningGame.style.top = "0px";

			const gameData = extractGameData(winningGame);
			showModal(gameData.gameUrl, gameData.gameImg, gameData.gameName, gameData.gamePlayed);
			break;
		} else {
			gamesHidden++;
			hiddenGames.push(gamesContainer.children[randomIndex]);
			usedIndices.push(randomIndex);
		}
	}
}

function extractGameData(gameElement) {
	debugger;
	const gameUrl = gameElement.children[0].children[0].children[0].href
	const gameImg = gameElement.children[0].children[0].children[0].children[0].children[0].children[0].srcset;
	const gameName = gameElement.children[0].children[0].children[1].children[0].textContent;
	
	// Handle different layouts for playtime display
	let gamePlayed = gameElement.children[0].children[0].children[2].children[0].textContent.replace("TOTAL PLAYED", "");
	if (gameElement.children[0].children[0].children[2].children[0].textContent.includes("LAST TWO")) {
		gamePlayed = gameElement.children[0].children[0].children[2].children[1].textContent.replace("TOTAL PLAYED", "");
	}

	return {
		gameUrl: gameUrl,
		gameImg: gameImg,
		gameName: gameName,
		gamePlayed: gamePlayed
	};
}

function getRandomGames(gamesList, count) {
	const result = new Array(count);
	const totalGames = gamesList.length;
	const usedIndices = new Array(totalGames);
	
	if (count > totalGames) {
		throw new RangeError("getRandomGames: more elements requested than available");
	}
	
	while (count--) {
		let randomIndex = Math.floor(Math.random() * totalGames);
		result[count] = gamesList[randomIndex in usedIndices ? usedIndices[randomIndex] : randomIndex];
		usedIndices[randomIndex] = --totalGames in usedIndices ? usedIndices[totalGames] : totalGames;
	}
	return result;
}

// Start observing the page for Steam library to load
pageObserver.observe(document, {
	childList: true,
	subtree: true
});

function updateButtonText() {
	randomizeButton.textContent = "TEST CLICKED TEST TEST TEST";
}

function getPageContainer() {
	const container = document.querySelector('#responsive_page_template_content > div:nth-child(4)');
	if (container) {
		return container;
	}
}

function getLibraryWrapper() {
	const wrapper = pageContainer.querySelector('div:first-child');
	if (wrapper) {
		return wrapper;
	}
}

function showModal(gameUrl, gameImage, gameName, gamePlayed) {
	const modalContent = `<head>
  <title>Game Display</title>
  <style>
    .game-container {
      width: 400px;
      display: flex;
    }

    .image-section {
      width: 50%;
    }

    .image-section img {
      max-width: 100%;
      height: auto;
    }

    .text-section {
      width: 50%;
      padding: 15px;
    }
  </style>
</head>

<body>
<div id="extensionModalWinner">
  <div class="game-container">
    <div class="image-section">
      <a href="${gameUrl}">
        <img src="${gameImage}" alt="Game Image">
      </a>
    </div>

    <div class="text-section">
      <p><strong>Game: </strong>${gameName}</p>
      <p><strong>Played time: </strong>${gamePlayed}</p>
    </div>
  </div>
  <div id="resetButton">
    <button id="closeModalButton">Close</button>
    <button id="goAgain">Choose Another</button>
  </div>
</div>
</body>`;

	document.body.insertAdjacentHTML('beforeend', modalContent);
}

function injectModal() {
	const modalHTML = `
  <head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</head>

<body>
  <div id="extensionModalWinner" style="display: none;">
    <div id="suspense" class="animate__animated animate__flip animate__repeat-2 2">
      <p>Finding your game!!!</p>
    </div>
    <div id="winnerwinnerchickendinner" class="animate__animated animate__fadeInUpBig animate__delay-4s">
    </div>
    <div id="resetButton">
      <button id="closeModalButton">Close</button>
      <button id="goAgain">Choose Another</button>
    </div>
  </div>
</body>
  `;

	document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function injectCSS() {
	const cssCode = `
  body {
    font-family: "Motiva Sans",Arial,Helvetica,sans-serif;
  }
  
  #extensionModalWinner {
    flex-direction: column;
    display: flex; 
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto;
    background-color: rgba(0,0,0,0.9);
  }

  #suspense {
    margin: 15% auto;
    margin-bottom: -140px;
    margin-top: 150px;
    z-index: -999;
    height: 140px;
    width: 88%;
    background-color: #199fff;
    position: relative;
  }

  #suspense p {
    font-size: 36px;       
    color: black;         
    margin-top: 40px;     
    display: flex;
    justify-content: center;
    align-items: center;   
  }

  #winnerwinnerchickendinner {
    margin: 15% auto;
    height: 140px;
    margin-top: -140px;
    margin-bottom: 0px;
    z-index: -900;
    border: 1px solid #888;
    background-color: #199fff;
    width: 88%;
    position: relative;
  }

  #resetButton {
    position: absolute;
    bottom: 10px;
    width: 88%;
    display: flex;
    justify-content: space-between;
  }

  #resetButton button {  
    flex-grow: 1;
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
			const winnerDiv = document.getElementById('winnerwinnerchickendinner');
			if (modal) modal.style.display = 'none';
			if (winnerDiv) winnerDiv.innerHTML = '';
		}
		
		if (event.target.id === 'goAgain') {
			const modal = document.getElementById('extensionModalWinner');
			const winnerDiv = document.getElementById('winnerwinnerchickendinner');
			if (modal) modal.style.display = 'none';
			if (winnerDiv) winnerDiv.innerHTML = '';
			// Trigger another randomization
			hideAllGamesExceptOne(libraryElements[libraryElements.length - 1]);
			arrangeGames(libraryElements[libraryElements.length - 1].children, false);
		}
	});
}

// TODO:
// - Show modal buttons only after the game has been selected
// - Create cleaner HTML structure for modal with proper game data display
// - Add "Choose Another" button functionality