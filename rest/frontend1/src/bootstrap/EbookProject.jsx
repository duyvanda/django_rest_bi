/* eslint-disable */
import React from 'react'
import { Link  } from 'react-router-dom'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'
import {Nav, Navbar, Container, NavDropdown, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function EbookProject() {
    const { userInfo, logoutUser, FilterReports, rpScreen } = useContext(FeedbackContext)
    const navigate = useNavigate();

    const handleClick = () => {
        logoutUser();
        let path = `/login`;
        navigate(path);
        console.log("logout")
    }

    return (
        <div>
            <Navbar collapseOnSelect fixed='top' expand="lg" className="navbar-dark bg-dark">
            <Container>
                <Navbar.Brand href="#home">
                <img
                src={logo}
                width="225"
                alt=""
                />
                </Navbar.Brand>
            </Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link className='fw-semibold' href="#home">Home</Nav.Link>
                <Nav.Link className='fw-semibold' href="#features">Features</Nav.Link>
                <Button className="fw-semibold px-4 mx-4" variant="outline-light">Light</Button>
                
            </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default EbookProject