class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static userLocationButtonEl = { get: () => document.getElementById('user-location') };
  static originInputValue = {
    get: () => this.originFormEl.get().firstElementChild.value,
    set: (value) => this.originFormEl.get().firstElementChild.value = value
  };
  static destinationInputValue = {
    get: () => this.destinationFormEl.get().firstElementChild.value,
    set: (value) => this.destinationFormEl.get().firstElementChild.value = value
  };
  static currentOriginEl = '';
  static currentDestinationEl = '';

  static clearSelections() {
    const allListItems = mapBox.currentOriginResults.concat(mapBox.currentDestinationResults);
    allListItems.forEach(listItem => {
      listItem.selected = false;
    })
  }

  static selectionsSame = () => {
    const originName = this.currentOriginEl.dataset.name;
    const originAddress = this.currentOriginEl.dataset.address
    const destinationName = this.currentDestinationEl.dataset.name;
    const destinationAddress = this.currentDestinationEl.dataset.address;

    if (originName === destinationName && originAddress === destinationAddress) {
      Renderer.routeErrorMessage.set('Please select two different locations.')
      tripPlanner.clearTripPlans();
      Renderer.renderPage();
      return true;
    }

    return false;
  }

  static bothLocationsSelected = () => {
    const originEmptyMessage = 'Please select an origin.'
    const destinationEmptyMessage = 'Please select a destination.'


    if (this.currentOriginEl === '' && this.currentDestinationEl === '') {
      Renderer.originErrorMessage.set(originEmptyMessage);
      Renderer.destinationErrorMessage.set(destinationEmptyMessage);
      Renderer.renderPage();

      return true;
    }

    if (this.currentOriginEl === '') {
      Renderer.originErrorMessage.set(originEmptyMessage);
      Renderer.destinationErrorMessage.set('');
      Renderer.renderPage();

      return true;
    }

    if (this.currentDestinationEl === '') {
      Renderer.destinationErrorMessage.set(destinationEmptyMessage);
      Renderer.originErrorMessage.set('');
      Renderer.renderPage();

      return true;
    }

    return false;
  }

  static beginTripPlanning = () => {
    Renderer.renderPage();
    if (!this.bothLocationsSelected() && !this.selectionsSame()) {
      this.clearSelections();
      Renderer.clearErrors();
      tripPlanner.getTripPlan();

      this.currentOriginEl = '';
      this.currentDestinationEl = '';
      tripPlanner.selectedTripPlan = {};
    }
  }

  static selectNewResult = (target, typeOfResult) => {
    mapBox[`current${typeOfResult}Results`].forEach(result => {
      if (result.name === target.dataset.name && result.address === target.dataset.address) {
        result.selected = true;
        return;
      }

      result.selected = false;
    })

    Renderer.renderPage();
  }

  static handleClickEvent = (target) => {
    if (target.tagName === 'LI') {
      const listSelected = target.closest('UL');

      if (listSelected.classList.contains('origins')) {
        this.currentOriginEl = target;

        this.selectNewResult(target, 'Origin');
      }

      if (listSelected.classList.contains('destinations')) {
        this.currentDestinationEl = target;

        this.selectNewResult(target, 'Destination');
      }
    }

    if (target.id === 'plan-trip') {
      this.beginTripPlanning();
    }

    if (target.id === 'user-location') {
      if (Navigator.usingUserLocation) {
        Navigator.usingUserLocation = false;
        this.clearSelections();
        this.currentOriginEl = '';
        Renderer.renderPage();
        return;
      }

      Navigator.getLocation();
    }

    if (target.classList.contains('trip-plan')) {
      const selectedPlanNumber = target.dataset.plan;

      tripPlanner.selectedTripPlan = tripPlanner.currentTripPlans.find(plan => plan.planNumber.toString() === selectedPlanNumber);
      tripPlanner.currentTripPlans = [];
      Renderer.renderPage();
    }
  }

  static inputIsEmpty = (inputType) => {
    const originInputValue = this.originInputValue.get();
    const destinationInputValue = this.destinationInputValue.get();

    if (inputType === 'origin' && originInputValue === '') {
      Renderer.originErrorMessage.set('Please enter an origin');
      Renderer.renderPage();
      return true;
    }

    if (inputType === 'destination' && destinationInputValue === '') {
      Renderer.destinationErrorMessage.set('Please enter a destination');
      Renderer.renderPage();
      return true;
    }

    return false;
  }

  static handleFormSubmitEvent(target) {
    let formType;

    if (target === this.originFormEl.get()) {
      if (!this.inputIsEmpty('origin')) {
        mapBox.getSearchResults('origin');
        this.currentOriginEl = '';
        Renderer.originErrorMessage.set('')
      }
    }

    if (target === this.destinationFormEl.get()) {
      if (!this.inputIsEmpty('destination')) {
        mapBox.getSearchResults('destination');
        this.currentDestinationEl = '';
        Renderer.destinationErrorMessage.set('')
      }
    }
  }
}

document.body.addEventListener('submit', (event) => {
  const target = event.target;

  event.preventDefault();
  UI.handleFormSubmitEvent(target);
})

document.body.addEventListener('click', (event) => {
  const target = event.target;

  UI.handleClickEvent(target);
})

