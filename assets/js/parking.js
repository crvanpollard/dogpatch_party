map.on('load', function () {

    map.addLayer({
        "id": "parking",
        "type": "point",
        "source": {
            "type": "geojson",
            "data": {"type":"FeatureCollection","features":[{"geometry": {"type": "Point", "coordinates": [-122.3870041, 37.7598249]}, "type": "Feature", "id": 0, "properties": {"Category": "Needs & Wants", "City": "San Francisco", "MAP_ID": 101, "Name": "Paid Parking Lot", "Zip": 94107, "ADA_PARK": "no", "AM_ICON": "dp", "LONG": -122.3870041, "State": "CA", "Amenities": "Parking Lot", "sponsor": "no", "Address": "901 Illinois St", "LAT": 37.7598249, "steps": "no", "POPCOLOR": "#ff6666", "OLD_MAP": 99, "TYPE": "stroll3", "ADA_WC": "no"}
          }]}
    }
});
});