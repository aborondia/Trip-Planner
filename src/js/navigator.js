class Navigator {
  constructor() {
    this.coords = {};
  }

  getLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(resolve)
    })
  }
}