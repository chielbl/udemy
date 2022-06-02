import View from './view';
import previewView from './previewView';

class ResultView extends View {
  _parrentElement = document.querySelector('.results');
  _errorMessage = 'No recipe founded for your query, try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
