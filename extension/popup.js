let a = 0;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage({tabId: tabs[0].id});
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // The score is in request.score
    if (request.score) {
        a = a + 1;
        console.log(request.score);
        document.getElementById("score").textContent = request.score + a;
      }
  });