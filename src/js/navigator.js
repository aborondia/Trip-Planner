class Navigator {
  static coords = {};
  static usingUserLocation = false;

  static getLocation = async () => {
    return new Promise(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        Navigator.coords = position.coords;
        mapBox.getUserOrigin(position)
      }, Navigator.locationNotAvailable);
    })
  }

  static locationNotAvailable = () => {
    Renderer.routeErrorMessage.set('Please turn location services on');
    tripPlanner.clearTripPlans();
    Renderer.renderPage();
  }
}