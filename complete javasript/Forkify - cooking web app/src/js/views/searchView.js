class SearchView {
  #parrentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#parrentElement.querySelector('.search__field').value;
    this.#clearInput();

    return query;
  }

  addHandlerSearch(handler) {
    this.#parrentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this.#parrentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
