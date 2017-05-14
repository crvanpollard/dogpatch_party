  var stores; 
  var HUB;
  var zoomThreshold = 16;
  var curbcuts;
  var nosidewalks;

  $(document).ready(function() {
    //OPEN ABOUT DIALOG
    $('#aboutModal').modal(); 
  });

  $(document).on('hide.bs.modal','#aboutModal', function () {
    setTimeout(goHome, 2000);
  //  map.flyTo({
  //    center: [-122.389165,37.760],
  //          zoom: 15,
  //          speed: 0.1,
  //          bearing: -5,
 //           pitch: 15
 //   });
  });
  // This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6ImNqMHdvdnd5MTAwMWEycXBocm4zbXVjZm8ifQ.3zjbFccILu6mL7cOTtp40A';

  // This adds the map
  var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: "map", 
    style: 'mapbox://styles/mapbox/dark-v9', 
  //style: 'mapbox://styles/crvanpollard/ciyd8fyqo008j2rqfku4qxcb9',
    center: [ -122.389165,37.756291], 
    bearing: 20, // Rotate Philly ~9° off of north, thanks Billy Penn.
    pitch: 50,
    zoom: 15
  });

  map.on('load', function (evt) {
   //   window.setTimeout(goHome, 3000);
    });

    function goHome() {
      // debugger
      if (map.loaded()) {
        var p = map.getPitch();
     //   console.log(p);
        if (p > 0) {
          map.flyTo({
            center: [-122.389165,37.760],
            zoom: 15,
            speed: 0.1,
            bearing: -5,
            pitch: 15
          });
        }
      }
    }

// add markers to map
HUB.features.forEach(function(marker2) {
    // create a DOM element for the marker
    var el2 = document.createElement('div');
    el2.className = 'marker2';
    el2.style.backgroundImage = 'url(https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/'+marker2.properties.ICON + '.png)';
    el2.style.width = '44px';
    el2.style.height ='44px';
  //  el2.addEventListener('click', function() {
  //      window.alert(marker2.properties.message);
  //  });

    // add marker to map
    new mapboxgl.Marker(el2)
        .setLngLat(marker2.geometry.coordinates)
        .addTo(map)
   });     

  // This adds the data to the map
  map.on('load', function (e) {
    // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
    map.addSource("places", {
      "type": "geojson",
      "data": stores
    });
    // Initialize the list
    buildLocationList(stores);
  });
  
  // This is where your interactions with the symbol layer used to be
  // Now you have interactions with DOM markers instead
  stores.features.forEach(function(marker, i) {
    // Create an img element for the marker
    var el = document.createElement('div');
      el.id = "marker-" + i;
      el.className = 'marker';
   //   el.style.left ='-15px';
   //   el.style.top ='-46px';
      el.style.left ='-15px';
      el.style.top ='-26px';
      el.style.backgroundImage = 'url(https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/markers/'+marker.properties.MAP_ID + '.png)';
      el.style.width = '25px';
      el.style.height ='25px';

    // Add markers to the map at all points
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map); 

    el.addEventListener('click', function(e){
        // 1. Fly to the point
        flyToStore(marker);
        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);
        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('listing-' + i);
        listing.classList.add('active');
    });
  });

  function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 18
      }); 
  }

  function createPopUp(currentFeature) {
  /*  if (currentFeature.properties.MAP_ID < 10) {
          alert("Under 10");
    } else {
          alert("Over 10");
      } */

    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

      if (currentFeature.properties.info ==='na'){ var info2 = '';}
      else { var info2 =  currentFeature.properties.info +'<br>';}


      if (currentFeature.properties.Website ==='na'){ var web = '';}
      else { var web =  '<a class="one" href="' + currentFeature.properties.Website+'" target="_new">Visit the website</a>';}


    var popup = new mapboxgl.Popup({closeOnClick: false})
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML('<h3 style="padding-bottom:1px;background:'+ currentFeature.properties.POPCOLOR +'">'+ currentFeature.properties.Name +'<br><p class="addr">'+currentFeature.properties.Address + '</font></h3>' + 
            '<h4>' + info2 + web +'</h4>')
          .addTo(map);
  }

  function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      var prop = currentFeature.properties;
      
      var listings = document.getElementById(prop.TYPE);
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = "listing-" + i;
      
      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.dataPosition = i;
      link.innerHTML = '<img src="https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/markers/'+ prop.MAP_ID + '.png" style="vertical-align: middle;margin-right:5px;">'+ prop.Name;     
      
      var details = listing.appendChild(document.createElement('div'));
     // content = prop.Address + '<br>'+prop.Amenities;
      
      if (prop.ADA_WC ==='no'){ var WC = '';}
      else { var WC =  '<img class="list_icons" src="https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/amenities/ada_wc.png">';}

       if (prop.ADA_PARK ==='no'){ var Parking = '';}
      else { var Parking =  '<img class="list_icons" src="https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/amenities/ada_parking.png">';}

      content = '<div class="address_info">'
                + prop.Address 
                +'</div>'
                + '<div class="amen_icons"> <img class="list_icons" src="https://raw.githubusercontent.com/crvanpollard/mapbox_listings/master/assets/img/amenities/'
                + prop.AM_ICON 
                + '.png" >'
                + WC
                + Parking
                +'</div>';
               

      details.innerHTML = content;

      link.addEventListener('click', function(e){
        // Update the currentFeature to the store associated with the clicked link
        var clickedListing = data.features[this.dataPosition]; 
        // 1. Fly to the point
        flyToStore(clickedListing);
        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedListing);
        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
           activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
      });
    }
  }

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(),['top-left']);

