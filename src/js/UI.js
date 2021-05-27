class UI {
    static originFormEl = { get: () => document.getElementById('origin-form') };
    static destinationFormEl = { get: () => document.getElementById('destination-form') };
    static originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
    static destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };

  static handleFormSubmit(target) {
    if (target === this.originFormEl.get()) {
      console.log(this.originInputValue.get());
      Renderer.renderPage();
    }

    if (target === this.destinationFormEl.get()) {
      console.log(this.destinationInputValue.get());
      Renderer.renderPage();
    }
  }

}

document.body.addEventListener('submit', (event) => {
  const target = event.target;

  event.preventDefault();
  UI.handleFormSubmit(target);
})