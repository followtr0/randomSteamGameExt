console.log("testing this shit")

let notGaben = null;
let valve = null;
let steam = null;
let games = null;
let badge = null;
let gamesLeftToRandom = 10;
let hiddenGames = new Array();
let lastScrolledElement = null;
let timeoutID = 0;

const observerMain = new MutationObserver(function (mutations, mutationInstance) {

  notGaben = getGaben();
  if (notGaben) {
    valve = getValve();
    if (valve) {
      steam = valve.childNodes;
      if (steam) {
        injectModal();
        injectCSS();


        badge = document.createElement("button");
        badge.style.marginBottom = "10px"
        badge.style.position = "sticky"
        badge.style.top = "0px"
        badge.style.left = "0px"
        badge.style.zIndex = "999"
        badge.style.backgroundColor = "#199fff"
        badge.style.padding = "20px"
        badge.class

        addListenersToGameTabs(steam)
        //refresh on click tab

        badge.addEventListener("click", function () {
          // Update text content on click
          badge.textContent = "Clicked!";
          console.log("gaben", notGaben);
          console.log("valve", valve);
          console.log("steam", steam);
          // Run a function (replace with your function)
          // randomizeGame(steam[steam.length - 1])
          hideGame(steam[steam.length - 1]);
          arrangeGames(steam[steam.length - 1].children, false);
          appendTexT();
        });

        badge.textContent = "Click to get your random game!";
        valve.insertAdjacentElement('afterbegin', badge)
        console.log("added paragraph to big guy");
        mutationInstance.disconnect();
      }

    }
  }
});

function addListenersToGameTabs (steam) {
  for (let i = 0; i < steam.length; i++) {
    if (steam[i].className.includes("sectionTabs")) {
      for (let j = 0; j < steam[i].children.length; j++) {

        if (steam[i].children[j].textContent.includes("Recently") ||
          steam[i].children[j].textContent.includes("All Games") ||
          steam[i].children[j].textContent.includes("Perfect Games")
        ) {

          steam[i].children[j].addEventListener("click", function (event) {
            console.log("TEEEEEEEEEEEEEEEEEEEEEEEEST");
            if (this.className.includes("active")) {
              return;
            }
            let gamesList = steam[steam.length - 1].children;
            for (let k = 0; k < gamesList.length; k++) {
              //set height
              if (gamesList[k].style.display == 'none') {
                gamesList[k].style.display = '';
              }
            }
            arrangeGames(gamesList, true)
          })

        }
      }
    }
  }
}

function arrangeGames (gameList, arrangeAllGames) {
  let height = 0;
  for (let i = 0; i < gameList.length; i++) {
    if (!arrangeAllGames && gameList[i].style.display == 'none') {
      continue
    }
    let currentGame = gameList[i];
    currentGame.style = "top: " + height + "px;"
    if (currentGame.textContent.includes("RESUME")) {
      height += 206;
    } else {
      height += 150;
      //   }
    }
  }
  steam[steam.length - 1].style = "height: " + height + "px;"
}

function hideGame (gameList) {
  hiddenGames = new Array();
  let taken = new Array();
  let gamesHidden = 0;

  while (gamesHidden <= gameList.childElementCount - 1) {
    let gameToHide = Math.floor(Math.random() * gameList.childElementCount);
    while (taken.includes(gameToHide)) {
      gameToHide = Math.floor(Math.random() * gameList.childElementCount);
    }

    if (gamesHidden == gameList.childElementCount - 1) {
      document.getElementById('extensionModalWinner').style.display = 'block';
      gameList.children[gameToHide].style.top = "0px"
      document.getElementById('winnerwinnerchickendinner').appendChild(gameList.children[gameToHide]);
      break;
    } else {
      // gameList.children[gameToHide].style.display = 'none'
      gamesHidden++;
      hiddenGames.push(gameList.children[gameToHide])
      taken.push(gameToHide)
    }
  }


}

