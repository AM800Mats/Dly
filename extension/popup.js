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

  function showTemporaryPopup(message, duration) {
    let popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = "rgba(76, 175, 80, 0.9)";
    popup.style.color = "white";
    popup.style.padding = "10px";
    popup.style.borderRadius = "5px";
    popup.style.zIndex = "1000";
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, duration);
  }

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
        .then(data => {
          console.log('Success:', data);
          // Show the popup message
          showTemporaryPopup("Score submitted", 5000); // Show for 2 seconds
        })
        .catch((error) => {
          console.error('Error:', error);
          showTemporaryPopup("Something went wrong", 5000);
        });

      }

      else {
        console.log("No score saved, try getting the score first.");
      }
    });
    document.getElementById("sendScore").style.display = 'none';
    document.getElementById("scoreBox").textContent = '';
    document.getElementById("relScoreBox").textContent = '';
    document.getElementById("gameNameBox").textContent = '';
  });

  getScoreButton.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage({tabId: tabs[0].id, action: "getScore"});
    });
  
    let listener = function(request, sender, sendResponse) {
      if (request.score) {
        request.relScore = parseFloat(request.relScore).toFixed(1); // round relScore to 1 decimal place
        console.log('received score, relscore: ' + request.score + ', ' + request.relScore);
  
        // Update the content of the boxes with the received score, relative score, and game ID
        document.getElementById("scoreBox").textContent = 'Score: ' + request.score;
        document.getElementById("relScoreBox").textContent = 'Relative Score: ' + request.relScore;
        document.getElementById("gameNameBox").textContent = 'Game ID: ' + request.gameID;
  
        chrome.storage.local.set({ "savedScore": request.score, "savedRelScore": request.relScore, "savedGameID": request.gameID }, function() {
          console.log("Score saved temporarily.");
        });
        
        document.getElementById("sendScore").style.display = 'block'; // Assuming the button is hidden by default

        chrome.runtime.onMessage.removeListener(listener);
      }
      else if (request.invalid) {
        console.log('invalid score');
        document.getElementById("scoreBox").textContent = 'Couldn\'t get score';
        document.getElementById("relScoreBox").textContent = '';
        document.getElementById("gameNameBox").textContent = 'Make sure you are on the correct page.';
        chrome.runtime.onMessage.removeListener(listener);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
  });
});

