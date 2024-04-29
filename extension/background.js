chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
            files: ['Costco.js']
          });
          break;
        case tab.url.includes("foodguessr.com/final-results"):
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: function() {
                let scoreDiv = document.querySelector('.select-none.text-black');
                let clonedScoreDiv = scoreDiv.cloneNode(true);
                let childElements = clonedScoreDiv.querySelectorAll('*');
                for (let i = 0; i < childElements.length; i++) {
                    childElements[i].parentNode.removeChild(childElements[i]);
                }
                let score = clonedScoreDiv.textContent;
                console.log(score);
                console.log('Sending message to background.js');
                chrome.runtime.sendMessage({score: score});
            }
          });
          break;
        default:
          console.log('No matching scripts for this URL');
      }
    });
});