
/* 1. Find the HTML elements */
const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");

const result = document.getElementById("result");
const playerChoiceDisplay = document.getElementById("player-choice");
const computerChoiceDisplay = document.getElementById("computer-choice");

const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");

const historyList = document.getElementById("history-list");
const resetButton = document.getElementById("reset-button");
const clearHistoryButton = document.getElementById("clear-history");

/* 2. Choose one key for all saved game data */
const STORAGE_KEY = "rpsGameStateV1";

/* 3. Create the starting game state */
function createNewGame() {
  return {
    playerScore: 0,
    computerScore: 0,
    playerChoice: "",
    computerChoice: "",
    result: "Choose a move to start!",
    history: []
  };
}

/* 4. Load saved data, or start a new game */
function loadGame() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData === null) {
    return createNewGame();
  }

  try {
    const gameData = JSON.parse(savedData);

    if (
      typeof gameData.playerScore !== "number" ||
      typeof gameData.computerScore !== "number" ||
      !Array.isArray(gameData.history)
    ) {
      return createNewGame();
    }

    return {
      ...createNewGame(),
      ...gameData
    };
  } catch (error) {
    return createNewGame();
  }
}

/* 5. Store the current game */
function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

/* 6. Keep the current game in one object */
let game = loadGame();

/* 7. Convert choices into readable labels */
function formatChoice(choice) {
  if (choice === "rock") {
    return "✊ Rock";
  } else if (choice === "paper") {
    return "✋ Paper";
  } else if (choice === "scissors") {
    return "✌️ Scissors";
  }

  return "❔ Waiting...";
}

/* 8. Display the match history */
function renderHistory() {
  historyList.replaceChildren();

  if (game.history.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Your rounds will appear here.";
    historyList.appendChild(emptyMessage);
    return;
  }

  game.history.forEach(function (round) {
    const historyItem = document.createElement("li");

    historyItem.textContent =
      "You: " + formatChoice(round.playerChoice) +
      " vs Computer: " + formatChoice(round.computerChoice) +
      " — " + round.result;

    historyItem.classList.add(round.result.toLowerCase());
    historyList.appendChild(historyItem);
  });
}

/* 9. Update everything visible on the page */
function renderGame() {
  playerScoreDisplay.textContent = game.playerScore;
  computerScoreDisplay.textContent = game.computerScore;

  playerChoiceDisplay.textContent = formatChoice(game.playerChoice);
  computerChoiceDisplay.textContent = formatChoice(game.computerChoice);

  result.textContent = game.result;

  renderHistory();
}

/* 10. Let the computer choose randomly */
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);

  return choices[randomIndex];
}

/* 11. Play one round */
function playGame(playerChoice) {
  const computerChoice = getComputerChoice();
  let roundResult;

  if (playerChoice === computerChoice) {
    roundResult = "Draw";
    game.result = "It's a draw!";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    roundResult = "Win";
    game.result = "You win this round! 🎉";
    game.playerScore++;
  } else {
    roundResult = "Loss";
    game.result = "Computer wins this round! 🤖";
    game.computerScore++;
  }

  game.playerChoice = playerChoice;
  game.computerChoice = computerChoice;

  game.history.unshift({
    playerChoice: playerChoice,
    computerChoice: computerChoice,
    result: roundResult
  });

  saveGame();
  renderGame();
}

/* 12. Connect the three choice buttons */
rockButton.addEventListener("click", function () {
  playGame("rock");
});

paperButton.addEventListener("click", function () {
  playGame("paper");
});

scissorsButton.addEventListener("click", function () {
  playGame("scissors");
});

/* 13. Reset the game and save the reset state */
resetButton.addEventListener("click", function () {
  game = createNewGame();

  saveGame();
  renderGame();
});

/* 14. Clear history but keep both scores */
clearHistoryButton.addEventListener("click", function () {
  game.history = [];

  saveGame();
  renderGame();
});

/* 15. Show the saved game when the page opens */
renderGame();