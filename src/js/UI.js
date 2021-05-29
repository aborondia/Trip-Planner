class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
  static destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };
  static currentOriginEl = '';
  static currentDestinationEl = '';

  static handleFormSubmitEvent(target) {
    // don't clear other form input on submit
    if (target === this.originFormEl.get()) {
      mapBox.getOriginSearchResults();
    }

    if (target === this.destinationFormEl.get()) {
      mapBox.getDestinationSearchResults();
    }
  }

  static checkIfBothLocationsSelected = () => {
    const originEmptyMessage = 'Please select an origin.'
    const destinationEmptyMessage = 'Please select a destination.'


    if (this.currentOriginEl === '' && this.currentDestinationEl === '') {
      Renderer.renderEmptySelectionMessage(originEmptyMessage, destinationEmptyMessage);
      return false;
    }

    if (this.currentOriginEl === '') {
      Renderer.renderEmptySelectionMessage(originEmptyMessage, '');
      return false;
    }

    if (this.currentDestinationEl === '') {
      Renderer.renderEmptySelectionMessage('', destinationEmptyMessage);
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