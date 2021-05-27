class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
  static destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };
  static currentOriginEl = '';
  static currentDestinationEl = '';

  static handleFormSubmitEvent(target) {
    if (target === this.originFormEl.get()) {
      mapBox.getOriginSearchResults();
      // Renderer.renderPage();
    }

    if (target === this.destinationFormEl.get()) {
      mapBox.getDestinationSearchResults();
      // Renderer.renderPage();
    }
  }

  static selectNewResult = (target, typeOfResult) => {
    const listElements = document.querySelectorAll(`.${typeOfResult} > LI`);

    listElements.forEach(listItem => {
      listItem.classList.remove('selected');
    })

    target.classList.add('selected');
    console.log('Current Origin: ', this.currentOriginEl, '\nCurrent Destination: ', this.currentDestinationEl);
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
      tripPlanner.getTripPlan();
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