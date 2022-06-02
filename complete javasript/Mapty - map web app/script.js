'use strict';

// prettier-ignore
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/* 
  (T) CLASSES
*/
class Workout {
  date = new Date();
  _id = Date.now() + '';

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `
    ${this._type[0].toUpperCase()}${this._type.slice(1)} on 
    ${months[this.date.getMonth()]} ${this.date.getDay()}
    `;
  }
}

/* 
  (ST) RUNNING
*/
class Running extends Workout {
  _type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //  min/km
    this.pace = this.duration / this.distance;
  }
}

/* 
  (ST) CYCLING
*/
class Cycling extends Workout {
  _type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / this.duration;
  }
}

/* 
  (ST) APP ARCHITECTURE
*/
class App {
  #map;
  #mapEvent;
  #mapZoom = 13;
  workouts = [];

  constructor() {
    // Can also be used by excution of methods
    this._getPosition();
    // Get local storage
    this._getLocalStorage();
    // This key word is linked with the form and not on the class
    // To use bind it will fix that
    form.addEventListener('submit', this._newWorkout.bind(this));
    // This case we don't need to bind it not object related property in this method "_toggleElevationField"
    inputType.addEventListener('change', this._toggleElevationField);

    // containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    containerWorkouts.addEventListener(
      'click',
      function (event) {
        if (event.target.closest('.workout__edite')) {
          alert('EDITE');
          return;
        }

        if (event.target.closest('.workout__delete')) {
          L.marker(this.workouts[0].coords).removeFrom(this.#map);
          // this._deleteWorkout(event);
          return;
        }

        console.log(this);
        this._moveToPopup(event);
      }.bind(this)
    );
  }

  _getPosition() {
    // GEOLOCATION
    // It will ask for your promosion to share you location
    // function1 = ALLOW
    // function1 = BLOCKED
    if (navigator.geolocation) {
      // First function is SUCCES
      // Second function ERROR
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("ERROR: Couldn't get your position");
        }
      );
    }
  }

  _loadMap(geoLoc) {
    // const lat = geoLoc.coords.latitude;
    const { latitude } = geoLoc.coords;
    // const long = geoLoc.coords.longitude;
    const { longitude } = geoLoc.coords;

    // console.log(geoLoc); // GeolocationPosition {coords: GeolocationCoordinates, timestamp: 1642439173072}
    // console.log(latitude, longitude);
    // console.log(`https://www.google.be/maps/@${latitude},${longitude}`);

    // LEAFLET LIBARY
    this.#map = L.map('map').setView([latitude, longitude], this.#mapZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // on = addEventListener but from the Leaflet libary
    this.#map.on('click', this._showForm.bind(this));

    // This need to be here and not in the getLocalStorage
    // We need to be sure the map is rended before adding the markers
    this.workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // Helper functions
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    const allPositives = (...inputs) => inputs.every(input => input > 0);

    // Submit relaod default the page
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    // console.log(lat, lng);
    // console.log(type, distance);

    // If workout running, create running obj
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // If the distance is not a number
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositives(distance, duration, cadence)
      ) {
        return alert('Inputs have to be positive numbers');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
      // console.log(workout);
    }

    // If workout cycling, create cycling obj
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositives(distance, duration)
      ) {
        return alert('Inputs have to be positive numbers');
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new obj to workout arr
    this.workouts.push(workout);
    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    // Render workout on list
    this._renderWorkout(workout);
    // Hide form + Clear input fields
    this._hideForm();
    // Set local storage
    this._setLocalStorage();
  }

  _deleteWorkout(event) {
    const elWorkout = event.target.closest('.workout');
    const id = elWorkout.dataset.id;

    this.workouts = this.workouts.filter(workout => workout._id !== id);
    elWorkout.remove();
    this._removeRenderWorkoutMarker();
    // Set local storage
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout._type}-popup`,
        })
      )
      .setPopupContent(
        `${workout._type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _moveToPopup(event) {
    const workoutEl = event.target.closest('.workout');
    // console.log(workoutEl);

    if (!workoutEl) return;

    const workout = this.workouts.find(
      workout => workout._id === workoutEl.dataset.id
    );
    // console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _renderWorkout(workout) {
    const title = workout._type[0].toUpperCase() + workout._type.slice(1);
    let html = `
    <li class="workout workout--${workout._type}" data-id="${workout._id}">
      <h2 class="workout__title">${workout.description}</h2>
      <button class="workout__btn workout__edite">
        <ion-icon name="create-outline" class="workout__btn__icon"></ion-icon>
      </button>
      <div class="workout__details">
        <span class="workout__icon">
        ${workout._type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
        </span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
  `;

    if (workout._type === 'running') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
      `;
    }

    if (workout._type === 'cycling') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
      `;
    }

    html += `
      <button class="workout__btn workout__delete">
        <ion-icon name="close-outline" class="workout__btn__icon"></ion-icon>
      </button>
    </li>`;
    form.insertAdjacentHTML('afterend', html);
  }

  _setLocalStorage() {
    // API
    localStorage.setItem('workouts', JSON.stringify(this.workouts)); // Convert to string
  }

  _getLocalStorage() {
    // Keep in mind after parsing it lose the prototype chain (!)
    // Inherentace is lost (!)
    const data = JSON.parse(localStorage.getItem('workouts'));
    // FIX
    // Looping over the parsed data and restore the object by creating an new object using the class (!)

    if (!data) return;

    this.workouts = data;

    this.workouts.forEach(workout => {
      this._renderWorkout(workout);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload(); // location is an object from the browser
  }
}

/* 
  (T) EXECUTION APP
*/
// By loading the pahe the object will created by the construcor.
const app = new App();
