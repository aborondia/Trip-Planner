class TripPlanner {
  constructor() {
    this.apiKey = 'd7PLUCql1DUVNbas9tgX';
    this.fetchUrl = { get: () => `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=d7PLUCql1DUVNbas9tgX&origin=geo/${UI.currentOriginEl.dataset.lat},${UI.currentOriginEl.dataset.lon}&destination=geo/${UI.currentDestinationEl.dataset.lat},${UI.currentDestinationEl.dataset.lon}` }
    this.currentTripPlans = [];
  }

  getSegmentTimes = (segment) => {
    const times = {};

    for (let [key, value] of Object.entries(segment.times.durations)) {
      if (value !== 0) {
        times[key] = value;
      }
    }

    return times;
  }

  getFilteredTripPlan = (plan, newPlan) => {
    const planSegments = [];

    plan.segments.forEach(segment => {
      const filteredSegment = {}

      filteredSegment.type = segment.type;
      filteredSegment.times = this.getSegmentTimes(segment);

      if (segment.type === 'walk') {
        if (segment.from.stop !== undefined) {
          filteredSegment.from = segment.from.stop;
        }

        filteredSegment.to = segment.to;
      }

      if (segment.type === 'ride') {
        filteredSegment.busNumber = segment.bus.key;
        filteredSegment.routeNumber = segment.route.key;
        filteredSegment.routeName = segment.route.name;
        filteredSegment.duration = segment.times.durations.riding;
      }

      if (segment.type === 'transfer') {
        filteredSegment.from = segment.from.stop;
        filteredSegment.times = segment.times.durations;
        filteredSegment.to = segment.to.stop;
      }


      planSegments.push(filteredSegment);
    })

    newPlan.planSegments = planSegments;
    console.log('newplan: ', newPlan)
    return newPlan;
  }

  getFilteredTripPlans = (tripPlans) => {
    const filteredPlans = [];

    tripPlans.forEach(plan => {
      const newPlan = {
        planNumber: plan.number,
        durations: plan.times.durations,
      }

      filteredPlans.push(this.getFilteredTripPlan(plan, newPlan))
    })

    this.currentTripPlans = filteredPlans;
  }

  getTripPlan = () => {
    DataFetcher.getData(tripPlanner.fetchUrl.get())
      .then(tripPlans => this.getFilteredTripPlans(tripPlans.plans))
      .then(() => Renderer.renderPage())
      .then(() => console.log(this.currentTripPlans))
  }
}

const tripPlanner = new TripPlanner();

