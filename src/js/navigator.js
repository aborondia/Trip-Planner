class Navigator {
  static coords = {};
  static usingUserLocation = false;

  static getLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        Navigator.coords = position.coords;
        mapBox.getUserOrigin(position)
      }, Navigator.locationNotAvailable);
    })
  }

  static locationNotAvailable = () => {
    Renderer.routeErrorMessage.set('Please Turn Location Services On');
    tripPlanner.clearTripPlans();
    Renderer.renderPage();
  }
}