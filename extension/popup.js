/**
 * Event listener for the DOMContentLoaded event.
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  let userIdInputSection = document.getElementById('userIdInputSection');
  let userIdInput = document.getElementById('userIdInput');
  let saveUserIdButton = document.getElementById('saveUserId');
  let changeUserIdButton = document.getElementById('changeUserId');
  let sendScoreButton = document.getElementById('sendScore');
  let getScoreButton = document.getElementById('getScore');

  // Load and display the current user_id if it exists
  chrome.storage.local.get(["userId"], function(result) {
    if (result.userId) {
      userIdInputSection.style.display = 'none';
      changeUserIdButton.style.display = 'block';
      userIdInput.value = result.userId; // Optional: Display the current ID in the input field
    }
  });

  saveUserIdButton.addEventListener('click', function() {
    let userId = userIdInput.value;
    chrome.storage.local.set({userId: userId}, function() {
      console.log('UserID saved');
      userIdInputSection.style.display = 'none';
      changeUserIdButton.style.display = 'block';
    });
  });

  changeUserIdButton.addEventListener('click', function() {
    userIdInputSection.style.display = 'block';
    changeUserIdButton.style.display = 'none';
  });


  sendScoreButton.addEventListener('click', () => {

    chrome.storage.local.get(["savedScore", "savedRelScore", "savedGameID", "userId"], function(result) {

      if (result.savedScore && result.savedRelScore && result.savedGameID) {

        console.log("Sending score to server:", result.userId, result.savedScore, result.savedRelScore, result.savedGameID);

        fetch('http://localhost:3500/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: result.userId,
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

