class TripPlanner {
  constructor() {
    this.apiKey = 'd7PLUCql1DUVNbas9tgX';
    this.fetchUrl = { get: () => `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=${this.apiKey}&origin=geo/${UI.currentOriginEl.dataset.lat},${UI.currentOriginEl.dataset.lon}&destination=geo/${UI.currentDestinationEl.dataset.lat},${UI.currentDestinationEl.dataset.lon}` }
    this.currentTripPlans = [];
    this.selectedTripPlan = {};
  }

  clearTripPlans = () => {
    this.currentTripPlans = [];
    this.selectedTripPlan = {};
  }

  getAlternatePlans = (filteredPlans) => {
    const alternatePlans = [];

    filteredPlans.forEach(plan => {
      if (plan.planNumber !== filteredPlans.recommendedPlan.planNumber) {
        alternatePlans.push(plan);
      }
    })

    return alternatePlans;
  }

  getRecommendedPlan = (filteredPlans) => {
    let arrayToFilter = [...filteredPlans];

    filteredPlans.forEach(plan => {
      arrayToFilter = arrayToFilter.filter(planToFilter => planToFilter.durations.total <= plan.durations.total);
    })

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(planToFilter => planToFilter.durations.walking <= plan.durations.walking);
      })
    }

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(planToFilter => planToFilter.durations.waiting <= plan.durations.waiting);
      })
    }

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(planToFilter => planToFilter.durations.riding <= plan.durations.riding);
      })
    }

    return arrayToFilter[0];
  }

  getInstructions = (segment, filteredSegment) => {
    let instructions;
    let stopKey;
    let stopName;
    let destinationKey;
    let destinationName;
    const type = segment.type;
    const durations = segment.times.durations;

    if (type === 'walk') {
      let instructions1 = `Walk to `;
      let instructions2 = 'your destination.';

      if (segment.from !== undefined && segment.from.stop !== undefined) {
        stopKey = segment.from.stop.key;
        stopName = segment.from.stop.name;
        instructions1 = `Walk from stop #${stopKey} - ${stopName} to `
      }

      if (segment.to !== undefined && segment.to.stop !== undefined) {
        destinationKey = segment.to.stop.key;
        destinationName = segment.to.stop.name;
        instructions2 = `stop #${destinationKey} - ${destinationName}`;
      }

      instructions = instructions1 + instructions2;
    }

    if (type === 'ride') {
      const busNumber = segment.bus.key;
      const routeName = segment.route.name;
      instructions = `Ride the #${busNumber} - ${routeName}.`;
    }

    if (type === 'transfer') {
      stopKey = segment.from.stop.key;
      stopName = segment.from.stop.name;
      destinationKey = segment.to.stop.key;
      destinationName = segment.to.stop.name;
      instructions = `Transfer from stop #${stopKey} - ${stopName} to stop #${destinationKey} - ${destinationName}.`;
    }

    filteredSegment.type = type;
    filteredSegment.instructions = instructions;
    filteredSegment.durations = durations;
  }

  getFilteredTripPlan = (plan, newPlan) => {
    const planSegments = [];

    plan.segments.forEach(segment => {
      const filteredSegment = {}

      filteredSegment.type = segment.type;
      filteredSegment.times = this.getDurations(segment);
      this.getInstructions(segment, filteredSegment);
      planSegments.push(filteredSegment);
    })

    newPlan.planSegments = planSegments;

    return newPlan;
  }

  getDurations = (segment) => {
    const durations = {
      walking: segment.times.durations.walking,
      riding: segment.times.durations.riding,
      waiting: segment.times.durations.waiting,
      total: segment.times.durations.total,
    };

    for (let [type, duration] of Object.entries(durations)) {
      if (duration === undefined) {
        durations[type] = 0;
      }
    }

    return durations;
  }

  getFilteredTripPlans = (tripPlans) => {
    const filteredPlans = [];

    tripPlans.forEach(plan => {
      const newPlan = {
        planNumber: plan.number,
        durations: this.getDurations(plan),
      }

      filteredPlans.push(this.getFilteredTripPlan(plan, newPlan))
    })

    filteredPlans.recommendedPlan = this.getRecommendedPlan(filteredPlans);
    filteredPlans.alternatePlans = this.getAlternatePlans(filteredPlans);

    this.currentTripPlans = filteredPlans;
  }

  getTripPlan = () => {
    DataFetcher.getData(tripPlanner.fetchUrl.get())
      .then(tripPlans => {
        this.getFilteredTripPlans(tripPlans.plans);
        Renderer.renderPage();
      })
      .catch((error) => console.log(error))
  }
}

const tripPlanner = new TripPlanner();

