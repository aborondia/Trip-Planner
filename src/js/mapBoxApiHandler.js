class MapBox {
  constructor() {
    this.currentOriginResults = [];
    this.currentDestinationResults = [];
    this.accessToken = 'pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg';
    this.bboxWinnipeg = '-97.325875,49.766204,-96.953987,49.99275';
    this.originFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.originInputValue.get()}.json?bbox=${this.bboxWinnipeg}&access_token=pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg&limit=10` };
    this.destinationFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.destinationInputValue.get()}.json?bbox=${this.bboxWinnipeg}&access_token=${this.accessToken}&limit=10` };
  }
  checkForEmptyResults = (typeOfResults) => {
    const emptyResultsMessage = 'No results found';

    if (typeOfResults === 'origin') {
      if (this.currentOriginResults.length === 0) {
        Renderer.originErrorMessage.set(emptyResultsMessage);
      }
    }

    if (typeOfResults === 'destination') {
      if (this.currentDestinationResults.length === 0) {
        Renderer.destinationErrorMessage.set(emptyResultsMessage);
      }
    }
  }

  getFilteredSearchResults = (searchResults, resultsType) => {
    const newResults = [];

    searchResults.features.forEach(result => {
      const newResult = {
        name: result.text,
        address: result.properties.address,
        lat: result.center[1],
        lon: result.center[0],
      }

      if (newResult.address === undefined) {
        return;
      }

      newResults.push(newResult);
    })

    if (resultsType === 'origin') {
      this.currentOriginResults = newResults;
    }

    if (resultsType === 'destination') {
      this.currentDestinationResults = newResults;
    }
  }

  getFetchUrl = (typeOfResults) => {
    if (typeOfResults === 'origin') {
      return this.originFetchUrl.get();
    }

    if (typeOfResults === 'destination') {
      return this.destinationFetchUrl.get();
    }
  }

  getSearchResults = (typeOfResults) => {
    const urlToFetch = this.getFetchUrl(typeOfResults);

    DataFetcher.getData(urlToFetch)
      .then(searchResults => {
        this.getFilteredSearchResults(searchResults, typeOfResults)
        this.checkForEmptyResults(typeOfResults);
        Renderer.renderPage();
        UI[`${typeOfResults}InputValue`].set('');
      })
      .catch((error) => console.log(error))
  }
}

const mapBox = new MapBox();