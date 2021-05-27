class UI {
  constructor() {
    this.mainContainerEl = document.querySelector('main');
    this.originFormEl = document.getElementById('origin-form');
    this.destinationFormEl = document.getElementById('destination-form');
    this.originInputValue = { get: () => this.originFormEl.firstElementChild.value }
    this.destinationInputValue = { get: () => this.destinationFormEl.firstElementChild.value }
  }

  handleFormSubmit(target) {
    if (target === this.originFormEl) {
      console.log(this.originInputValue.get());
    }

    if (target === this.destinationFormEl) {
      console.log(this.destinationInputValue.get());
    }
  }

}

const ui = new UI();

ui.mainContainerEl.addEventListener('submit', (event) => {
  const target = event.target;

  event.preventDefault();
  ui.handleFormSubmit(target);
})