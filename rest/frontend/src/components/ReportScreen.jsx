import { Container, Row, Col, Dropdown, DropdownButton, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect, useState } from 'react'


function ReportScreen({match, history}) {
    const { userInfo } = useContext(FeedbackContext)    

    useEffect(() => {
        // fetchFeedback()
        
		if (localStorage.getItem("manv")) {
			void(0)
            // console.log("IF CO MA NV ", manv)
		} else {
            // void(0)
            history.push('/');
            // console.log("ELSE KHONG CO MA NV ", manv)
        }

	}, []);

    let params = {
        "manv": `${userInfo.manv}`
      };
    let paramsAsString = JSON.stringify(params);
    let encodedParams = encodeURIComponent(paramsAsString)

    return (
        // <div class='container'></div>
        <Container className="fluid">
            <Link to="/" className="btn btn-primary my-1">
				Go Back
			</Link>
        <Card style={{backgroundColor : "#f0ebf8", border: 0}}>
            <div align="center">
            <iframe width="600px" className="vh-100" src={`https://datastudio.google.com/embed/reporting/${match.params.id}/?params=${encodedParams}`}  style={{ border: 1 }} allowFullScreen></iframe>
            </div>
        </Card>
        </Container>
    )
  }
  
  export default ReportScreen
//* 
//<iframe width="600" height="600" src={`https://datastudio.google.com/embed/reporting/${match.params.id}`}  style={{ border: 0 }}></iframe>
//{/* page/2SX2C/ <p>{`https://datastudio.google.com/embed/reporting/${match.params.id}/page/2SX2C/?params=%7B%22df3%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${manv.text}%22%7D`}</p> */}
