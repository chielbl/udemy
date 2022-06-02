/*
  (T) MODAL
  (i) The goal of "modal" is all about handling with the "data" for the "state"
*/

/*
  (ST) IMPORTS
*/
import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { KEY } from './config';
import { RES_PAGE } from './config';
import { RES_PER_PAGE } from './config';
import { AJAX } from './helper';

/*
  (ST) STATE
*/
export const state = {
  recipe: {},
  search: {
    page: RES_PAGE,
    resultPerPage: RES_PER_PAGE,
    query: '',
    results: [],
  },
  bookmarks: [],
};

/*
  (ST) LOCAL STORAGE
*/
const storingBookmarksLocal = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

/*
  (ST) LOAD RECIPE
*/
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookTime: recipe.cooking_time,
    imgUrl: recipe.image_url,
    srcUrl: recipe.source_url,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    // FETCHING RECIPE DATA
    const data = await AJAX(`${API_URL}/${recipeId}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
      state.recipe.bookmarked = true;
  } catch (error) {
    // So that we can use it in the controller
    throw error;
  }
};

/*
  (ST) SEARCH
*/
export const loadSearchResults = async function (query = 'pizza') {
  try {
    // FETCHING RECIPE DATA
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const { recipes } = data.data;

    state.search.query = query;
    state.search.page = RES_PAGE;
    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imgUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    // So that we can use it in the controller
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  const resultPerPage = state.search.resultPerPage;
  const min = (page - 1) * resultPerPage;
  const max = page * resultPerPage;
  state.search.page = page;

  return state.search.results.slice(min, max);
};

/*
  (ST) SERVINGS
*/
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

/*
  (ST) BOOKMARK
*/
export const addBookmark = function (recipe) {
  // Add the recipe to the bookmark
  state.bookmarks.push(recipe);

  // Mark the recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Storing local
  storingBookmarksLocal();
};

export const removeBookmark = function (recipe) {
  // REMOVE the recipe to the bookmark
  const index = state.bookmarks.findIndex(el => (el.id = recipe.id));
  state.bookmarks.splice(index, 1);

  // Mark the recipe as NOT bookmarked
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = false;

  // Storing local
  storingBookmarksLocal();
};

/*
  (ST) UPLOAD RECIPE
*/
export const uplaodRecipe = async function (newRecipe) {
  try {
    // Concerting Object directly in an array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) throw new Error('Wrong ingrient format!');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    console.log(data);
  } catch (error) {
    throw error;
  }
};
