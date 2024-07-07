//TODO: Add more games (OEC TRADLE!!!, GEOCIRCS!, UNZOOMED!)
//TODO: check for edge cases & if user is on actual daily game page results page
//TODO: Check if webpage has been modified? prevent cheating

// Supported games:
// - costcodle
// - foodguessr
// - globle
// - mapgame
// - timeguessr
// - worldle
// - travle

function convScore(gameScore, maxScore, reversed) {
  if (gameScore === -1) {
    gameScore = maxScore + 1;
  }
  switch (reversed) {
    case true:
      return (maxScore + 1 - gameScore) * (100 / maxScore);
    case false:
      return (gameScore / (maxScore/100));
  }
}

function getCostcoScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }
  let checkElement = document.getElementsByClassName('guess-direction-container animate__flipInX guess-win')[0];
  if (checkElement) {
    let guessNum = parseInt(checkElement.parentElement.id);
    console.log('Sending message to popup.js:' + guessNum);
    let relScore = convScore(guessNum, 6, true);
    chrome.runtime.sendMessage({ score: guessNum , relScore: relScore});
  }
  else {
    let guessNum = -1;
    console.log('Sending message to popup.js:' + guessNum);
    chrome.runtime.sendMessage({ score: guessNum , relScore: 0.0, gameID: 'Costcodle'});
  }
}

function getFoodguessrScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }

  let checkElement = document.getElementsByClassName('rounded-full mt-4 h-14  w-full px-4 py-2 font-bold text-white hover:bg-slate-700 bg-slate-400')[0];
  if (!checkElement) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
    return;
  }
  let scoreDiv = document.querySelector('.select-none.text-black');
  let clonedScoreDiv = scoreDiv.cloneNode(true);
  let childElements = clonedScoreDiv.querySelectorAll('*');
  for (let i = 0; i < childElements.length; i++) {
    childElements[i].parentNode.removeChild(childElements[i]);
  }
  let score = parseInt(clonedScoreDiv.textContent.replace(/,/g, ''));
  let relScore = convScore(score, 15000, false);
  console.log('Sending message to popup.js');
  chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Foodguessr'});
}

function getGlobleScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }
  let scoreElement = document.querySelector('[data-cy="today\'s-guesses"]');
  if (!scoreElement) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
    return;
  }
  let score = scoreElement.textContent;
  console.log('Sending message to popup.js');
  let relScore = convScore(score, 20, true);
  chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Globle'}); 
}

function getMapgameScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }
  let scoreElement = document.getElementsByClassName('tada')[0];
  if (!scoreElement) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
    return;
  }
  let score = parseInt(scoreElement.textContent);
  let relScore = convScore(score, 100000, false);
  chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Mapgame'});
}

function getWorldleScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }
  let Element = document.getElementsByClassName('flex items-center justify-center border-2 h-8 col-span-1 animate-reveal animate-pop rounded')[0];
  if (!Element) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
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
  let relScore = convScore(score, 6, true);
  chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Worldle'});
}

function getTimeScore() {
  function convScore(gameScore, maxScore, reversed) {
  if (gameScore === -1) {
    gameScore = maxScore + 1;
  }
  switch (reversed) {
    case true:
      return (maxScore + 1 - gameScore) * (100 / maxScore);
    case false:
      return (gameScore / (maxScore/100));
  }
}
  let scoreElement = document.getElementById('totalText');
  if (!scoreElement) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
    return;
  }
  let score = parseInt(scoreElement.textContent.replace(/,/g, ''));
  let relScore = convScore(score, 15000, false)
  chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Timeguessr'});
}

function getTravleScore() {
  function convScore(gameScore, maxScore, reversed) {
    if (gameScore === -1) {
      gameScore = maxScore + 1;
    }
    switch (reversed) {
      case true:
        console.log('maxScore: ' + maxScore + ' gameScore: ' + gameScore);
        console.log((maxScore + 1 - gameScore) + ' * ' + (100 / maxScore));
        return (maxScore + 1 - gameScore) * (100 / maxScore);
      case false:
        return (gameScore / (maxScore/100));
    }
  }
  resultsElement = document.getElementById('resultsModalText');
  if (!resultsElement) {
    console.log('No score element found');
    chrome.runtime.sendMessage({ invalid: true});
    return;
  }

  // If the user failed to guess correctly
  if (resultsElement.firstChild.textContent.includes("So close.")) {
    let failedScore = -1;
    chrome.runtime.sendMessage({ score: failedScore , relScore: 0.0});
  } 
  // If the user guessed correctly
  else if (resultsElement.firstChild.textContent.includes("Success!")) {
    let guessElement = resultsElement.firstChild.nextSibling.textContent;
    let numGuesses = parseInt(guessElement.split(' ')[0]);
    let perfGuesses = parseInt(resultsElement.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.textContent.split(' ')[0]);
    let maxGuesses = 0;
    switch (true) {
      case perfGuesses === 3:
        maxGuesses = 4;
        break;
      case perfGuesses > 3 && perfGuesses <= 6:
        maxGuesses = 5;
        break;
      case perfGuesses > 6 && perfGuesses <= 9:
        maxGuesses = 6;
        break;
      case perfGuesses > 9 && perfGuesses <= 12:
        maxGuesses = 7;
        break;
      case perfGuesses > 12:
        maxGuesses = 8;
        break;
    }
    let score = (numGuesses - perfGuesses);
    //changing score to work with convScore function, since 0 extra guesses case doesn't work with it
    let workableScore = score + 1;
    let relScore = convScore(workableScore, maxGuesses, true);
    chrome.runtime.sendMessage({ score: score , relScore: relScore, gameID: 'Travle'});
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