/* eslint-disable */
import React from 'react'
import {Form} from 'react-bootstrap'
import {useState, useEffect} from 'react'

function TestScreenSize() {
    const [w, setW] = useState('')
    const [source, setSource] = useState('')
    const [MB, setIsDS] = useState(false)

    useEffect(() => {
    const media = window.matchMedia('(max-width: 960px)');
    const isMB = (media.matches)
    setIsDS(isMB)
	}, []);
    
    console.log("mobile? ", MB)
    const handleWChange = (e) => {
    MB ? setW("90vw") : 
    setW(e.target.value)
    }

  return (
    <div>
        <div className='container'>
            <Form>
                <Form.Label>width</Form.Label>
                <Form.Control type="text" placeholder='input width' value={w} onChange={ handleWChange }></Form.Control>
                <Form.Label>source</Form.Label>
                <Form.Control type="text" placeholder='input source' value={source} onChange={ e => setSource(e.target.value) }></Form.Control>
            </Form>
        </div>
        <div align="center" className="mt-1">
            <iframe src={source}  style={{ border: 0, height: "83vh", frameBorder:"0", width: w  }} allowFullScreen></iframe>
        </div>
    </div>
  )
}

export default TestScreenSize