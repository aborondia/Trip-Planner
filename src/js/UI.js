class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
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

  static checkIfSelectionsSame = () => {
    const originName = this.currentOriginEl.dataset.name;
    const destinationName = this.currentDestinationEl.dataset.name;

    if (originName === destinationName) {
      Renderer.routeErrorMessage.set('Please select two different locations.')
      Renderer.renderPage();
      return false;
    }

    return true;
  }

  static checkIfBothLocationsSelected = () => {
    const originEmptyMessage = 'Please select an origin.'
    const destinationEmptyMessage = 'Please select a destination.'


    if (this.currentOriginEl === '' && this.currentDestinationEl === '') {
      Renderer.originErrorMessage.set(originEmptyMessage);
      Renderer.destinationErrorMessage.set(destinationEmptyMessage);
      Renderer.renderPage();

      return false;
    }

    if (this.currentOriginEl === '') {
      Renderer.originErrorMessage.set(originEmptyMessage);
      Renderer.destinationErrorMessage.set('');
      Renderer.renderPage();

      return false;
    }

    if (this.currentDestinationEl === '') {
      Renderer.destinationErrorMessage.set(destinationEmptyMessage);
      Renderer.originErrorMessage.set('');
      Renderer.renderPage();
      
      return false;
    }

    return true;
  }

  static beginTripPlanning = () => {
    if (this.checkIfBothLocationsSelected() && this.checkIfSelectionsSame()) {
      Renderer.routeErrorMessage.set('');
      tripPlanner.getTripPlan();

      this.currentOriginEl = '';
      this.currentDestinationEl = '';
      tripPlanner.selectedTripPlan = {};
    }
  }

  static selectNewResult = (target, typeOfResult) => {
    const listElements = document.querySelectorAll(`.${typeOfResult} > LI`);

    listElements.forEach(listItem => {
      listItem.classList.remove('selected');
    })

    target.classList.add('selected');
  }

  static handleClickEvent = (target) => {
    if (target.tagName === 'LI') {
      const listSelected = target.closest('UL');

      if (listSelected.classList.contains('origins')) {
        this.currentOriginEl = target;

        this.selectNewResult(target, 'origins');
      }

      if (listSelected.classList.contains('destinations')) {
        this.currentDestinationEl = target;

        this.selectNewResult(target, 'destinations');
      }
    }

    if (target.classList.contains('plan-trip')) {
      this.beginTripPlanning();
    }

    if (target.classList.contains('trip-plan')) {
      const selectedPlanNumber = target.dataset.plan;

      tripPlanner.selectedTripPlan = tripPlanner.currentTripPlans.find(plan => plan.planNumber.toString() === selectedPlanNumber);
      tripPlanner.currentTripPlans = [];
      Renderer.renderPage();
    }
  }

  static inputEmpty = (inputType) => {
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
    if (target === this.originFormEl.get()) {
      if (!this.inputEmpty('origin')) {
        mapBox.getSearchResults('origin');
        Renderer.originErrorMessage.set('')
      }
    }

    if (target === this.destinationFormEl.get()) {
      if (!this.inputEmpty('destination')) {
        mapBox.getSearchResults('destination');
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

