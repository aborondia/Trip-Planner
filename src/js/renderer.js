class Renderer {
  static mainContainerEl = { get: () => document.querySelector('main') }
  static icons = {
    walking: '<i class="fas fa-walking" aria-hidden="true"></i>',
    riding: '<i class="fas fa-bus" aria-hidden="true"></i>',
    waiting: '<i class="fas fa-pause-circle" aria-hidden="true"></i>',
    transfer: '<i class="fas fa-ticket-alt" aria-hidden="true"></i>',
    total: '<i class="fas fa-equals" aria-hidden="true"></i>',
  }

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

  static buildRouteHtml = () => {
    if (tripPlanner.currentTripPlans.length <= 0) {
      return '';
    }

    let tripPlansHtml = `
    <div id="available-routes">
    <h2>Available Routes:</h2>
    `;

    // add recommended plan
    tripPlanner.currentTripPlans.forEach(plan => {
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
    for (let [key, value] of Object.entries(segment.durations))
      if (key !== 'total' && value > 0) {
        durationsHtml += `${this.icons[key]}<span>${value} min</span>`;
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
      ${this.buildRouteHtml()}
    <table id="my-trip">
    ${this.buildTripHtml()}
    </table>
          </div>`;
  }
}

Renderer.renderPage();