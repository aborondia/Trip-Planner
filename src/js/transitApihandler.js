class TripPlanner {
  constructor() {
    this.apiKey = 'd7PLUCql1DUVNbas9tgX';
    this.fetchUrl = { get: () => `https://api.winnipegtransit.com/v3/trip-planner.json?api-key=d7PLUCql1DUVNbas9tgX&origin=geo/${UI.currentOriginEl.dataset.lat},${UI.currentOriginEl.dataset.lon}&destination=geo/${UI.currentDestinationEl.dataset.lat},${UI.currentDestinationEl.dataset.lon}` }
    this.currentTripPlans = [];
    this.selectedTripPlan = {};
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

  getSegmentType = (segment) => {
    switch (segment.type) {
      case 'walk': return segment.times.durations.walking;
      case 'ride': return segment.times.durations.riding;
      case 'transfer': return segment.times.durations.waiting;
    }
  }
  getWalkInstructions = (segment, filteredSegment) => {
    const durations = segment.times.durations;
    const type = segment.type;
    let instructions1 = `Walk to `;

    if (segment.from !== undefined && segment.from.stop !== undefined) {
      const stopKey = segment.from.stop.key;
      const stopName = segment.from.stop.name;
      instructions1 = `Walk from stop #${stopKey} - ${stopName} to `
    }

    let instructions2 = 'your destination.';

    if (segment.to !== undefined && segment.to.stop !== undefined) {
      const destinationKey = segment.to.stop.key;
      const destinationName = segment.to.stop.name;
      instructions2 = `stop #${destinationKey} - ${destinationName}`;
    }

    filteredSegment.type = type;
    filteredSegment.instructions = instructions1 + instructions2;
    filteredSegment.durations = durations;
  }

  getRideInstructions = (segment, filteredSegment) => {
    const durations = segment.times.durations;
    const type = segment.type;
    const busNumber = segment.bus.key;
    const routeName = segment.route.name;
    const instructions = `Ride the #${busNumber} - ${routeName}.`;

    filteredSegment.type = type;
    filteredSegment.instructions = instructions;
    filteredSegment.durations = durations;
  }

  getTransferInstructions = (segment, filteredSegment) => {
    const durations = segment.times.durations;
    const type = segment.type;
    const stopNumber = segment.from.stop.key;
    const stopName = segment.from.stop.name;
    const destinationNumber = segment.to.stop.key;
    const destinationName = segment.to.stop.name;
    let instructions = `Transfer from stop #${stopNumber} - ${stopName} to stop #${destinationNumber} - ${destinationName}.`;

    filteredSegment.type = type;
    filteredSegment.instructions = instructions;
    filteredSegment.durations = durations;
  }

  getFilteredTripPlan = (plan, newPlan) => {
    const planSegments = [];

    plan.segments.forEach(segment => {
      let filteredSegment = {}

      filteredSegment.type = segment.type;
      filteredSegment.times = this.getDurations(segment);

      if (segment.type === 'walk') {
        this.getWalkInstructions(segment, filteredSegment);
      }

      if (segment.type === 'ride') {
        this.getRideInstructions(segment, filteredSegment);
      }

      if (segment.type === 'transfer') {
        this.getTransferInstructions(segment, filteredSegment);
      }


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
      arrayToFilter = arrayToFilter.filter(element => element.durations.total <= plan.durations.total);
    })

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(element => element.durations.walking <= plan.durations.walking);
      })
    }

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(element => element.durations.waiting <= plan.durations.waiting);
      })
    }

    if (arrayToFilter.length > 1) {
      arrayToFilter.forEach(plan => {
        arrayToFilter = arrayToFilter.filter(element => element.durations.riding <= plan.durations.riding);
      })
    }

    return arrayToFilter[0];
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
      .then(tripPlans => this.getFilteredTripPlans(tripPlans.plans))
      .then(() => Renderer.renderPage())
      .then(() => console.log(this.currentTripPlans))
      .catch((error) => console.log(error))
  }
}

const tripPlanner = new TripPlanner();

