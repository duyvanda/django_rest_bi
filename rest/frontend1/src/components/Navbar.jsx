import React from 'react'
import { Link  } from 'react-router-dom'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'
import {Navbar, Container,
    NavDropdown, 
    // Button, Row, Dropdown, 
    // DropdownButton, Nav
} from 'react-bootstrap';
import { useHistory } from "react-router-dom";


function Navbar1() {
    const { userInfo, logoutUser, FilterReports, rpScreen } = useContext(FeedbackContext)

    const history = useHistory();

    const navigate = useHistory();

    // console.log("userinfo", userInfo) 

    const handleClick = () => {
        logoutUser();
        let path = `/login`;
        history.push(path);
        console.log("logout")
    }

    return (
        <div>
            <Navbar style={{maxHeight:""}} className="navbar navbar-dark navbar-expand-md bg-dark">
                <Container className='d-flex justify-content-start'>
                    {rpScreen ? <Link to="/" className="btn btn-warning btn-sm">BACK</Link> : <Link to="/" className="navbar-brand">BI PORTAL</Link>}

                                    {userInfo ?
                                            <NavDropdown title={userInfo.manv} className='text-white ml-2 '>
                                                <NavDropdown.Item  onClick={ () => navigate.push("/reports") }  >
                                                    <h5>REPORTS</h5>
                                                </NavDropdown.Item>
                                                <NavDropdown.Item className='fs-5' onClick={handleClick}><h5>LOGOUT</h5></NavDropdown.Item>
                                            </NavDropdown >
                                        :
                                                <NavDropdown.Item className='text-white mt-2' onClick={ () => navigate.push("/login") }  >
                                                    <h5>LOGIN</h5>
                                                </NavDropdown.Item>
                                    }

                    {FilterReports && <Navbar.Text className='text-white text-truncate ml-3 border-info border-bottom'> {FilterReports.tenreport} </Navbar.Text>}
                    
                </Container>
            </Navbar>
        </div>
    )
}

export default Navbar1
