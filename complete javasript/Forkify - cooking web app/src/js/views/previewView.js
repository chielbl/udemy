import View from './view';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parrentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    const isActive = id === this._data.id ? 'preview__link--active' : '';
    const isUser = this._data.key ? '' : 'hidden';

    return `
      <li class="preview">
        <a class="preview__link ${isActive}" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.imgUrl}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="preview__user-generated ${isUser}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
