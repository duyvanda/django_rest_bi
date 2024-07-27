/* eslint-disable */
import {Nav, Navbar, Container, Button, Row, Dropdown, NavDropdown, DropdownButton, Anchor, Badge, Image} from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet'
import L from "leaflet";
import { BsFillPinMapFill } from "react-icons/bs";
import { FaMapMarker } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";


import iconUrl from "../images/marker-icon-green.png"
import iconShadow from "../images/marker-shadow.png"
import circle from "../images/circle.png"
import PinSVG from "../images/pin-map-fill.svg"
import { cities } from '../data/cites';
import {defaultIcon, RedIcon} from "../icons/defaulticons"

const polyline = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
]

const limeOptions = { color: 'red',  dashArray: '5'}

const iconGreen = L.icon(
  {
    iconUrl: iconUrl,
    iconShadow: iconShadow,
    iconSize: [40, 40],
  }
)

const iconMarkupRed = renderToStaticMarkup(<HiLocationMarker size={25} color='red'/>);
const customMarkerIconRed = divIcon({html: iconMarkupRed,iconSize: [0, 0],iconAnchor: [17, 16]});

const iconMarkupGreen = renderToStaticMarkup(<HiLocationMarker size={25} color='green'/>);
const customMarkerIconGreen = divIcon({html: iconMarkupGreen,iconSize: [0, 0],iconAnchor: [17, 16]});

const iconMarkupBadge = renderToStaticMarkup(<Badge bg="info">Info</Badge> );
const customMarkerIconBadge = divIcon({html: iconMarkupBadge,iconSize: [0, 0],iconAnchor: [17, 16]});

const iconMarkupSVG = renderToStaticMarkup(<img src={PinSVG} alt='' /> );
const customMarkerIconSVG = divIcon({html: iconMarkupSVG,iconSize: [0, 0],iconAnchor: [17, 16]});

const iconMarkupIMG = renderToStaticMarkup(<Image src={circle} className='bg-danger' roundedCircle /> );
const customMarkerIconIMG = divIcon({html: iconMarkupIMG,iconSize: [0, 0],iconAnchor: [17, 16]});

const MarkerLayer = ({data}) => {
  return data.features.map( (feature, index) =>{
    const { coordinates, type } = feature.geometry;
    const { name } = feature.properties;
    const iconMarkupBadge = renderToStaticMarkup(<Badge pill bg="info">{index}</Badge> );
    const customMarkerIconBadge = divIcon({html: iconMarkupBadge,iconSize: [0, 0],iconAnchor: [17, 16]});
    return (
      type === '' ?
      <Marker key={index} position={ [coordinates[1],coordinates[0]] } icon={customMarkerIconRed}> 
      <Popup>{name}</Popup>
      </Marker>
      :
      <Marker key={index} position={ [coordinates[1],coordinates[0]] } icon={customMarkerIconIMG}>
        <Popup>{name}</Popup>
      </Marker>
    )
  }
)
}


const center = [51.505, -0.09]
const fillBlueOptions = { fillColor: 'blue' }

