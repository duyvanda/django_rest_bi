import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { ZoomControl } from "react-mapbox-gl";
import { ScaleControl } from "react-mapbox-gl";
import { RotationControl } from "react-mapbox-gl";
import { Popup } from "react-mapbox-gl";
import { Marker } from "react-mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaChartPie } from 'react-icons/fa';
import {Nav, Navbar, Container, Button, Row, Dropdown, NavDropdown, DropdownButton} from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";

function MapBox() {

  const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiZHV5dnEiLCJhIjoiY2xqaGJ5anJtMGg1bTNtbzJxNHl1bmtzNCJ9.EMV1gOcu5ild0gIepl9vdQ"
  });


  return (
  <Container fluid>
    <h1>MAP BOX</h1>
    <div align="center" className="mt-2">
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '85vh',
          width: '95vw'
        }}
        center={[106.6696745, 10.7751199]}
        zoom={[14]}
        
      >
        <ScaleControl/>
        <ZoomControl/>
        <RotationControl/>
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          <Feature coordinates={[106.6696745, 10.7751199]} />
        </Layer>
        <Popup
        coordinates={[106.6696745, 10.7751199]}
        >
        <h6>Pha Nam HCM</h6>
      </Popup>
      <Marker
        coordinates={[106.6777015, 10.7752953]} //10.7752953,106.6777015
        anchor="bottom">
        <h6>Marker</h6>
        <FaChartPie/>
      </Marker>
      </Map>
    </div>
  </Container>
  )
}

export default MapBox