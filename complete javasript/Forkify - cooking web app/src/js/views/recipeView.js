/*
  (T) VIEW
  (i) The goal of "view" is what we are showing / rendering to the user (front) / DOM manipulation
*/

// Parcel runs the files from the dist map so, he can't find the icons from our local source map.
// We need to import them and use them on every place where we using the SVG icons(!)
// import icons from '../img/icons.svg'; //parcel 1
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import View from './view';

class RecipeView extends View {
  _parrentElement = document.querySelector('.recipe');
  _errorMessage = "We couldn't find the recipe, please try again!";
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerServingsClick(handler) {
    this._parrentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--tiny');
      if (!btn) return;

      const { newServings } = btn.dataset;
      if (+newServings) handler(+newServings);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parrentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    const isBookmarked = this._data.bookmarked ? '-fill' : '';
    const isUser = this._data.key ? '' : 'hidden';

    return `
      <figure class="recipe__fig">
        <img src="${this._data.imgUrl}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings" data-new-servings="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-new-servings="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${isUser}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${isBookmarked}" ></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this.#generateMarkupIngredient).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.srcUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  #generateMarkupIngredient(ingredient) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">
        ${ingredient.quantity ? fracty(ingredient.quantity).toString() : ''}
        </div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unite}</span>
          ${ingredient.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeView();
