class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
  static destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };

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
    const listElement = document.querySelectorAll(`.${typeOfResult} > LI`);

    listElement.forEach(listItem => {
      listItem.classList.remove('selected');
    })

    target.classList.add('selected');
    console.log('Target: ', target);
  }

  static handleClickEvent = (target) => {
    if (target.tagName === 'LI') {
      if (target.closest('UL').classList.contains('origins')) {
        this.selectNewResult(target, 'origins');
      }

      if (target.closest('UL').classList.contains('destinations')) {
        this.selectNewResult(target, 'destinations');
      }

      // button
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