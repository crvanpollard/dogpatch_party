map.on('load', function () {

    map.addLayer({
        "id": "route",
        "type": "line",
      "maxzoom": zoomThreshold,
        "source": {
            "type": "geojson",
            "data": {
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -122.38871,
            37.764269
          ],
          [
            -122.38896,
            37.767388
          ]
        ],
        "type": "LineString"
      },
      "id": "08edce8d4935d28010a3c78e762475dc"
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -122.38855,
            37.761702
          ],
          [
            -122.390656,
            37.761599
          ],
          [
            -122.390285,
            37.757775
          ],
          [
            -122.388179,
            37.757896
          ],
          [
            -122.388534,
            37.761711
          ]
        ],
        "type": "LineString"
      },
      "id": "1def62c0a8f23ce251c6e68d6ec4492a"
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -122.388713,
            37.764269
          ],
          [
            -122.387268,
            37.764341
          ]
        ],
        "type": "LineString"
      },
      "id": "8927bba22314d004c4932ba3ce92fe16"
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -122.388179,
            37.758017
          ],
          [
            -122.385532,
            37.75817
          ]
        ],
        "type": "LineString"
      },
      "id": "adb3dc9d1450d8d6719ec42079a1e7e9"
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            -122.388713,
            37.764269
          ],
          [
            -122.388615,
            37.763088
          ],
          [
            -122.388551,
            37.761697
          ]
        ],
        "type": "LineString"
      },
      "id": "d9e41a3c51c2618bb4d7cb29ddf873a5"
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
            "line-color": "#66cccc",
            "line-width": 3
        }
    });
});