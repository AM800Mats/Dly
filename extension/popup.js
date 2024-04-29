let a = 0;
/**
 * Event listener for the DOMContentLoaded event.
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  /**
   * Click event listener for the start button.
   */
  let startButton = document.getElementById('getScoreFromPage');
  startButton.addEventListener('click', () => {
    /**
     * Query the active tab and send a message to the background script to get the score.
     */
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage({tabId: tabs[0].id, action: "getScore"});
    });

    /**
     * Event listener for the runtime message.
     * @param {Object} request - The message request object.
     * @param {Object} sender - The sender object.
     * @param {Function} sendResponse - The function to send a response.
     */
    let listener = function(request, sender, sendResponse) {
      if (request.score) {
        a++;
        console.log('received score' + request.score + sender + a);
        document.getElementById("score").textContent = request.score;
        chrome.runtime.onMessage.removeListener(listener);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    
  });
});

