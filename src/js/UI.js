class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static originInputValue = {
    get: () => this.originFormEl.get().firstElementChild.value,
    set: () => this.originFormEl.get().firstElementChild.value = ''
  };
  static destinationInputValue = {
    get: () => this.destinationFormEl.get().firstElementChild.value,
    set: () => this.destinationFormEl.get().firstElementChild.value = ''
  };
  static currentOriginEl = '';
  static currentDestinationEl = '';

  static inputEmpty = (inputType) => {
    const originInputValue = this.originInputValue.get();
    const destinationInputValue = this.destinationInputValue.get();

    if (inputType === 'origin' && originInputValue === '') {
      Renderer.renderInputErrorMessage('Please enter an origin', '');
      return true;
    }

    if (inputType === 'destination' && destinationInputValue === '') {
      Renderer.renderInputErrorMessage('', 'Please enter a destination');
      return true;
    }

    return false;
  }

  static handleFormSubmitEvent(target) {
    if (target === this.originFormEl.get()) {
      if (!this.inputEmpty('origin')) {
        mapBox.getSearchResults('origin');
        this.originInputValue.set();
      }
    }

    if (target === this.destinationFormEl.get()) {
      if (!this.inputEmpty('destination')) {
        mapBox.getSearchResults('destination');
        this.destinationInputValue.set();
      }
    }
  }

  static checkIfBothLocationsSelected = () => {
    const originEmptyMessage = 'Please select an origin.'
    const destinationEmptyMessage = 'Please select a destination.'


    if (this.currentOriginEl === '' && this.currentDestinationEl === '') {
      Renderer.renderInputErrorMessage(originEmptyMessage, destinationEmptyMessage);
      return false;
    }

    if (this.currentOriginEl === '') {
      Renderer.renderInputErrorMessage(originEmptyMessage, '');
      return false;
    }

    if (this.currentDestinationEl === '') {
      Renderer.renderInputErrorMessage('', destinationEmptyMessage);
      return false;
    }

    return true;
  }

  static checkIfSelectionsSame = () => {
    const originAddress = this.currentOriginEl.dataset.address;
    const destinationAddress = this.currentDestinationEl.dataset.address;
    if (originAddress === destinationAddress) {
      Renderer.renderPage('same selections');
      return false;
    }

    return true;
  }

  static checkForvalidSelections = () => {
    if (this.checkIfBothLocationsSelected() && this.checkIfSelectionsSame()) {
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
      this.checkForvalidSelections();
    }

    if (target.classList.contains('trip-plan')) {
      const selectedPlanNumber = target.dataset.plan;

      tripPlanner.selectedTripPlan = tripPlanner.currentTripPlans.find(plan => plan.planNumber.toString() === selectedPlanNumber);
      tripPlanner.currentTripPlans = [];
      Renderer.renderPage();
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

