import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // (T) HOW TO DOCUMENT (!)
  // jsdoc.app
  /**
   * Render the received object to the DOM
   * @param {Object \ Object[]} data The data to be rendered (recipe)
   * @param {boolean} [render=true] [If false, create markup string instead of rendering to the dom]
   * @returns
   * @This {Object} View instance
   * @author Chiel Bleyenbergh
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._insertMarkup('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parrentElement.querySelectorAll('*')
    );

    // MAYBE not best way for algoritme to overwrite or update the data
    newElements.forEach((newElement, i) => {
      const currentElement = currentElements[i];
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement.textContent = newElement.textContent;
      }
      // Updating attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute => {
          currentElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._clear();
    this._insertMarkup('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${this._message}</p>
      </div>
    `;

    this._clear();
    this._insertMarkup('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._insertMarkup('afterbegin', markup);
  }

  _clear() {
    this._parrentElement.innerHTML = '';
  }

  _insertMarkup(option, markup) {
    this._parrentElement.insertAdjacentHTML(`${option}`, markup);
  }
}
