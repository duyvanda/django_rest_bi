import React from 'react'
import { useContext, useEffect, useState } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import {Button, Dropdown, DropdownButton, Form, Spinner} from 'react-bootstrap';

function Maps() {

  const { map, fetchMap, loading } = useContext(FeedbackContext)

  const [tinh, setTinh] = useState('Ha Nam,Ninh Binh,Nam Dinh')
  const [fromDate, SetFromDate] = useState('01-05-2023')
  const [toDate, SetToDate] = useState('31-05-2023')
  const [kenh, SetKenh] = useState('TP,INS,CLC,PCL,MT')


  const handleTextChange = (e) => {
    setTinh(e.target.value.toUpperCase())
  }

  const handleKenhChange = (e) => {
    SetKenh(e.target.value.toUpperCase())
  }

  const handleFromDateChange = (e) => {
    SetFromDate(e.target.value.toUpperCase())
  }

  const handleToDateChange = (e) => {
    SetToDate(e.target.value.toUpperCase())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mapdata = {
      tinh,
      kenh,
      fromDate,
      toDate
      }
    fetchMap(mapdata);
    console.log(mapdata)
    // setTinh(''); 
    // SetFromDate('');
    // SetToDate('');
}


  return (
    <div>
    <Form className='d-flex ml-5 mt-2' onSubmit={handleSubmit}>

      <Form.Group>
        <Form.Control type="text" disabled={true} as='input' htmlSize={25} className='text-truncate' value={tinh} onChange={handleTextChange} placeholder='Tinh,Tinh,Tinh'></Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Control type="text" disabled={false} as='input' htmlSize={14} className='text-truncate' value={kenh} onChange={handleKenhChange} placeholder='Kenh,Kenh,Kenh'></Form.Control>
      </Form.Group>

      <Form.Group>
        {/* <Form.Label>FromDate</Form.Label> */}
        <Form.Control type="text" value={fromDate} htmlSize={8} onChange={handleFromDateChange} placeholder='FromDate: 01-06-2023'></Form.Control>
      </Form.Group>

      <Form.Group>
        {/* <Form.Label>ToDate</Form.Label> */}
        <Form.Control type="text"  value={toDate} htmlSize={8} onChange={handleToDateChange} placeholder='ToDate: 30-06-2023'></Form.Control>
      </Form.Group>

      <Button className="ml-2 border-0"  type="submit" style={{backgroundColor:"#00A79D"}}>Submit</Button>
    </Form>
    {loading &&
                      <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                        <span className="sr-only">Loading...</span>
                      </Spinner>
    }

    <iframe className="mt-2" src={map}  style={{ border: 1, height: "100vh", frameBorder:"0", width: "100vw"  }} allowFullScreen></iframe>
    </div>
  )
}
export default Maps
