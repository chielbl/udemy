'use strict';

import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// FIX Polyfilling
// ALL
import 'core-js/stable';
// async functions
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { TIMEOUT_MODAL_SUCCED } from './config';

// PARCEL CODE: Blocked the reload! It's usefull the refresh only the data
if (module.hot) {
  module.hot.accept();
}

/*
  (T) CONTROLLING THE RECIPE
*/
const controlRecipe = async function () {
  try {
    // 1) Get recipeId
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;

    // 2) Update the markup instead of re-rendering
    const { bookmarks } = modal.state;
    resultView.update(modal.getSearchResultsPage());

    bookmarksView.update(bookmarks);

    // 3) Loading the recipe (from the modal)  (i) async function, return promise => AWAIT
    recipeView.renderSpinner();
    await modal.loadRecipe(recipeId);

    // 4) Rendering of the recipe (from the viewer)
    const { recipe } = modal.state;
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
};

/*
  (T) CONTROLLING THE SEARCH
*/
const controlSearchResult = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    resultView.renderSpinner();
    await modal.loadSearchResults(query);

    // 3) Render preview, based on max results on page
    resultView.render(modal.getSearchResultsPage());

    // 4) Render the pagination
    paginationView.render(modal.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

/*
  (T) CONTROLLING THE PAGINATION
*/
const controlPagination = function (goToPage) {
  // 1) Render NEW preview
  resultView.render(modal.getSearchResultsPage(goToPage));

  // 2) Render the NEW pagination
  paginationView.render(modal.state.search);
};

/*
  (T) CONTROLLING THE SERVINGS
*/
const controlServings = function (newServings) {
  modal.updateServings(newServings);

  const { recipe } = modal.state;
  // recipeView.render(recipe);
  recipeView.update(recipe);
};

/*
  (T) CONTROLLING THE BOOKMARK
*/
const controlBookmark = function () {
  bookmarksView.render(modal.state.bookmarks);
};

/*
  (ST) ADD & REMOVE THE BOOKMARK
*/
const controlUpdateBookmark = function () {
  const { recipe, bookmarks } = modal.state;

  // 1) Add or Remove bookmark
  !recipe.bookmarked ? modal.addBookmark(recipe) : modal.removeBookmark(recipe);

  // 2) Update recipe view
  recipeView.update(recipe);

  // 3) Render bookmarks
  bookmarksView.render(bookmarks);
};

/*
  (T) CONTROLLING THE ADD RECIPE
*/
// IMPORT keep in mind a promosis need and AWAIT and ASYNC!
const controlAddRecipe = async function (newRecipe) {
  try {
    // 1) Render loading spinner
    addRecipeView.renderSpinner();

    // 2) Uploading the new recipe
    await modal.uplaodRecipe(newRecipe);

    // 3) Render recipe
    recipeView.render(modal.state.recipe);

    // 4) Succed message
    addRecipeView.renderMessage();

    // 5) Render bookmark view
    bookmarksView.render(modal.state.bookmarks);

    // 6) Change ID in the URL (It allow us to change the URL without reloading the page)
    window.history.pushState(null, '', `${modal.state.recipe.id}`);

    // 7) close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, TIMEOUT_MODAL_SUCCED * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

/*
  (T) INIT
*/
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServingsClick(controlServings);
  recipeView.addHandlerAddBookmark(controlUpdateBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};

init();
