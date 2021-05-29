class Renderer {
  static mainContainerEl = { get: () => document.querySelector('main') }
  static emptyOriginParagraphEl = { get: () => document.getElementById('empty-origin') };
  static emptyDestinationParagraphEl = { get: () => document.getElementById('empty-destination') };
  static icons = {
    walking: '<i class="fas fa-walking" aria-hidden="true"></i>',
    riding: '<i class="fas fa-bus" aria-hidden="true"></i>',
    waiting: '<i class="fas fa-pause-circle" aria-hidden="true"></i>',
    transfer: '<i class="fas fa-ticket-alt" aria-hidden="true"></i>',
    total: '<i class="fas fa-equals" aria-hidden="true"></i>',
  }

  static checkIfSelected = (result) => {
    if (UI.currentOriginEl !== '') {
      if (UI.currentOriginEl.dataset.address === result.address) {
        return 'selected'
      }
    }

    return '';
  }

  static buildRouteHtml = () => {
    if (tripPlanner.currentTripPlans.length <= 0) {
      return '';
    }
    const recommendedPlan = tripPlanner.currentTripPlans.recommendedPlan;
    const alternatePlans = tripPlanner.currentTripPlans.alternatePlans;
    let tripPlansHtml = `
    <div id="available-routes">
    <h1>Available Routes</h1>
    <h2>Origin: {UI.currentOriginEl.dataset.address}</h2>
    <h2>Destination: {UI.currentDestinationEl.dataset.address}</h2>
    <h2>Recommended:</h2>
    <h3>Route ${recommendedPlan.planNumber}</h3>
    <p class="trip-plan" data-plan=${recommendedPlan.planNumber}>
    ${this.icons.walking}${recommendedPlan.durations.walking}min
    ${this.icons.riding}${recommendedPlan.durations.riding}min
    ${this.icons.waiting}${recommendedPlan.durations.waiting}min
    ${this.icons.total}${recommendedPlan.durations.total}min
    </p>
    <h2>Alternate:</h2>`;

    alternatePlans.forEach(plan => {
      tripPlansHtml += `
      <h3>Route ${plan.planNumber}</h3>
      <p class="trip-plan" data-plan=${plan.planNumber}>
        ${this.icons.walking}${plan.durations.walking}min
        ${this.icons.riding}${plan.durations.riding}min
        ${this.icons.waiting}${plan.durations.waiting}min
        ${this.icons.total}${plan.durations.total}min
      </p>`;
    })

    tripPlansHtml += '</div>';

    return tripPlansHtml;
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
  static buildListHtml = (listType) => {
    let listHtml = '';

    mapBox[`current${listType}Results`].forEach(result => {
      listHtml += `
    <li class="${this.checkIfSelected(result)}" data-lon=${result.lon} data-lat=${result.lat} data-address="${result.address}">
      <div class="name ignore-click">${result.name}</div>
      <div class="ignore-click">${result.address}</div>
    </li>`;
    })

    return listHtml;
  }

  static renderEmptySelectionMessage = (emptyOriginMessage = '', emptyDestinationMessage = '') => {
    this.emptyOriginParagraphEl.get().innerHTML = `<p class="error">${emptyOriginMessage}</p>`;
    this.emptyDestinationParagraphEl.get().innerHTML = `<p class="error">${emptyDestinationMessage}</p>`;
  }

  static getErrorMessage = (errorType) => {
    const noPlansHtml = `I'm sorry, there are no available results right now. Please try again later.`;
    const sameSelectionsHtml = `Please select two different locations.`;

    switch (errorType) {
      case 'no plans': return noPlansHtml;
      case 'same selections': return sameSelectionsHtml;
      default: return '';
    }
  }

  static renderPage = (errorType = '') => {
    this.mainContainerEl.get().innerHTML = `
    <div class="origin-container">
      <p id="empty-origin"></p>
      <form id="origin-form">
        <input placeholder="Find a starting location" type="text" />
      </form>
    
      <ul class="origins">
        ${this.buildListHtml('Origin')}
      </ul>
    </div>
    
    <div class="destination-container">
      <p id="empty-destination"></p>
      <form id="destination-form">
        <input placeholder="Choose your Destination" type="text" />
      </form>
    
      <ul class="destinations">
        ${this.buildListHtml('Destination')}
      </ul>
    </div>
    
    <div class="button-container">
    <button class="plan-trip">Plan My Trip</button>
    </div>
    
    <div class="bus-container">
    <h2 class="error">${this.getErrorMessage(errorType)}</h2>
      ${this.buildRouteHtml()}
    <table id="my-trip">
    ${this.buildTripHtml()}
    </table>
          </div>`;
  }
}

Renderer.renderPage();