document.getElementById('export').addEventListener('click', function () {
    // Fly to a random location by offsetting the point -74.50, 40
    // by up to 5 degrees.
    map.flyTo({
      center: [-122.389165,37.760],
            zoom: 15,
            speed: 0.5,
            bearing: -5,
            pitch: 15
    });
});


map.on('click', function (currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
});

// no sidewalks layer
map.on('load', function () {

    map.addLayer({
        "id": "No Sidewalks",
        "type": "fill",
        "source": {
            "type": "geojson",
            "data": nosidewalks
        },
     "layout": {},
           "paint": {
            "fill-color": '#F6A26E',
            "fill-opacity": 0.6
        }
        }
        )
    });


// curb cuts layer
map.on('load', function () {

    map.addLayer({
        "id": "Curb Cuts",
        "type": "circle",
        "source": {
            "type": "geojson",
            "data": curbcuts
        },
    //    'source-layer': 'sf2010',
        "paint": {
            "circle-radius": 3,
            "circle-color": 'rgba(254,224,139,.8)'
            }
        }
        )
    });

// walk about layer
map.on('load', function () {

    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
  "features": [
    {
      "type": "Feature",
      "properties": {
        "walking": "stroll2",
        "type": "soild",
        "color": "#ff6666"
      },
      "geometry": {
        "coordinates": [
          [
            -122.389871,
            37.753138
          ],
          [
            -122.389962,
            37.754006
          ],
          [
            -122.390076,
            37.755343
          ],
          [
            -122.389124,
            37.755391
          ],
          [
            -122.388169,
            37.75545
          ],
          [
            -122.387846,
            37.755477
          ],
          [
            -122.387949,
            37.756252
          ],
          [
            -122.387996,
            37.756593
          ],
          [
            -122.388057,
            37.757111
          ],
          [
            -122.388153,
            37.757881
          ],
          [
            -122.388489,
            37.757855
          ],
          [
            -122.388857,
            37.757835
          ],
          [
            -122.389119,
            37.757822
          ],
          [
            -122.389116,
            37.757796
          ],
          [
            -122.389946,
            37.757758
          ],
          [
            -122.390792,
            37.757702
          ],
          [
            -122.39105,
            37.757689
          ]
        ],
        "type": "LineString"
      },
      "id": "1627afce6db7189ec8a5aefab4c6223d"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388538,
            37.761698
          ],
          [
            -122.388445,
            37.760597
          ],
          [
            -122.388399,
            37.760359
          ],
          [
            -122.38835,
            37.759806
          ],
          [
            -122.38827,
            37.758978
          ],
          [
            -122.388188,
            37.758029
          ]
        ],
        "type": "LineString"
      },
      "id": "347dec898ca7a0c3f53c44b332ce0c83"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.390434,
            37.761586
          ],
          [
            -122.390678,
            37.761583
          ],
          [
            -122.390595,
            37.76069
          ],
          [
            -122.390546,
            37.760252
          ],
          [
            -122.390489,
            37.759742
          ],
          [
            -122.390434,
            37.759148
          ],
          [
            -122.390377,
            37.758529
          ],
          [
            -122.390309,
            37.757883
          ],
          [
            -122.391065,
            37.757843
          ]
        ],
        "type": "LineString"
      },
      "id": "557cb35ee6739222df7179b38ad73eaf"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388693,
            37.764275
          ],
          [
            -122.388042,
            37.764311
          ],
          [
            -122.387715,
            37.764198
          ],
          [
            -122.387393,
            37.764175
          ],
          [
            -122.386909,
            37.76419
          ]
        ],
        "type": "LineString"
      },
      "id": "600f198ecf31cbdfa863f3e6476f8d96"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype2",
        "type": "dash",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.391065,
            37.757843
          ],
          [
            -122.39197,
            37.757777
          ],
          [
            -122.392992,
            37.757719
          ],
          [
            -122.394012,
            37.757662
          ],
          [
            -122.394396,
            37.757632
          ],
          [
            -122.394422,
            37.757889
          ]
        ],
        "type": "LineString"
      },
      "id": "606664d6fd5a0b3c50c75891944d32b0"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "stroll1",
        "type": "soild",
        "color": "#ff6666"
      },
      "geometry": {
        "coordinates": [
          [
            -122.390093,
            37.75148
          ],
          [
            -122.389716,
            37.751506
          ],
          [
            -122.389837,
            37.75275
          ],
          [
            -122.389871,
            37.753138
          ],
          [
            -122.389703,
            37.753143
          ]
        ],
        "type": "LineString"
      },
      "id": "6d8ebb1eb4896d4f1baf6182ce6ce251"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388538,
            37.761698
          ],
          [
            -122.388884,
            37.761683
          ],
          [
            -122.38949,
            37.761648
          ],
          [
            -122.38973,
            37.761632
          ],
          [
            -122.390434,
            37.761586
          ]
        ],
        "type": "LineString"
      },
      "id": "9e2447f50a637b0ea0b9272d3d7f4378"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388162,
            37.758029
          ],
          [
            -122.388497,
            37.75801
          ],
          [
            -122.389135,
            37.757969
          ],
          [
            -122.389119,
            37.757823
          ],
          [
            -122.389366,
            37.757812
          ],
          [
            -122.390085,
            37.757773
          ],
          [
            -122.390336,
            37.757758
          ],
          [
            -122.391054,
            37.757714
          ],
          [
            -122.391067,
            37.757858
          ]
        ],
        "type": "LineString"
      },
      "id": "a2fc6cd2c075a5bb548002d413594cd6"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "stroll2",
        "type": "dash",
        "color": "#ff6666"
      },
      "geometry": {
        "coordinates": [
          [
            -122.391053,
            37.757713
          ],
          [
            -122.390926,
            37.756234
          ],
          [
            -122.390825,
            37.755233
          ],
          [
            -122.39065,
            37.753433
          ],
          [
            -122.39057,
            37.75249
          ],
          [
            -122.39046,
            37.751463
          ],
          [
            -122.390093,
            37.75148
          ]
        ],
        "type": "LineString"
      },
      "id": "bc2cb3fe63ce3fdb8e9223b0592d7e5b"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388093,
            37.767094
          ],
          [
            -122.389299,
            37.767023
          ],
          [
            -122.389247,
            37.766738
          ],
          [
            -122.389147,
            37.765718
          ],
          [
            -122.389086,
            37.765111
          ],
          [
            -122.389027,
            37.764405
          ],
          [
            -122.388707,
            37.76442
          ],
          [
            -122.388691,
            37.764255
          ],
          [
            -122.388646,
            37.763637
          ],
          [
            -122.388595,
            37.763148
          ],
          [
            -122.388561,
            37.76287
          ],
          [
            -122.388545,
            37.762232
          ],
          [
            -122.388528,
            37.76187
          ],
          [
            -122.388538,
            37.761699
          ]
        ],
        "type": "LineString"
      },
      "id": "c801dcda6d2408cff6a460ebfaa085c5"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype2",
        "type": "dash",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.390434,
            37.761586
          ],
          [
            -122.390458,
            37.761742
          ],
          [
            -122.391442,
            37.761678
          ],
          [
            -122.391384,
            37.761044
          ],
          [
            -122.391297,
            37.76014
          ],
          [
            -122.391246,
            37.759633
          ],
          [
            -122.39112,
            37.758309
          ],
          [
            -122.391067,
            37.757858
          ]
        ],
        "type": "LineString"
      },
      "id": "ee1af50b442058c6b714bb9cf4cb2904"
    },
    {
      "type": "Feature",
      "properties": {
        "walking": "hype1",
        "type": "solid",
        "color": "#66cccc"
      },
      "geometry": {
        "coordinates": [
          [
            -122.388162,
            37.758029
          ],
          [
            -122.387427,
            37.758064
          ],
          [
            -122.38555,
            37.758168
          ],
          [
            -122.385481,
            37.758095
          ],
          [
            -122.385248,
            37.757855
          ],
          [
            -122.385077,
            37.757749
          ],
          [
            -122.384858,
            37.7577
          ],
          [
            -122.38442,
            37.757713
          ],
          [
            -122.383443,
            37.757768
          ]
        ],
        "type": "LineString"
      },
      "id": "fa38bb4e5298d86b4ba9d2cfce6e4347"
    }
  ],
  "type": "FeatureCollection"
}
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
          //  "line-color": "#66cccc",
            "line-width": 3,
         //   "line-dasharray": [2,4],
            "line-color": {
                "type": "identity",
                "property": "color"
            }
        }

    });
});

// the 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
    map.addLayer({
        'id': 'Buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 14,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .5
        }
    });
    });

var toggleableLayerIds = [ 'Buildings', 'Curb Cuts'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
