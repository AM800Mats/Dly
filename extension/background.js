
function getCostcoScore() {
  let checkElement = document.getElementsByClassName('guess-direction-container animate__flipInX guess-win')[0];
  if (checkElement) {
    let guessNum = checkElement.parentElement.id;
    console.log('Sending message to popup.js:' + guessNum);
    chrome.runtime.sendMessage({ score: guessNum });
  }
  else {
    let guessNum = 'DNF';
    console.log('Sending message to popup.js:' + guessNum);
    chrome.runtime.sendMessage({ score: guessNum });
  }
}

function getFoodguessrScore() {
  let scoreDiv = document.querySelector('.select-none.text-black');
  let clonedScoreDiv = scoreDiv.cloneNode(true);
  let childElements = clonedScoreDiv.querySelectorAll('*');
  for (let i = 0; i < childElements.length; i++) {
    childElements[i].parentNode.removeChild(childElements[i]);
  }
  let score = clonedScoreDiv.textContent;
  console.log('Sending message to popup.js');
  chrome.runtime.sendMessage({ score: score });
}

function getGlobleScore() {
  let scoreElement = document.querySelector('[data-cy="today\'s-guesses"]');
  if (!scoreElement) {
    console.log('No score element found');
    return;
  }
  let score = scoreElement.textContent;
  console.log('Sending message to popup.js');
  chrome.runtime.sendMessage({ score: score }); 
}

function getMapgameScore() {
  let scoreElement = document.getElementsByClassName('tada')[0];
  if (!scoreElement) {
    console.log('No score element found');
    return;
  }
  score = scoreElement.textContent;
  chrome.runtime.sendMessage({ score: score });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'getScore') {
      return;
  }
  chrome.tabs.query({active: true}, function(tabs) {
    if (tabs.length === 0) {
      console.log('No active tabs');
      return;
    }
    let tab = tabs[0]; // the current tab

    //switch cases for each url of supported games
    switch (true) {
    case tab.url.includes("costcodle.com"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getCostcoScore
      });
      break;
    case tab.url.includes("foodguessr.com/final-results"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getFoodguessrScore
      });
      break;
    case tab.url.includes("globle-game.com/game"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getGlobleScore
      });
      break;
    case tab.url.includes("mapgame.net"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getMapgameScore
      });
    default:
      console.log('No matching scripts for this URL');
    }
  });
});