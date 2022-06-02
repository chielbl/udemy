'use strict';
// /*
//   (T) VARIABLES
// */
// // GENERAL
// const arrTxtScores = document.querySelectorAll('.score');
// const arrTxtCurrentScores = document.querySelectorAll('.current-score');
// const elBtnNewGame = document.querySelector('.btn--new');
// const elBtnRoleDice = document.querySelector('.btn--roll');
// const elBtnHoldScore = document.querySelector('.btn--hold');
// const elImgDice = document.querySelector('.dice');
// let activePlayer;

// // PLAYER 1
// const elPlayer1 = document.querySelector('.player--0');
// const elTxtCurrentScore1 = document.querySelector('#current--0');
// const elTxtScore1 = document.querySelector('#score--0');

// // PLAYER 1
// const elPlayer2 = document.querySelector('.player--1');
// const elTxtCurrentScore2 = document.querySelector('#current--1');
// const elTxtScore2 = document.querySelector('#score--1');

// /*
//   (T) INTERACTION
//   (ST) NEW GAME
// */
// elBtnNewGame.addEventListener('click', function () {
//   elImgDice.style.display = 'none';
//   newGame(arrTxtScores);
//   newGame(arrTxtCurrentScores);
//   makeActive(elPlayer1, elPlayer2);
// });

// /*
//   (ST) ROLL DICE
// */
// elBtnRoleDice.addEventListener('click', function () {
//   const rdmDice = rollDice();
//   elImgDice.style.display = 'block';
//   elImgDice.src = `dice-${rdmDice}.png`;

//   if (rdmDice === 1) {
//     if (isActive(elPlayer1)) {
//       makeActive(elPlayer2, elPlayer1);
//       countingUp(elTxtCurrentScore1, 0);
//     } else {
//       makeActive(elPlayer1, elPlayer2);
//       countingUp(elTxtCurrentScore2, 0);
//     }
//   } else {
//     if (isActive(elPlayer1)) {
//       countingUp(elTxtCurrentScore1, rdmDice);
//     } else {
//       countingUp(elTxtCurrentScore2, rdmDice);
//     }
//   }
// });

// /*
//   (ST) HOLD SCORE
// */
// elBtnHoldScore.addEventListener('click', function () {
//   const currentScore = isActive(elPlayer1)
//     ? Number(elTxtCurrentScore1.textContent)
//     : Number(elTxtCurrentScore2.textContent);
//   const score = isActive(elPlayer1)
//     ? Number(elTxtScore1.textContent)
//     : Number(elTxtScore2.textContent);
//   const newScore = currentScore + score;

//   if (isActive(elPlayer1)) {
//     elTxtScore1.textContent = newScore;

//     countingUp(elTxtCurrentScore1, 0);
//     makeActive(elPlayer2, elPlayer1);

//     if (newScore >= 100) {
//       alert('Player 1 wins the game!');
//     }
//   } else {
//     elTxtScore2.textContent = newScore;

//     countingUp(elTxtCurrentScore2, 0);
//     makeActive(elPlayer1, elPlayer2);

//     if (newScore >= 100) {
//       alert('Player 2 wins the game!');
//     }
//   }
// });

// /*
//   (T) FUNCTIONS
// */
// // RESET
// function newGame(arr) {
//   for (let i = 0; i < arr.length; i++) {
//     const el = arr[i];
//     el.textContent = '0';
//   }
// }

// // IS ACTIVE PLAYER ?
// function isActive(player) {
//   const isActive = player.classList.contains('player--active') ? true : false;
//   return isActive;
// }

// // MAKE A PLAYER ACTIVE
// // (i) aPlayer = active player
// // (i) inPlayer = inactive player
// function makeActive(aPlayer, inPlayer) {
//   aPlayer.classList.add('player--active');
//   inPlayer.classList.remove('player--active');
// }

// // ROLL DICE
// function rollDice() {
//   return Math.trunc(Math.random() * 6) + 1;
// }

// // COUNTING CURRENT SCORE UP / RESET
// function countingUp(elCurrentScore, score) {
//   let currentScore = 0;

