class Renderer {
  static mainContainerEl = { get: () => document.querySelector('main') }
  static originErrorMessage = {
    get: () => document.getElementById('origin-error').textContent,
    set: (message) => document.getElementById('origin-error').textContent = message
  }
  static destinationErrorMessage = {
    get: () => document.getElementById('destination-error').textContent,
    set: (message) => document.getElementById('destination-error').textContent = message
  }
  static routeErrorMessage = {
    get: () => document.getElementById('route-error').textContent,
    set: (message) => document.getElementById('route-error').textContent = message
  }
  static icons = {
    walking: '<i class="fas fa-walking" aria-hidden="true"></i>',
    riding: '<i class="fas fa-bus" aria-hidden="true"></i>',
    waiting: '<i class="fas fa-pause-circle" aria-hidden="true"></i>',
    transfer: '<i class="fas fa-ticket-alt" aria-hidden="true"></i>',
    total: '<i class="fas fa-equals" aria-hidden="true"></i>',
  }

  static clearErrors = () => {
    this.routeErrorMessage.set('');
    this.originErrorMessage.set('');
    this.destinationErrorMessage.set('');
  }

  static buildDurationHtml = (segment) => {
    let durationsHtml = '<td>';

    if (segment.type === 'transfer') {
      durationsHtml += `${this.icons.transfer}: `;
    }

    for (let [key, value] of Object.entries(segment.durations))
      if (key !== 'total' && value > 0) {
        durationsHtml += `${this.icons[key]} <span>${value} min</span>`;
      }

    durationsHtml += '</td>';

    return durationsHtml;
  }

  static buildSelectedTripHtml = () => {
    let tripHtml = '';

    if (tripPlanner.selectedTripPlan.planSegments === undefined) {
      return '';
    }

    tripPlanner.selectedTripPlan.planSegments.forEach(segment => {
      tripHtml += `
      <tr>
        ${this.buildDurationHtml(segment)}
        <td>${segment.instructions}</td>
      </tr>`;
    })

    return tripHtml;
  }

  static buildTripPlansHtml = () => {
    if (tripPlanner.currentTripPlans.length <= 0) {
      return '';
    }

    const alternatePlans = tripPlanner.currentTripPlans.alternatePlans;
    const recommendedPlan = tripPlanner.currentTripPlans.recommendedPlan;
    let tripPlansHtml = `
    <div id="available-routes">
      <h1>Available Routes</h1>`;

    tripPlansHtml += `
    <h2>Recommended:</h2>
    <h3>Route ${recommendedPlan.planNumber}</h3>
    <div class="trip-plan" data-plan=${recommendedPlan.planNumber}>
      <p class="ignore-click">
        ${this.icons.walking}${recommendedPlan.durations.walking}min
        ${this.icons.riding}${recommendedPlan.durations.riding}min
        ${this.icons.waiting}${recommendedPlan.durations.waiting}min
        ${this.icons.total}${recommendedPlan.durations.total}min
      </p>
    </div>
    <h2>Alternate:</h2>`;

    alternatePlans.forEach(plan => {
      tripPlansHtml += `
      <h3>Route ${plan.planNumber}</h3>
      <div class="trip-plan" data-plan=${plan.planNumber}>
        <p class="ignore-click">
          ${this.icons.walking}${plan.durations.walking}min
          ${this.icons.riding}${plan.durations.riding}min
          ${this.icons.waiting}${plan.durations.waiting}min
          ${this.icons.total}${plan.durations.total}min
        </p>
      </div>`;
    })

    tripPlansHtml += '</div>';

    return tripPlansHtml;
  }

  static usingUserLocation = () => {
    if (Navigator.usingUserLocation) {
      return `Don't Use My Location`;
    }

    return 'Use My Location';
  }

  static getFormInput = (valueToGet) => {
    if (document.getElementById(`${valueToGet}-form`) !== null) {
      return UI[`${valueToGet}InputValue`].get();
    }

    return '';
  }

  static isSelected = (result) => {
    if (result.selected === true) {
      return 'selected';
    }

    return '';
  }

  static buildUserLocationOriginListItem = () => {
    return `<p id="users-location" data-name="user-location" data-address="user-coords" data-lon="${Navigator.coords.longitude}" data-lat="${Navigator.coords.latitude}">Using Your Location</p>`;
  }

  static buildListHtml = (listType) => {
    let listHtml = '';

    if (Navigator.usingUserLocation && listType === 'Origin') {
      if (document.getElementById('origin-form') !== null) {
        const userOriginEl = this.buildUserLocationOriginListItem();
        UI.currentOriginEl = document.getElementById('users-location');
        return userOriginEl;
      }
    }

    mapBox[`current${listType}Results`].forEach(result => {
      listHtml += `
      <li class="${this.isSelected(result)}" data-lon=${result.lon} data-lat=${result.lat} data-name="${result.name}" data-address="${result.address}">
        <div class="name ignore-click">${result.name}</div>
        <div class="ignore-click">${result.address}</div>
      </li>`;
    })

    return listHtml;
  }

  static hideElement = () => {
    if (Navigator.usingUserLocation) {
      return `class="hidden"`;
    }

    return '';
  }

  static getErrorText = (typeOfError) => {
    if (document.getElementById(`${typeOfError}-error`) !== null) {
      return this[`${typeOfError}ErrorMessage`].get();
    }

    return '';
  }

  static renderPage = () => {
    this.mainContainerEl.get().innerHTML = `
    <div class="origin-container">
      <p id="origin-error" class="error">${this.getErrorText('origin')}</p>
      <form id="origin-form">
        <input id="origin-input" ${this.hideElement()} placeholder="Find a starting location" type="text" value="${this.getFormInput('origin')}"/>
      </form>
    
      <ul class="origins">
        ${this.buildListHtml('Origin')}
      </ul>
    </div>
    
    <div class="destination-container">
      <p id="destination-error" class="error">${this.getErrorText('destination')}</p>
      <form id="destination-form">
        <input id="destination-input" placeholder="Choose your Destination" type="text" value="${this.getFormInput('destination')}"/>
      </form>
    
      <ul class="destinations">
        ${this.buildListHtml('Destination')}
      </ul>
    </div>
    
    <div class="button-container">
    <button id="plan-trip">Plan My Trip</button>
    <button id="user-location">${this.usingUserLocation()}</button>
    </div>
    
    <div class="bus-container">
      <h2 id="route-error" class="error">${this.getErrorText('route')}</h2>
      ${this.buildTripPlansHtml()}
      <table id="my-trip">
        <tbody>
        ${this.buildSelectedTripHtml()}
        </tbody>
      </table>
    </div>`;
  }

}

Renderer.renderPage();