function MapBox() {

  const [initialPosition, setInitialPosition] = useState([0,0]);
  const [selectedPosition, setSelectedPosition] = useState([0,0]);
  const [arr_visit, set_arr_visit] = useState(
    [{
      "custid": "N06202110",
      "custname": "Bịnh viện Chợ Rẫy",
      "lat": "10.7775939",
      "lng": "106.6644298",
      "stt": "1"
    }, {
      "custid": "007237",
      "custname": "NT Hoàng Sơn - Trần Trung Thảo - Đức Linh - Bình Thuận",
      "lat": "10.780222",
      "lng": "106.6645009",
      "stt": "2"
    }, {
      "custid": "002285",
      "custname": "NT Hoàng Sơn - Nguyễn Quốc Đạt - Phan Thiết - Bình Thuận",
      "lat": "10.7517826",
      "lng": "106.6564651",
      "stt": "3"
    }]
  )

  const MyLocation = () => {
    const map = useMapEvents({
      click: () => {
        map.locate({'enableHighAccuracy':true})
      },
      locationfound: (location) => {
        console.log('location found:', location,  [location.latlng.lat, location.latlng.lng])
        setSelectedPosition([
          location.latlng.lat,
          location.latlng.lng
      ]);
  
      },
    })
    return (
      selectedPosition ?
      <CircleMarker center={selectedPosition} pathOptions={fillBlueOptions} radius={20} />
      : null
  )   
  }

  const MarkerLayer2 = ({arr_visit}) => {
    return arr_visit.map( (el, index) => {
    const { custid, custname } = el;
  
    console.log(el);
  
    return (
      <Marker key={index} position={ [el.lat , el.lng ] } icon={customMarkerIconRed}> 
      <Popup>{custname + custid}</Popup>
      </Marker>
    )
  }
  )
  }

  const Markers = arr_visit.map(  (el, index) =>
        el.custid == '002285' ?
        (
          <Marker key={index} position={ [el.lat , el.lng ] } icon={ divIcon({html: renderToStaticMarkup(<Badge bg="info">{el.stt}</Badge> ), iconSize: [0, 0],iconAnchor: [17, 16]}) }> 
          <Popup>{el.custname + " " + el.custid}</Popup>
          </Marker>
        )
        : 
        el.custid == 'N06202110' ?
          (
            <Marker key={index} position={ [el.lat , el.lng ] } icon={ divIcon({html: renderToStaticMarkup(<h6><Badge bg="danger">{el.stt}</Badge> </h6>), iconSize: [0, 0],iconAnchor: [17, 16]}) }> 
            <Popup>{el.custname + " " + el.custid}</Popup>
            </Marker>
          )
          :
          (
            <Marker key={index} position={ [el.lat , el.lng ] } icon={ divIcon({html: renderToStaticMarkup(<Badge bg="warning">{el.stt}</Badge> ), iconSize: [0, 0],iconAnchor: [17, 16]}) }> 
            <Popup>{el.custname + " " + el.custid}</Popup>
            </Marker>
          )
        )

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
        console.log([latitude, longitude])

    });
}, []);

  const position = [51.505, -0.09]

  return (
    <>
    
    <MapContainer center={[10.7802148, 106.6663546]} zoom={15} scrollWheelZoom={true} >
      {/* <MyLocation></MyLocation> */}
      
      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHV5dnEiLCJhIjoiY2xqaGJ5anJtMGg1bTNtbzJxNHl1bmtzNCJ9.EMV1gOcu5ild0gIepl9vdQ"
      />
      {/* <Marker position={position} icon={icon1}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}
      <Marker position={initialPosition} icon={customMarkerIconGreen} />

      {/* <CircleMarker center={selectedPosition} pathOptions={fillBlueOptions} radius={20} /> */}

      {Markers}
      {/* <MarkerLayer data={cities}></MarkerLayer> */}
    {/* <Polyline pathOptions={limeOptions} positions={polyline} /> */}
    </MapContainer>
    </>

  
  )

}

export default MapBox

// https://www.youtube.com/watch?v=0IPbKyLVDh4


  // const Map = ReactMapboxGl({
  //   accessToken: "pk.eyJ1IjoiZHV5dnEiLCJhIjoiY2xqaGJ5anJtMGg1bTNtbzJxNHl1bmtzNCJ9.EMV1gOcu5ild0gIepl9vdQ"
  // });


  //https://codesandbox.io/s/react-leaflet-icon-material-mx1iu?file=/src/index.js

  //https://stackoverflow.com/questions/64937948/adding-onclick-function-to-a-mapcontainer-from-react-leaflet-in-typescript-f

  // https://www.geeksforgeeks.org/how-to-get-circular-buttons-in-bootstrap-4/