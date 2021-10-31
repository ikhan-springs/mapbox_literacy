import React, { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import litData from "./data/PIAAC_County_Indicators_of_Adult_Literacy_and_Numeracy.geojson"

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

      map.addSource("lit-vector", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      })

      map.addSource("lit-source", {
        type: "geojson",
        data: litData
      })

      map.addLayer({
        'id': 'lit-layer',
        'type': 'fill',
        'source': 'lit-source',
        'paint': {
        'fill-color': [
          "interpolate",
          ["linear"],
          ["get", "Lit_A"],
          189.3,
          "hsl(0, 95%, 45%)",
          299.9,
          "hsl(120, 99%, 56%)"
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
      .setHTML(`County Name: ${lit_info.properties.County} <br>
      PIAAC Literacy Average: ${lit_info.properties.Lit_A} <br>
      `)
      .addTo(map);
    });
    
      // Change the cursor to a pointer when
// the mouse is over the states layer.
    map.on('mouseenter', 'lit-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
      
      // Change the cursor back to a pointer
      // when it leaves the states layer.
    map.on('mouseleave', 'lit-layer', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => map.remove()
  }, [])
  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />

}


export default App