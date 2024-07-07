/**
 * Event listener for the DOMContentLoaded event.
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  /**
   * Click event listener for the start button.
   */
  let getScoreButton = document.getElementById('getScoreFromPage');
  let sendScoreButton = document.getElementById('sendScoreToServer');

  document.getElementById('loginPageButton').addEventListener('click', function() {
    chrome.tabs.create({url: 'login.html'});
  });


  sendScoreButton.addEventListener('click', () => {

    chrome.storage.local.get(["savedScore", "savedRelScore", "savedGameID"], function(result) {

      if (result.savedScore && result.savedRelScore && result.savedGameID) {

        console.log("Sending score to server:", result.savedScore, result.savedRelScore, result.savedGameID);
        
        let username = 'anonymous'; // Placeholder for username

        fetch('http://localhost:5000/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: username,
            game: result.savedGameID,
            absolute_score: result.savedScore,
            relative_score: result.savedRelScore,
          }),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => {
          console.error('Error:', error);
        });

      }

      else {
        console.log("No score saved, try getting the score first.");
      }
    });
  });

  getScoreButton.addEventListener('click', () => {
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
        request.relScore = parseFloat(request.relScore).toFixed(1); // round relScore to 1 decimal place
        console.log('received score, relscore: ' + request.score + ', ' + request.relScore);

        document.getElementById("score").textContent = 'score: ' + request.score + ', relative score: ' + request.relScore + ', from game:  ' + request.gameID;

        chrome.storage.local.set({ "savedScore": request.score, "savedRelScore": request.relScore, "savedGameID": request.gameID }, function() {
          console.log("Score saved temporarily.");
        });

        chrome.runtime.onMessage.removeListener(listener);
      }
      else if (request.invalid) {
        console.log('invalid score');
        document.getElementById("score").textContent = 'Couldn\'t get score, make sure you are on the correct page.';
        chrome.runtime.onMessage.removeListener(listener);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
  });
});