//   if (score) {
//     currentScore = Number(elCurrentScore.textContent);
//     elCurrentScore.textContent = currentScore + score;
//   } else {
//     elCurrentScore.textContent = currentScore;
//   }
// }

/*
  (T) VARIABLES
*/
// GENERAL
const elBtnNewGame = document.querySelector('.btn--new');
const elBtnRoleDice = document.querySelector('.btn--roll');
const elBtnHoldScore = document.querySelector('.btn--hold');
const elImgDice = document.querySelector('.dice');
// const players = [0, 1, 2];
const players = [0, 1];
let newPlayerActive;

/*
  (T) INTERACTION
  (ST) NEW GAME
*/
elBtnNewGame.addEventListener('click', function () {
  elImgDice.classList.add('hidden');
  newGame();
});

/*
  (ST) ROLL DICE
*/
elBtnRoleDice.addEventListener('click', function () {
  const rdmDice = rollDice();
  elImgDice.classList.remove('hidden');
  elImgDice.src = `dice-${rdmDice}.png`;

  for (let i = 0; i < players.length; i++) {
    const playerId = players[i];
    const elPlayer = document.querySelector(`.player--${playerId}`);
    const elCurrentScore = document.getElementById(`current--${playerId}`);

    if (rdmDice === 1) {
      elCurrentScore.textContent = 0;

      switchPlayer(elPlayer, playerId);
    } else if (isActive(elPlayer)) {
      const currentScore = Number(elCurrentScore.textContent);
      const totalCurrentScore = currentScore + rdmDice;
      elCurrentScore.textContent = totalCurrentScore;
    }
  }
});

/*
  (ST) HOLD SCORE
*/
elBtnHoldScore.addEventListener('click', function () {
  elImgDice.classList.add('hidden');

  for (let i = 0; i < players.length; i++) {
    const playerId = players[i];
    const elPlayer = document.querySelector(`.player--${playerId}`);
    const elCurrentScore = document.getElementById(`current--${playerId}`);
    const elScore = document.getElementById(`score--${playerId}`);
    let newScore = 0;

    if (isActive(elPlayer)) {
      const currentScore = Number(elCurrentScore.textContent);
      const score = Number(elScore.textContent);
      newScore = currentScore + score;
      elScore.textContent = newScore;
      elCurrentScore.textContent = 0;
    }

    if (newScore >= 100) {
      elPlayer.classList.add('player--winner');
    } else {
      switchPlayer(elPlayer, playerId);
    }
  }
});

/*
  (T) FUNCTIONS
*/
// NEW GAME
function newGame() {
  for (let i = 0; i < players.length; i++) {
    const playerId = players[i];
    let elPlayer = document.querySelector(`.player--${playerId}`);
    let elCurrentScore = document.getElementById(`current--${playerId}`);
    let elScore = document.getElementById(`score--${playerId}`);

    elCurrentScore.textContent = 0;
    elScore.textContent = 0;
    elPlayer.classList.remove('player--winner');

    if (!playerId) {
      makeActive(elPlayer);
    } else {
      makeInActive(elPlayer);
    }
  }
}

// ROLL DICE
function rollDice() {
  return Math.trunc(Math.random() * 6) + 1;
}

// IS ACTIVE PLAYER ?
function isActive(player) {
  const isActive = player.classList.contains('player--active') ? true : false;
  return isActive;
}

// MAKE A PLAYER ACTIVE
function makeActive(player) {
  player.classList.add('player--active');
}

// MAKE A PLAYER INACTIVE
function makeInActive(player) {
  player.classList.remove('player--active');
}

// SWITCH TO OTHER PLAYER
function switchPlayer(player, playerId) {
  // (i) When a player is "active" make it "inactive"
  if (isActive(player)) {
    // (i) When a player go inactive we make a variable that says there is no "new player active" anymore
    newPlayerActive = false;
    makeInActive(player);

    // (i) When we on the latest player we go back to the first player
    if (players.indexOf(playerId) === players.length - 1) {
      const player = document.querySelector('.player--0');
      newPlayerActive = true;
      makeActive(player);
    }
    // (i) When there is no "new player active" take the next player to make it active
  } else if (!newPlayerActive) {
    newPlayerActive = true;
    makeActive(player);
  }
}
