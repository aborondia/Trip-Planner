class MapBox {
  constructor() {
    this.taraska = { lat: 49.94517344097148, lon: -97.19984167278717 };
    this.luxton = { lat: 49.92505890981441, lon: -97.11720242553508 };
    this.bboxWinnipeg = { minLon: -97.325875, minLat: 49.766204, maxLon: -96.953987, maxLat: 49.99275 };
    this.originFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.originInputValue.get()}.json?bbox=-97.325875,%2049.766204,%20-96.953987,%2049.99275&access_token=pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg&limit=10` };
    this.destinationFetchUrl = { get: () => `https://api.mapbox.com/geocoding/v5/mapbox.places/${UI.destinationInputValue.get()}.json?bbox=-97.325875,%2049.766204,%20-96.953987,%2049.99275&access_token=pk.eyJ1IjoiYWJvcm9uZGlhIiwiYSI6ImNrcDRxNDc1ODA0YTEybm5xcGl0bXU5N3AifQ.HKd0aKNsdN7FAtDTanMDWg&limit=10` };
  }

  getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  getOriginSearchResults = () => {
    this.getData(this.originFetchUrl.get())
      .then(data => console.log(data))
  }

  getDestinationSearchResults = () => {
    this.getData(this.destinationFetchUrl.get())
      .then(data => console.log(data))
  }
}

const mapBox = new MapBox();