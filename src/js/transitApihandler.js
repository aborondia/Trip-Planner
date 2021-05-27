class TripPlanner {
  constructor() {
    this.apiKey = 'd7PLUCql1DUVNbas9tgX';
    this.fetchUrl = { get: () => `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=d7PLUCql1DUVNbas9tgX&origin=geo/${UI.currentOriginEl.dataset.lat},${UI.currentOriginEl.dataset.lon}&destination=geo/${UI.currentDestinationEl.dataset.lat},${UI.currentDestinationEl.dataset.lon}` }
  }
  getTripPlan = () => {
    DataFetcher.getData(tripPlanner.fetchUrl.get())
      .then(data => console.log(data))
  }
}

const tripPlanner = new TripPlanner();

