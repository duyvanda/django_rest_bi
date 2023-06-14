import React from 'react'
import { useContext, useEffect, useState } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import {Button, Dropdown, DropdownButton, Form} from 'react-bootstrap';

function Maps() {

  const { map, fetchMap } = useContext(FeedbackContext)

  const [tinh, setTinh] = useState('')
  const [fromDate, SetFromDate] = useState('')
  const [toDate, SetToDate] = useState('')


  const handleTextChange = (e) => {
    setTinh(e.target.value.toUpperCase())
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
      fromDate,
      toDate
      }
    fetchMap(mapdata);
    console.log(mapdata)
    setTinh(''); 
    SetFromDate('');
    SetToDate('');
}


  return (
    <div>
    <Form className='d-flex ml-5 mt-2' onSubmit={handleSubmit}>

      <Form.Group>
        {/* <Form.Label>Tinh</Form.Label> */}
        <Form.Control type="text" value={tinh} onChange={handleTextChange} placeholder='Tinh'></Form.Control>
      </Form.Group>

      <Form.Group>
        {/* <Form.Label>FromDate</Form.Label> */}
        <Form.Control type="text" value={fromDate} onChange={handleFromDateChange} placeholder='FromDate: 01-06-2023'></Form.Control>
      </Form.Group>

      <Form.Group>
        {/* <Form.Label>ToDate</Form.Label> */}
        <Form.Control type="text" value={toDate} onChange={handleToDateChange} placeholder='ToDate: 30-06-2023'></Form.Control>
      </Form.Group>

      <Button className="ml-2 border-0"  type="submit" style={{backgroundColor:"#00A79D"}}>Submit</Button>
    </Form>

    <iframe className="mt-2" src={map}  style={{ border: 1, height: "100vh", frameBorder:"0", width: "100vw"  }} allowFullScreen></iframe>
    </div>
  )
}
export default Maps
