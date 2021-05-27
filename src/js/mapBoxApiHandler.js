class MapBox {
  constructor() {
    this.currentOriginResults = [];
    this.currentDestinationResults = [];
    this.bboxWinnipeg = { minLon: -97.325875, minLat: 49.766204, maxLon: -96.953987, maxLat: 49.99275 };
    this.originFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.originInputValue.get()}.json?bbox=-97.325875,%2049.766204,%20-96.953987,%2049.99275&access_token=pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg&limit=10` };
    this.destinationFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.destinationInputValue.get()}.json?bbox=-97.325875,%2049.766204,%20-96.953987,%2049.99275&access_token=pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg&limit=10` };
  }

  getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  getFilteredSearchResults = (searchResults, resultsType) => {
    const newResults = [];
    searchResults.features.forEach(result => {
      newResults.push({
        name: result.text,
        address: result.properties.address,
        lat: result.center[1],
        lon: result.center[0],
      })
    })

    if (resultsType === 'origin') {
      this.currentOriginResults = newResults;
    }

    if (resultsType === 'destination') {
      this.currentDestinationResults = newResults;
    }

  }

  getOriginSearchResults = () => {
    this.getData(this.originFetchUrl.get())
      .then(searchResults => this.getFilteredSearchResults(searchResults, 'origin'))
      .then(()=> Renderer.renderPage())
      .then(() => console.log('Origin: ', this.currentOriginResults))
  }

  getDestinationSearchResults = () => {
    this.getData(this.destinationFetchUrl.get())
      .then(searchResults => this.getFilteredSearchResults(searchResults, 'destination'))
      .then(()=> Renderer.renderPage())
      .then(() => console.log('Destination: ', this.currentDestinationResults))
  }
}

const mapBox = new MapBox();