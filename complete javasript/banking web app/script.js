'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-01-06T17:01:17.194Z',
    '2022-01-08T18:49:59.371Z',
    '2022-01-09T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-01-06T17:01:17.194Z',
    '2022-01-08T18:49:59.371Z',
    '2022-01-09T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/*
  (T) ELEMENT VARIABLES
*/
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*
  (T) EXTRA VARIABLES
*/
// Format date for correct countries
const optionsDate = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'long',
};
const optionsNumber = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};
const local = navigator.language; // 'nl-NL'
let today;
let currentAccount;
let timer;
let sort = false;

// const year = today.getFullYear();
// const month = `${today.getMonth() + 1}`.padStart(2, 0);
// const day = `${today.getDate()}`.padStart(2, 0);
// const hours = `${today.getHours()}`.padStart(2, 0);
// const minutes = `${today.getMinutes()}`.padStart(2, 0);
// const date = `${day}/${month}/${year}`;
// const time = `${hours}:${minutes}`;

/*
  (T) FUNCTIONALITY
*/
// (ST) Creating a new username in each account
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const startLogOutTimer = function () {
  // Set time to 5min
  let time = 12;
  const tick = function () {
    // in each call print the remaining time to UI
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = min + ':' + sec;

    // When 0 sec => stop time logout user
    if (time === 0) {
      clearInterval(timer);
      // Display UI
      containerApp.style.opacity = 0;
      // Display welcome message
      labelWelcome.textContent = `Log in to get started`;
    }

    time--;
  };

  tick();
  // call the time every second
  return setInterval(tick, 1000);
};

// (ST) Login
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();

  const username = inputLoginUsername.value;
  // const pin = Number(inputLoginPin.value);
  const pin = +inputLoginPin.value;

  currentAccount = accounts.find(acc => acc.username === username);
  today = new Date();
  const localDate = genLocalDate(currentAccount, optionsDate, today);

  if (currentAccount?.pin === pin) {
    // Display UI
    containerApp.style.opacity = 1;
    // Display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // Display date + time
    labelDate.textContent = localDate;
    // Updating UI
    updateUI(currentAccount);
  } else {
    alert(`Log in incorrect!`);
  }

  // Clear input fields
  resetField(inputLoginUsername);
  resetField(inputLoginPin);

  // const movementsUI = Array.from(
  //   document.querySelectorAll('.movements__value'),
  //   el => Number(el.textContent.replace('€', ''))
  // );
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  // console.log(movementsUI);
});

const updateUI = function (acc) {
  // Calculate + displaying balance
  calcDisplayBalance(acc);
  // Displaying movements
  displayMovements(acc);
  // Calculate + displaying summary
  calcDisplaySummary(acc);
};

