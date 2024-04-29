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
    switch (true) {
    case tab.url.includes("costcodle.com"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function() {
          let checkElement = document.getElementsByClassName('guess-direction-container animate__flipInX guess-win')[0];
          if (checkElement){
            let guessNum = checkElement.parentElement.id;
            console.log('Sending message to popup.js:' + guessNum);
            chrome.runtime.sendMessage({score: guessNum});
          }
          else {
            let guessNum = 'DNF';
            console.log('Sending message to popup.js:' + guessNum);
            chrome.runtime.sendMessage({score: guessNum});
          }
        }
      });
      break;
    case tab.url.includes("foodguessr.com/final-results"):
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function() {
          let scoreDiv = document.querySelector('.select-none.text-black');
          let clonedScoreDiv = scoreDiv.cloneNode(true);
          let childElements = clonedScoreDiv.querySelectorAll('*');
          for (let i = 0; i < childElements.length; i++) {
            childElements[i].parentNode.removeChild(childElements[i]);
          }
          let score = clonedScoreDiv.textContent;
          console.log('Sending message to popup.js');
          chrome.runtime.sendMessage({score: score});
        }
      });
      break;
      default:
        console.log('No matching scripts for this URL');
    }
  });
});