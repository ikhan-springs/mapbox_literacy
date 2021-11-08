import React, { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import litData from "./data/PIAAC_County_Indicators_of_Adult_Literacy_and_Numeracy.geojson"
//import stateData from "./data/gz_2010_us_040_00_5m.json"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN


const App = () => {

  const mapContainer = useRef()

  useEffect(() => {

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/elpepino/ckv9r28qh8v6a15phamwis4jw',
      center: [-100.04, 38.907],
      zoom: 3
    })
    
    map.on("load", () => {

      map.addSource("lit-source", {
        type: "geojson",
        data: litData
      })

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
          ["get", "Lit_A"],
          171.9,
          "#000000",
          292.9,
          "hsl(180, 93%, 59%)"
        ],
        'fill-outline-color': 'rgba(0, 0, 0, 1)',
        'fill-opacity': 0.8
        }
        });

    })

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

    map.on('mouseenter', 'lit-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
      
    map.on('mouseleave', 'lit-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'num-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
      
    map.on('mouseleave', 'num-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => map.remove()
  }, [])
  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />

}


export default App