function randomizeGame (listOfGames) {
  // listOfGames.childNodes[5].childNodes.sort();
  console.log("this much", listOfGames)
  console.log("games?", listOfGames.childNodes)
  let randomGames = getRandom(listOfGames.childNodes, listOfGames.childNodes.length - 5);
  randomGames.forEach(x => x.style.display = 'none');
  console.log("child of child fucking shitty js", steam[steam.length - 1].childNodes)

  console.log("Button clicked! Your custom function is executed.");
}
//todo 
// if user changed tabs rerun the get nodes observer and refresh button? 
// the badge should be a button that removes 1 by 1 the games in the list
// when list has less than 30 games it focuses on removal on the game until 1 is left
// after that show a button to go agane
observerMain.observe(document, {
  childList: true,
  subtree: true
});


console.log("TESTING")
function appendTexT () {
  badge.textContent = "TEST CLICKED TEST TEST TEST"
}
function getGaben () {
  const gaben = document
    .querySelector('#responsive_page_template_content > div:nth-child(4)')
  if (gaben) {
    return gaben;
  }
}
function getValve () {
  const valve = notGaben.querySelector('div:first-child')

  if (valve) {
    return valve;
  }
}
function getRandom (arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}



function injectModal () {
  const modalHTML = `
  <head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</head>

<body>
  
  <div id="extensionModalWinner" style="display: none;">
    
  <div id="suspense" class="animate__animated animate__flip animate__repeat-2 2"><p>Finding your game!!!</p></div>
    <div id="winnerwinnerchickendinner" class="animate__animated animate__fadeInUpBig animate__delay-4s">
    </div>
    
 
  <div id="resetButton">
    <button id="closeModalButton">Close</button>
    <button id="goAgain">Choose Another</button>
  </div>
  </div>
</body>
  `;

  // Inject the modal into the page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function injectCSS () {
  const cssCode = `
  body {
    font-family: "Motiva Sans",Arial,Helvetica,sans-serif;
  }
  #extensionModalWinner {
    flex-direction: column; /* Items stack vertically */
    display: flex; 
    position: fixed; /* Stay in place even when scrolling */
    z-index: 1000; /* Ensure it sits on top of other elements */
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; /* Add scroll if modal content is large */
    background-color: rgba(0,0,0,0.9); /* Black with 50% opacity */
}

#suspense {
  margin: 15% auto; /* 15% from top/bottom, auto horizontally */
  margin-bottom: -140px;
  margin-top: 150px;
  z-index: -999;
  height: 140px;
  width: 88%;
  background-color:  #199fff;
  position: relative; /* Required for centering absolutely positioned children */
}

#suspense p {
  font-size: 36px;       
  color: black;         
  margin-top: 40px;     

  display: flex;              /* Turn the paragraph into a flex container */
  justify-content: center;    /* Center horizontally */
  align-items: center;   
}


#winnerwinnerchickendinner {
    margin: 15% auto; /* 15% from top/bottom, auto horizontally */
    height: 140px;
    margin-top: -140px;
    margin-bottom: 0px;
    z-index: -900;
    border: 1px solid #888;
    background-color: #199fff;
    width: 88%; /* Adjust the width as needed */
    position: relative; /* Required for centering absolutely positioned children */
}


#resetButton {
  position: absolute;    /* Place button container absolutely */
  bottom: 10px;          /* Distance from the bottom */
  width: 88%;           /* Stretch across the modal */
  display: flex;         /* Use flexbox for aligning the buttons */
  justify-content: space-between; /* Put space between the buttons */
}

#resetButton button {  
  flex-grow: 1;      /* Makes buttons take up equal space if needed */
}  
   `;

  const styleElement = document.createElement('style');
  styleElement.textContent = cssCode;
  document.head.append(styleElement);


  const closeButton = document.getElementById('closeModalButton');

  // Attach a click event listener to hide the modal 
  closeButton.addEventListener('click', () => {
    document.getElementById('extensionModalWinner').style.display = 'none';
    document.getElementById('winnerwinnerchickendinner').innerHTML = '';
  });
}






//if class name contains sectionTabs
//see which one is active (find text of inner child with active class name) x.classList.contains('active')

//if class name contains gameslistitems then its game list
//iterate through all and save a list of every name
//also get the image probably

//create html to select a random game from the list
// add button on page which will randomly delete games fro the list until one remains from the selected tab
// while list of games size > 0
//pick random number from initial size and remove the element from list
const closeButton = document.getElementById('closeModalButton');

// Attach a click event listener to hide the modal 
closeButton.addEventListener('click', () => {
  document.getElementById('extensionModalWinner').style.display = 'none';

});//