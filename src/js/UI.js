class UI {
  constructor() {
    this.originFormEl = { get: () => document.getElementById('origin-form') };
    this.destinationFormEl = { get: () => document.getElementById('destination-form') };
    this.originInputValue = { get: () => this.originFormEl.get().firstElementChild.value };
    this.destinationInputValue = { get: () => this.destinationFormEl.get().firstElementChild.value };
  }

  handleFormSubmit(target) {
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

const ui = new UI();

document.body.addEventListener('submit', (event) => {
  const target = event.target;

  event.preventDefault();
  ui.handleFormSubmit(target);
})