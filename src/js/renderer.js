class Renderer {
  static mainContainerEl = { get: () => document.querySelector('main') }

  static buildOriginListHtml = () => {
    let orginListHtml = '';

    mapBox.currentOriginResults.forEach(result => {
      orginListHtml += `
    <li data-lon=${result.lon} data-lat=${result.lat}>
      <div class="name ignore-click">${result.name}</div>
      <div class="ignore-click">${result.address}</div>
    </li>`;
    })

    return orginListHtml;
  }

  static buildRouteHtml = ()=>{
    return '';
  }

  static buildTripHtml = ()=>{
    return '';
  }

  static buildDestinationListHtml = () => {
    let destinationListHtml = '';

    mapBox.currentDestinationResults.forEach(result => {
      destinationListHtml += `
    <li data-lon=${result.lon} data-lat=${result.lat}>
      <div class="name ignore-click">${result.name}</div>
      <div class="ignore-click">${result.address}</div>
    </li>`;
    })

    return destinationListHtml;
  }

  static renderPage = () => {
    this.mainContainerEl.get().innerHTML = `
    <div class="origin-container">
      <form id="origin-form">
        <input placeholder="Find a starting location" type="text" />
      </form>
    
      <ul class="origins">
        ${this.buildOriginListHtml()}
      </ul>
    </div>
    
    <div class="destination-container">
      <form id="destination-form">
        <input placeholder="Choose your Destination" type="text" />
      </form>
    
      <ul class="destinations">
        ${this.buildDestinationListHtml()}
      </ul>
    </div>
    
    <div class="button-container">
    <button class="plan-trip">Plan My Trip</button>
    </div>
    
    <div class="bus-container">
    <ul id="available-routes">
      ${this.buildRouteHtml()}
    </ul>
    <ul class="my-trip">
    ${this.buildTripHtml()}
      <li>
        <i class="fas fa-walking" aria-hidden="true"></i>Walk for 15 minutes
        to stop #61121 - Southbound Dovercourt at Falcon Ridge
      </li>
      <li>
        <i class="fas fa-bus" aria-hidden="true"></i>Ride the Route 650
        McGillivray for 5 minutes.
      </li>
      <li>
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop
        #60208 - Northbound Waverley at Buffalo to stop #60208 - Northbound
        Waverley at Buffalo
      </li>
      <li>
        <i class="fas fa-bus" aria-hidden="true"></i>Ride the Route 78
        Waverley for 8 minutes.
      </li>
      <li>
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop
        #60307 - Northbound Cambridge at Corydon to stop #60692 - Eastbound
        Corydon at Cambridge East
      </li>
      <li>
        <i class="fas fa-bus" aria-hidden="true"></i>Ride the Route 18 North
        Main-Corydon for 6 minutes.
      </li>
      <li>
        <i class="fas fa-walking" aria-hidden="true"></i>Walk for 1 minutes to
        your destination.
      </li>
    </ul.available-routes>
    </div>`;
  }
}

Renderer.renderPage();