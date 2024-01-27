console.log("testing this shit")

let bigGuy = null;
let innerNodes = null;
let elemntList = null;
let badge = null;
const observerMain = new MutationObserver(function (mutations, mutationInstance) {
  bigGuy = getMainNode();

  if (bigGuy) {
    innerNodes = getSecondaryNodes();
    if (innerNodes) {
      elemntList = innerNodes.childNodes;
      console.log(elemntList);
      if (elemntList) {
        badge = document.createElement("button");
        badge.classList.add("item")
        badge.classList.add("responsive_tab_baseline")
        badge.classList.add("active");
        badge.addEventListener("click", function () {
          // Update text content on click
          badge.textContent = "Clicked!";

          // Run a function (replace with your function)
          appendTexT();
        });

        badge.textContent = "TEST TEST TEST TEST TEST";
        innerNodes.insertAdjacentElement('afterbegin', badge)
        console.log("added paragraph to big guy");
        mutationInstance.disconnect();
      }

    }
  }
});

function myFunction () {
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
  console.log("clicked")
  badge.textContent = "TEST CLICKED TEST TEST TEST"
}
function getMainNode () {
  const nodes = document
    .querySelector('#responsive_page_template_content > div:nth-child(4)')
  if (nodes) {
    console.log(nodes);
  }
  return nodes;
}

function getSecondaryNodes () {
  const innerNodes = bigGuy.querySelector('div:first-child')

  if (innerNodes) {
    console.log(innerNodes);
  }
  return innerNodes;
}

// nodes.forEach(x => {
//   if (x.classList.contains('active')) {
//     console.log(x.innerText)
//   }
// });


//if class name contains sectionTabs
//see which one is active (find text of inner child with active class name) x.classList.contains('active')

//if class name contains gameslistitems then its game list
//iterate through all and save a list of every name
//also get the image probably

//create html to select a random game from the list
// add button on page which will randomly delete games fro the list until one remains from the selected tab
// while list of games size > 0
//pick random number from initial size and remove the element from list
//