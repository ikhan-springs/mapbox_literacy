import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import litData from "./data/PIAAC_County_Indicators_of_Adult_Literacy_and_Numeracy.geojson"
import LayerToggle from "./components/LayerToggle"
import "./App.css"
import Legend from "./components/Legend"
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


//NEED TO SET UP A ".env.local" FILE WITH THE "REACT_APP_MAPBOX_TOKEN" VARIABLE INITIALIZED TO YOUR API KEY!!!
//Otherwise the app is just gonna be white
mapboxgl.accessToken = "pk.eyJ1IjoiZWxwZXBpbm8iLCJhIjoiY2t3aTJ0bGE2MTQ4dDJ2bm82NXoxYXJ4bSJ9.IkoHxO31OtkWc0T4R8TtJw"


const App = () => {
  const options = [
    {
      name: 'Literacy',
      description: 'Average PIAAC Literacy score',
      property: 'Lit_A',
    },
    {
      name: 'Numeracy',
      description: 'Average PIAAC Numeracy score',
      property: 'Num_A',
    }
  ];

  const mapContainer = useRef(null);
  const [active, setActive] = useState(options[0]);
  const [map , setMap ]  = useState(null);

  useEffect(() => {

    //creates a temporary map object
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/elpepino/ckv9r28qh8v6a15phamwis4jw',
      center: [-100.04, 38.907],
      zoom: 3
    })

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'us',
      autocomplete: false,
      flyTo: {
        zoom: 7,
        maxZoom: 8,
        easing: function (t) {
          return t;
        }
      }
    });
    
    map.on("load", () => {

      map.addControl(geocoder)

      //adds the file in the data folder for use by the map
      map.addSource("lit-source", {
        type: "geojson",
        data: litData
      });

      //adds the literacy layer on the map, visible by default
      map.addLayer({
        'id': 'lit-layer',
        'type': 'fill',
        'source': 'lit-source',
        'layout': {
          'visibility': 'visible'
        },
        'paint': {
        'fill-color': [
          "interpolate",
          ["linear"],
          ["get", "Lit_A"],
          189.3,
          "#000000",
          299.9,
          "hsl(120, 99%, 56%)"
        ],
        'fill-outline-color': 'rgba(0, 0, 0, 1)',
        'fill-opacity': 0.8
        }
      });

      //adds the numeracy layer on the map, invisible by default
      map.addLayer({
        'id': 'num-layer',
        'type': 'fill',
        'source': 'lit-source',
        'layout': {
          'visibility': 'none'
        },
        'paint': {
        'fill-color': [
          "interpolate",
          ["linear"],
          ["get", "Num_A"],
          171.9,
          "#000000",
          292.9,
          "hsl(180, 93%, 59%)"
        ],
        'fill-outline-color': 'rgba(0, 0, 0, 1)',
        'fill-opacity': 0.8
        }
      });

      setMap(map);

    });

    //creates a pop up on the literacy layer map with state, county, and education levels
    map.on('click', 'lit-layer', (e) => {
      const lit_info = e.features[0]

      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>State:</b> ${lit_info.properties.State}<br>
      <b>County:</b> ${lit_info.properties.County} <br>
      <b>PIAAC Literacy Average:</b> ${lit_info.properties.Lit_A} <br>
      <b>Less than Highschool education:</b> ${lit_info.properties.Less_HS * 100}% <br>
      <b>Highschool education:</b> ${lit_info.properties.HS * 100}%<br>
      <b>Post Secondary education:</b> ${lit_info.properties.More_HS * 100}%<br>
      `)
      .addTo(map);
    });
    
    //creates a popup on the numeracy layer map with state, county, and education levels
    map.on('click', 'num-layer', (e) => {
      const lit_info = e.features[0]

      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>State:</b> ${lit_info.properties.State}<br>
      <b>County:</b> ${lit_info.properties.County} <br>
      <b>PIAAC Numeracy Average:</b> ${lit_info.properties.Num_A} <br>
      <b>Less than Highschool education:</b> ${lit_info.properties.Less_HS * 100}% <br>
      <b>Highschool education:</b> ${lit_info.properties.HS * 100}%<br>
      <b>Post Secondary education:</b> ${lit_info.properties.More_HS * 100}%<br>
      `)
      .addTo(map);
    });

    //mouse effects for the literacy layer
    map.on('mouseenter', 'lit-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
      
    map.on('mouseleave', 'lit-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    //mouse effects for the numeracy layer
    map.on('mouseenter', 'num-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
      
    map.on('mouseleave', 'num-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => map.remove();
  }, []);

 

  //This change state variable is used to toggle visibility of the layers
  const changeState = i => {
    setActive(options[i]);

    if (options[i].name === 'Numeracy'){
      map.setLayoutProperty('lit-layer', 'visibility', 'none')
      map.setLayoutProperty('num-layer', 'visibility', 'visible')
    } else {
      map.setLayoutProperty('lit-layer', 'visibility', 'visible')
      map.setLayoutProperty('num-layer', 'visibility', 'none')
    }

  };

  //returns the map object and puts the layer toggle button on the app
  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}>
      <Legend/>
      <LayerToggle
        options={options}
        property={active.property}
        changeState={changeState}
      />
    </div>
  )
}


export default App