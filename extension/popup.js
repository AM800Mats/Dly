document.addEventListener('DOMContentLoaded', (event) => {
  let userIdInputSection = document.getElementById('userIdInputSection');
  let userIdInput = document.getElementById('userIdInput');
  let saveUserIdButton = document.getElementById('saveUserId');
  let changeUserIdButton = document.getElementById('changeUserId');
  let sendScoreButton = document.getElementById('sendScore');
  let getScoreButton = document.getElementById('getScore');
  let gameInfoDisplay = document.getElementById('gameInfoDisplay');

  // Load and display the current user_id if it exists
  chrome.storage.local.get(["userId"], function(result) {
    if (result.userId) {
      userIdInputSection.style.display = 'none';
      changeUserIdButton.style.display = 'block';
      userIdInput.value = result.userId;
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

  function showTemporaryPopup(message, duration, color) {
    let popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.top = "35%";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.backgroundColor = color || "rgba(76, 175, 80, 0.9)";
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
    const packageWrapper = document.getElementById('packageWrapper');
    const package = document.getElementById('package');

    // Hide the game info display
    gameInfoDisplay.style.opacity = '0';
    
    // Show the package wrapper
    packageWrapper.classList.add('visible');

    // Start the packaging animation
    package.classList.add('packaging');

    // After packaging, start the sending animation
    setTimeout(() => {
      package.classList.remove('packaging');
      package.classList.add('sending');
    }, 500);

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
        .then(response => {
          if (response.status === 409){
            setTimeout(() => {
              console.log('Score already submitted today');
              packageWrapper.classList.remove('visible');
              showTemporaryPopup("You have already submitted a score today!", 2000, "rgba(244, 67, 54, 0.9");
            }, 1500);
          }
          else {
            setTimeout(() => {
              console.log('Score submitted successfully');
              packageWrapper.classList.remove('visible');
              showTemporaryPopup("Score submitted successfully!", 2000);
            }, 1500);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          showTemporaryPopup("Something went wrong", 5000);
        })
        .finally(() => {
          // Reset the display after animations
          setTimeout(() => {
            gameInfoDisplay.style.opacity = '1';
            package.classList.remove('sending');
            sendScoreButton.style.display = 'none';
            gameInfoDisplay.style.display = 'none';
          }, 2000);
        });
      } else {
        console.log("No score saved, try getting the score first.");
        showTemporaryPopup("No score to send. Try getting the score first.", 3000);
      }
    });
  });

  getScoreButton.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage({tabId: tabs[0].id, action: "getScore"});
    });
  
    let listener = function(request, sender, sendResponse) {
      if (request.score) {
        request.relScore = parseFloat(request.relScore).toFixed(1);
        console.log('received score, relscore: ' + request.score + ', ' + request.relScore);
  
        // Update the game info display
        document.getElementById("gameName").textContent = request.gameID;
        document.getElementById("scoreInfo").textContent = `Score: ${request.score} (${request.relScore}%)`;
        gameInfoDisplay.style.display = 'block';
  
        chrome.storage.local.set({ "savedScore": request.score, "savedRelScore": request.relScore, "savedGameID": request.gameID }, function() {
          console.log("Score saved temporarily.");
        });
        
        sendScoreButton.style.display = 'block';

        chrome.runtime.onMessage.removeListener(listener);
      }
      else if (request.invalid) {
        console.log('invalid score');
        showTemporaryPopup("Couldn't get score. Make sure you are on the correct page.", 3000, "rgba(244, 67, 54, 0.9)");
        chrome.runtime.onMessage.removeListener(listener);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
  });
});