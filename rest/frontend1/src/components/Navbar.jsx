import React from 'react'
import { Link, NavLink  } from 'react-router-dom'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'
import {Nav, Navbar, Container, Button, Row, Dropdown, NavDropdown, DropdownButton} from 'react-bootstrap';


function Navbar1() {
    const { userInfo, logoutUser } = useContext(FeedbackContext)

    // console.log("userinfo", userInfo) 

    const handleClick = () => {
        logoutUser()}

    return (
        <div>
            <Navbar className="navbar navbar-dark navbar-expand-md bg-dark">
                <Container> <Link to="/" className="navbar-brand">BI PORTAL</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto"> 
                            {userInfo ?
                                    <NavDropdown title={userInfo.manv}>
                                            <NavDropdown.Item><Link to="/profile">Đổi Mật Khẩu</Link></NavDropdown.Item>
                                            <NavDropdown.Item><Link to="/reports">Reports</Link></NavDropdown.Item>
                                            <NavDropdown.Item onClick={handleClick}>Logout</NavDropdown.Item>
                                    </NavDropdown >
                                :
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                            }
                </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
  )
}

export default Navbar1