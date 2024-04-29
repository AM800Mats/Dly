let a = 0;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage({tabId: tabs[0].id});
  });


document.addEventListener('DOMContentLoaded', (event) => {
    let startButton = document.getElementById('getScoreFromPage');
    startButton.addEventListener('click', () => {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // The score is in request.score
        if (request.score) {
            console.log(request.score);
            document.getElementById("score").textContent = request.score;
          }
      });
    });
});

