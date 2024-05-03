
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

function getWorldleScore() {
  let Element = document.getElementsByClassName('flex items-center justify-center border-2 h-8 col-span-1 animate-reveal animate-pop rounded')[0];
  if (!Element) {
    console.log('No score element found');
    return;
  }
  let siblingCount = 1;
  let sibling = Element.parentNode.firstChild;
  while (sibling) {
      if (sibling.nodeType === 1 && sibling !== Element) {
          siblingCount++;
      }
      sibling = sibling.nextSibling;
  }
  let score = siblingCount/4;

  chrome.runtime.sendMessage({ score: score });
}

function getTimeScore() {
  let scoreElement = document.getElementById('totalText');
  if (!scoreElement) {
    console.log('No score element found');
    return;
  }
  score = scoreElement.textContent;
  chrome.runtime.sendMessage({ score: score });
}

function getTravleScore() {
  resultsElement = document.getElementById('resultsModalText');
  if (!resultsElement) {
    console.log('No score element found');
    return;
  }

  // If the user failed to guess correctly
  if (resultsElement.firstChild.textContent.includes("So close.")) {
    let failedScore = -1;
    chrome.runtime.sendMessage({ score: failedScore });
  } 
  // If the user guessed correctly
  else if (resultsElement.firstChild.textContent.includes("Success!")) {
    let guessElement = resultsElement.firstChild.nextSibling.textContent;
    let numGuesses = guessElement.split(' ')[0];
    let perfGuesses = resultsElement.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.split(' ')[0];
    let score = numGuesses - perfGuesses;
    chrome.runtime.sendMessage({ score: score });
  }
}


// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'getScore') {
      return;
  }
  // Get the active tab	
  chrome.tabs.query({active: true}, function(tabs) {
    if (tabs.length === 0) {
      console.log('No active tabs');
      return;
    }
    let tab = tabs[0]; // the current tab

    //switch cases for each url of supported games
    //TODO: Add more games & check for edge cases & if user is on actual daily game page results page
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
      break;
    case tab.url.includes("timeguessr.com/finalscoredaily"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getTimeScore
      });
      break;
    case tab.url.includes("worldle.teuteuf.fr"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getWorldleScore
      });
      break;
    case tab.url === "https://travle.earth/":
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getTravleScore
      });
      break;
    default:
      console.log('No matching scripts to get score for this URL: ' + tab.url);
    }
  });
});