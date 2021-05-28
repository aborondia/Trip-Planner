class Renderer {
  static mainContainerEl = { get: () => document.querySelector('main') }
  static icons = {
    walk: '<i class="fas fa-walking" aria-hidden="true"></i>',
    ride: '<i class="fas fa-bus" aria-hidden="true"></i>',
    wait: '<i class="fas fa-pause-circle" aria-hidden="true"></i>',
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
        ${this.icons.walk}${plan.durations.walking}min
        ${this.icons.ride}${plan.durations.riding}min
        ${this.icons.wait}${plan.durations.waiting}min
        ${this.icons.total}${plan.durations.total}min
      </p>`;
    })

    tripPlansHtml += '</div>';

    return tripPlansHtml;
  }

  static getSegmentInstructions = (segment) => {
    let instructionsHtml = '';

    if (segment.type === 'walk') {
      return '<p>walk details</p>';
    }

    if (segment.type === 'transfer') {
      return '<p>transfer details</p>';
    }

    if (segment.type === 'ride') {
      return '<p>ride details</p>';
    }
  }

  static buildTripHtml = () => {
    if (tripPlanner.selectedTripPlan.planSegments === undefined) {
      return '';
    }

    let tripHtml = '';
    const exampleSegments = [
      {
        "type": "walk",
        "times": {
          "total": 5,
          "walking": 5
        },
        "to": {
          "stop": {
            "key": 10126,
            "name": "Eastbound Corydon at Stafford",
            "centre": {
              "utm": {
                "zone": "14U",
                "x": 632113,
                "y": 5525571
              },
              "geographic": {
                "latitude": "49.86796",
                "longitude": "-97.16155"
              }
            }
          }
        }
      },
      {
        "type": "ride",
        "times": {
          "total": 23,
          "riding": 23
        },
        "busNumber": 765,
        "routeNumber": 18,
        "routeName": "Route 18 North Main-Corydon",
        "duration": 23
      },
      {
        "type": "walk",
        "times": {
          "total": 5,
          "walking": 5
        },
        "from": {
          "key": 10629,
          "name": "Northbound Main at James (Concert Hall)",
          "centre": {
            "utm": {
              "zone": "14U",
              "x": 633730,
              "y": 5529165
            },
            "geographic": {
              "latitude": "49.89991",
              "longitude": "-97.13782"
            }
          }
        },
        "to": {
          "destination": {
            "point": {
              "centre": {
                "utm": {
                  "zone": "14U",
                  "x": 633522,
                  "y": 5529030
                },
                "geographic": {
                  "latitude": "49.89874",
                  "longitude": "-97.14076"
                }
              }
            }
          }
        }
      }
    ]

    tripPlanner.selectedTripPlan.planSegments.forEach(segment => {
      this.getSegmentInstructions(segment);


      const example = `
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
</li>`;

      return tripHtml;
    })
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
    <ul class="my-trip">
    ${this.buildTripHtml()}
          </div>`;
  }
}

Renderer.renderPage();