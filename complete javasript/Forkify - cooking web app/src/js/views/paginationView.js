import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parrentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parrentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const { _data: data } = this;
    const countOfResults = data.results.length;
    const resultPerPage = data.resultPerPage;
    const countOfPages = Math.ceil(countOfResults / resultPerPage);
    const page = data.page;
    let markup = '';

    if (page !== 1) markup += this.#generateMarkupPaginationPrevious(page);
    if (page < countOfPages) markup += this.#generateMarkupPaginationNext(page);

    return markup;
  }

  #generateMarkupPaginationPrevious(page) {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${page - 1}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${page - 1}</span>
      </button>
    `;
  }

  #generateMarkupPaginationNext(page) {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${page + 1}">
      <span>${page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> 
    `;
  }
}

export default new PaginationView();
