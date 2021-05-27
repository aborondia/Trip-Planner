class UI {
  static originFormEl = { get: () => document.getElementById('origin-form') };
  static destinationFormEl = { get: () => document.getElementById('destination-form') };
  static originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
  static destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };

  static handleFormSubmit(target) {
    if (target === this.originFormEl.get()) {
      mapBox.getOriginSearchResults();
      // Renderer.renderPage();
    }

    if (target === this.destinationFormEl.get()) {
      mapBox.getDestinationSearchResults();
      // Renderer.renderPage();
    }
  }

}

document.body.addEventListener('submit', (event) => {
  const target = event.target;

  event.preventDefault();
  UI.handleFormSubmit(target);
})