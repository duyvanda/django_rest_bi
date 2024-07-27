/* eslint-disable */
import {Form, Button, Spinner, Badge, Image, Stack} from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FeedbackContext from '../context/FeedbackContext'
import { divIcon } from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet'
import L from "leaflet";
import { HiLocationMarker } from "react-icons/hi";

const iconMarkupGreen = renderToStaticMarkup(<HiLocationMarker size={50} color='green'/>);
const customMarkerIconGreen = divIcon({html: iconMarkupGreen,iconSize: [0, 0],iconAnchor: [17, 16]});

function SalesRoutes({history}) {
  const { fetchFilerReports, SetRpScreen, userLogger, loading, SetLoading, formatDate, Inserted_at, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
  const current_date = formatDate(Date())
  const [onDate, setDate] = useState(current_date);
  const [initialPosition, setInitialPosition] = useState([0,0]);
  const [manv, set_manv] = useState("");
  const [arr_visit, set_arr_visit] = useState([])

  const Markers = arr_visit.map(  (el, index) =>
        (
          <Marker key={index} position={ [el.lat , el.lng ] } icon={ divIcon({html: renderToStaticMarkup(<h6><Badge bg="danger">{el.stt}</Badge> </h6>), iconSize: [0, 0],iconAnchor: [17, 16]}) }> 
          <Popup>{el.custname + " " + el.custid}</Popup>
          </Marker>
        )
  )

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, '10', isMB, dv_width);
      SetRpScreen(true);
      fetchFilerReports("10", isMB);
      set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
        console.log("setInitialPosition", [latitude, longitude])
      });

    } else {
            history.push('/login');
        };
  }, []);


  const fetchRoutes = async (routesdata) => {
    SetLoading(true);
    const URL = 'https://bi.meraplion.com/local'
    const response = await fetch(`${URL}/salesroutes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routesdata),
    });

    if (response.ok) {
      SetLoading(false);
      const data = await response.json(); 
      set_arr_visit(data);
      console.log(data);
    } else {
        SetLoading(false);
    }
  };

  const handle_submit = (e) => {
    e.preventDefault();
    const routesdata = {
      manv: manv,
      ondate: onDate,
      base_location_lgn: initialPosition[1],
      base_location_lat: initialPosition[0]
    };
    fetchRoutes(routesdata);
    console.log(routesdata);
  }

  if (!loading) {

  return (
    <>
      <Form className='' onSubmit={ handle_submit }>
      <Stack direction="horizontal" gap={2} className="col-md-2">
        <Form.Control className="text-dark bg-warning border border-warning" type="date" value={onDate} htmlSize={8} onChange={(e) => setDate(e.target.value)} placeholder="DateRange"></Form.Control>  
        <Button className="ml-2 border-0"  type="submit" variant="warning">Submit</Button>
      </Stack>
      </Form>  
      <MapContainer center={[10.7802148, 106.6663546]} zoom={15} scrollWheelZoom={true} >      
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZHV5dnEiLCJhIjoiY2xqaGJ5anJtMGg1bTNtbzJxNHl1bmtzNCJ9.EMV1gOcu5ild0gIepl9vdQ"
        />
        
        
        <Marker position={initialPosition} icon={customMarkerIconGreen} />

        {/* {Markers} */}
      </MapContainer>
    </>
  )

  }

  else {
    return (

        <div>
          <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
          <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
          </Spinner>
        </div>
    )
  }

}

export default SalesRoutes