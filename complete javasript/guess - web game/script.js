'use strict';
// (T) how do we get selector from the HTML page
/*
  (i) Using "." is for "classes"
  (i) Using "#" is for an "id"
*/
// const selectMsg = document.querySelector('.message');
// console.log(selectMsg); // Check the console log for more properties

// (T) DOM (DOCUMENT OBJECT MODEL)
/*
  (i) Allows js to acces html ellements and styles to manipulate them.
  (i) DOM is autoamticly created by the browser as soon the HTML page loads.
*/

// const textContent = selectMsg.textContent;
// console.log(textContent); // Check the console log for more properties

// selectMsg.textContent = 'DOM manipulation';
// console.log(selectMsg.textContent);

// const selectScore = document.querySelector('.score');
// const selectHighscore = document.querySelector('.highscore');

// console.log(selectScore);
// console.log(selectHighscore);

// selectScore.textContent = 13;
// selectHighscore.textContent = 17;

// const selectGuess = document.querySelector('.guess');
// selectGuess.value = 22;

// console.log(selectGuess.value);

// (T) EVENT LISTENER
/*
  (i) This will be use for interaction on buttons for example 
*/

// (ST) GENERAL VARIABLE
// (i) Math.trunc use the decimal number
// (i) * 20 it's the maximum range

let rdmNumber = Math.trunc(Math.random() * 20) + 1; //default betwoon 0 and 1
console.log(rdmNumber);
let scoreValue = 20;
let highScoreValue = 0;
const elBody = document.querySelector('body');
const elBtnAgain = document.querySelector('.again');
const elBtnCheck = document.querySelector('.check');
const elInGuess = document.querySelector('.guess');
const elTxtScore = document.querySelector('.score');
const elTxtHighScore = document.querySelector('.highscore');
const elTxtNumber = document.querySelector('.number');
const elTxtMsg = document.querySelector('.message');
// console.log(elBtnCheck);

// (ST) CHECK BUTTON
elBtnCheck.addEventListener('click', function () {
  const guessValue = Number(elInGuess.value);
  let msg = '';

  if (!guessValue) {
    msg = 'No number...';
  } else if (guessValue === rdmNumber) {
    msg = 'Correct number!';
    elTxtNumber.textContent = rdmNumber;
    elBody.style.backgroundColor = '#60b347';
    elTxtNumber.style.width = '30rem';

    if (scoreValue > highScoreValue) {
      highScoreValue = scoreValue;
      elTxtHighScore.textContent = highScoreValue;
    }
  } else if (guessValue !== rdmNumber) {
    scoreValue--;
    msg = guessValue > rdmNumber ? 'To high!' : 'To low!';

    if (!scoreValue) {
      msg = 'Lost the game!';
    }
  }
  console.log(scoreValue);
  elTxtScore.textContent = scoreValue;
  elTxtMsg.textContent = msg;
});

// (ST) PLAY AGAIN

elBtnAgain.addEventListener('click', function () {
  rdmNumber = Math.trunc(Math.random() * 20) + 1;
  console.log(rdmNumber);
  scoreValue = 20;
  elTxtScore.textContent = scoreValue;
  elTxtNumber.textContent = '?';
  elTxtNumber.style.width = '15rem';
  elInGuess.value = '';
  elBody.style.backgroundColor = '#222';
  elTxtMsg.textContent = 'Start guessing...';
});