// (ST) Creating rows in the HTML page
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  optionsNumber.currency = acc.currency;

  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  moves.forEach(function (move, idx) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[idx]);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // let moveDate = `${day}/${month}/${year}`;
    const localDate = genLocalDate(acc, undefined, date);
    let moveDate = localDate;

    const calcPassedDays = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (60 * 60 * 24 * 1000));

    const passedDays = calcPassedDays(date, today);

    if (passedDays === 0) {
      moveDate = 'Today';
    } else if (passedDays === 1) {
      moveDate = 'yesterday';
    } else if (passedDays <= 7) {
      moveDate = passedDays + 'Days ago';
    }

    /*
      TEMPLATE LITERAL `TEMP`
        (i) is very useful for html!
    */
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${idx + 1} ${type}
        </div>
        <div class="movements__date">
          ${moveDate}
        </div>
        <div class="movements__value">
          ${genLocalBalance(acc, optionsNumber, move.toFixed(2))}
        </div>
      </div>
    `;
    // console.log(html);

    /*
      (i) It will insert or create the temp html into the DOM
        'beforebegin': Before the element itself.
        'afterbegin': Just inside the element, before its first child.
        'beforeend': Just inside the element, after its last child.
        'afterend': After the element itself.
    */
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  // console.log(containerMovements.innerHTML);
  // console.log(containerMovements.textContent);
};

// (ST) Calculate / Display balance
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((pVal, cVal) => pVal + cVal, 0);
  acc.balance = balance;
  // labelBalance.textContent = `${balance.toFixed(2)} €`;
  optionsNumber.currency = acc.currency;
  labelBalance.textContent = genLocalBalance(acc, optionsNumber, balance);
};

// (ST) Calculate / Display in, out & interest summary
const calcDisplaySummary = function (acc) {
  // CALCULTATIONS
  const inSumVal = acc.movements
    .filter(move => move > 0)
    .reduce((pVal, cVal) => pVal + cVal, 0);

  const outSumVal = acc.movements
    .filter(move => move < 0)
    .reduce((pVal, cVal) => pVal + cVal, 0);

  const intSumVal = acc.movements
    .filter(move => move > 0)
    .map(move => (move * acc.interestRate) / 100)
    .filter((int, idx, arr) => {
      //Only interest calculation when the price is >= €1
      // console.log(arr);
      return int >= 1;
    })
    .reduce((pVal, cVal) => pVal + cVal, 0);

  // DISPLAYING
  // labelSumIn.textContent = `${inSumVal.toFixed(2)} €`;
  // labelSumOut.textContent = `${Math.abs(outSumVal).toFixed(2)} €`;
  // labelSumInterest.textContent = `${intSumVal.toFixed(2)} €`;

  optionsNumber.currency = acc.currency;
  labelSumIn.textContent = genLocalBalance(
    acc,
    optionsNumber,
    inSumVal.toFixed(2)
  );
  labelSumOut.textContent = genLocalBalance(
    acc,
    optionsNumber,
    outSumVal.toFixed(2)
  );
  labelSumInterest.textContent = genLocalBalance(
    acc,
    optionsNumber,
    intSumVal.toFixed(2)
  );
};

// (ST) Generate local date
const genLocalDate = function (acc, opt, date) {
  const intlDate = opt
    ? new Intl.DateTimeFormat(acc.locale, opt).format(date)
    : new Intl.DateTimeFormat(acc.locale).format(date);

  return intlDate;
};

// (ST) Generate local balance
const genLocalBalance = function (acc, opt, price) {
  const intlBalance = opt
    ? new Intl.NumberFormat(acc.locale, opt).format(price)
    : new Intl.NumberFormat(acc.locale).format(price);

  return intlBalance;
};

// (ST) Sorting
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  sort = !sort; // Take the oposite of the boolean status
  displayMovements(currentAccount, sort);
});

// (ST) Transfer
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  // const amount = Number(inputTransferAmount.value);
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // receiverAccount?.movements.push(amount); // Push only when there is an account

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount?.balance >= amount &&
    currentAccount?.username !== receiverAccount?.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(today.toISOString());

    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(today.toISOString());

    updateUI(currentAccount);
  }

  resetField(inputTransferTo);
  resetField(inputTransferAmount);
});

// (ST) loan (lening)
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const isLoan = currentAccount.movements.some(move => move >= amount * 0.1);

  if (amount > 0 && isLoan) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(today.toISOString());
    updateUI(currentAccount);
    console.log(currentAccount);
  }

  resetField(inputLoanAmount);
});

// (ST) Close account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const closerUsername = inputCloseUsername.value;
  // const closePin = Number(inputClosePin.value);
  const closePin = +inputClosePin.value;

  if (
    currentAccount?.username === closerUsername &&
    currentAccount?.pin === closePin
  ) {
    const idx = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(idx);
    accounts.splice(idx, 1); // Remove the alement on value idx and max 1 el
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

  resetField(inputCloseUsername);
  resetField(inputClosePin);
});

// (ST) RESET / CLEAR FIELD
const resetField = el => {
  el.value = el.textContent = '';
  el.blur(); //Blur() is opposite of focus
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
 (T) Converting and Checking NUMBERS
*/
/*
// (ST) Convert string to number
// Option1
const number1 = Number('23');
// Option2
const number = +'23';

// Parsing
// (i) Number + text
// (!) It need to start first with a number otherwise you receive NaN (Not a Number)
console.log(Number.parseInt('30px'));
console.log(Number.parseFloat('3.5rem'));

// (i) It checked of the value is a number!
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
// OR
// (!) It breaks when it's decimal digit so isFinite is better to use
console.log(Number.isInteger(20));
console.log(Number.isInteger('20'));
*/

/*
  (T) Math and Rounding
*/
/*
// (ST) Math
console.log(Math.sqrt(25)); // De wortel van 25 = 5
console.log(5 ** 2); // 5 tot de 2de macht = 25
console.log(Math.max(5, 10, 12, 21, 16)); // 21
console.log(Math.min(5, 10, 12, 21, 16)); // 5
console.log(Math.PI); // PI = 3.141592653589793
// Random dicamal number
console.log(Math.trunc(Math.random() * 6) + 1); // Default is het 0-5 but +1 make the range to 1-6
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

// Rounding intigers
// (i) Take the value at the front of the comma
console.log(Math.trunc(23.3)); // = 23
// (i) round up or down
console.log(Math.round(23.3)); // = 23
console.log(Math.round(23.9)); // = 24
// (i) Alway rounding up
console.log(Math.ceil(23.3)); // = 24
console.log(Math.ceil(23.9)); // = 24
// (i) Alway rounding down
console.log(Math.floor(23.3)); // = 23
console.log(Math.floor(23.9)); // = 23

// Rounding decimals
// (i) Default convert to a string
console.log((2.7).toFixed(0)); // = '3'
console.log((2.7).toFixed(3)); // = '2.700'
console.log((2.345).toFixed(2)); // = '2.35'
console.log(+(2.345).toFixed(2)); // = 2.35
*/

/*
  (T) Remender operator
*/
/*
const isEven = n => n % 2 === 0;
const isOdd = n => n % 2 === 1;

console.log(isEven(8), isOdd(5));
*/

/*
  (T) Numeric seperator
*/
/*
// 287.460.00.00
const diameter = 287_460_000_000;
console.log(diameter); // 2874600000
*/

/*
  (T) Working with BigInt
*/
/*
console.log(Number.MAX_SAFE_INTEGER);
console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));
*/

/*
  (T) Creating dates
*/
/*
const now = new Date();

console.log(now);
console.log(new Date('December 24, 2016'));
console.log(new Date(account1.movementsDates[0]));

// Y + M + D + H + M + S
console.log(new Date(2021, 0, 15, 22, 5, 0)); // Fri Jan 15 2021 22:05:00 GMT+0100 (Midden-Europese standaardtijd)

const future = new Date(2021, 0, 15, 22, 5);
// GET
console.log(future.getFullYear()); // 2021
console.log(future.getMonth()); // 0
console.log(future.getDate()); // 15
console.log(future.getDay()); // 5
console.log(future.getHours()); // 22
console.log(future.getMinutes()); // 5
console.log(future.toISOString()); // 2021-01-15T21:05:00.000Z
console.log(future.getTime()); // 1610744700000 = timestamp
console.log(new Date(1610744700000));
// SET
future.setFullYear(2040);
// ...
console.log(future); // Sun Jan 15 2040 22:05:00 GMT+0100 (Midden-Europese standaardtijd)
*/

/*
  (T) Operations with dates
*/
/*
const future = new Date(2021, 0, 15, 22, 5);

// Convert date to timestamp in miliseconds
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (60 * 60 * 24 * 1000);

const days1 = calcDaysPassed(new Date(2021, 0, 15), new Date(2021, 0, 20));
console.log(days1);
*/

/*
  (T) Timers: setTimeout and setInterval
*/
/*
// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000, // miliseconds => 3sec.
  ...ingredients
);

console.log('Waiting...');

if (ingredients.includes('spinach')) {
  clearTimeout(pizzaTimer); // Cancel the time out!
}

// setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
*/
