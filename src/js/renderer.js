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

  static buildDurationHtml = (segment) => {
    let durationsHtml = '<td>';

    if (segment.type === 'transfer') {
      durationsHtml += `${this.icons.transfer}: `;
    }

    for (let [key, value] of Object.entries(segment.durations))
      if (key !== 'total' && value > 0) {
        durationsHtml += `${this.icons[key]}<span> ${value} min</span>`;
      }

    durationsHtml += '</td>';
    return durationsHtml;
  }

  static buildTripHtml = () => {
    if (tripPlanner.selectedTripPlan.planSegments === undefined) {
      return '';
    }

    let tripHtml = '';

    tripPlanner.selectedTripPlan.planSegments.forEach(segment => {
      tripHtml += `
<tr>
${this.buildDurationHtml(segment)}
<td>${segment.instructions}</td>
</tr>
`;
    })

    return tripHtml;
  }

  static buildRouteHtml = () => {
    const alternatePlans = tripPlanner.currentTripPlans.alternatePlans;
    const recommendedPlan = tripPlanner.currentTripPlans.recommendedPlan;
    let tripPlansHtml = `
    <div id="available-routes">
      <h1>Available Routes</h1>
      <h2>Recommended:</h2>`;

    if (tripPlanner.currentTripPlans.length <= 0) {
      return '';
    }

    tripPlansHtml += `
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
  static getErrorText = (typeOfInput) => {
    if (typeOfInput === 'origin') {
      if (document.getElementById('origin-error') !== null) {
        return this.originErrorMessage.get();
      }
    }

    if (typeOfInput === 'destination') {
      if (document.getElementById('destination-error') !== null) {
        return this.destinationErrorMessage.get();
      }
    }

    if (typeOfInput === 'same-selection') {
      if (document.getElementById('route-error') !== null) {
        return this.routeErrorMessage.get();
      }
    }

    return '';
  }

  static getInputValue = (valueToGet) => {
    if (valueToGet === 'origin') {
      if (document.getElementById('origin-form') !== null) {
        return UI.originInputValue.get();
      }
    }

    if (valueToGet === 'destination') {
      if (document.getElementById('destination-form') !== null) {
        return UI.destinationInputValue.get();
      }
    }

    return '';
  }

  static checkIfSelected = (result) => {
    if (UI.currentOriginEl !== '') {
      if (UI.currentOriginEl.dataset.name === result.name && UI.currentOriginEl.dataset.address === result.address) {
        return 'selected';
      }
    }

    return '';
  }

  static buildListHtml = (listType) => {
    let listHtml = '';

    mapBox[`current${listType}Results`].forEach(result => {
      listHtml += `
      <li class="${this.checkIfSelected(result)}" data-lon=${result.lon} data-lat=${result.lat} data-name="${result.name} data-address=${result.address}">
        <div class="name ignore-click">${result.name}</div>
        <div class="ignore-click">${result.address}</div>
      </li>`;
    })

    return listHtml;
  }

  static renderPage = () => {
    this.mainContainerEl.get().innerHTML = `
    <div class="origin-container">
      <p id="origin-error" class="error">${this.getErrorText('origin')}</p>
      <form id="origin-form">
        <input id="origin-input" placeholder="Find a starting location" type="text" value="${this.getInputValue('origin')}"/>
      </form>
    
      <ul class="origins">
        ${this.buildListHtml('Origin')}
      </ul>
    </div>
    
    <div class="destination-container">
      <p id="destination-error" class="error">${this.getErrorText('destination')}</p>
      <form id="destination-form">
        <input id="destination-input" placeholder="Choose your Destination" type="text" value="${this.getInputValue('destination')}"/>
      </form>
    
      <ul class="destinations">
        ${this.buildListHtml('Destination')}
      </ul>
    </div>
    
    <div class="button-container">
    <button class="plan-trip">Plan My Trip</button>
    </div>
    
    <div class="bus-container">
      <h2 id="route-error" class="error">${this.getErrorText('same-selection')}</h2>
      ${this.buildRouteHtml()}
      <table id="my-trip">
        <tbody>
        ${this.buildTripHtml()}
        </tbody>
      </table>
    </div>`;
  }
}

Renderer.renderPage();