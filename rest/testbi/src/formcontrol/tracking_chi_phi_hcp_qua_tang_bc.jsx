/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import { v4 as uuid } from 'uuid';
import './myvnp.css';
// import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Modal,
    // Card,
    // ListGroup,
    // FloatingLabel,
    // Stack,
    // Dropdown
} from "react-bootstrap";

function Tracking_chi_phi_hcp_qua_tang_bc({history, location}) {

    const navigate = useHistory();
    const location_search = new URLSearchParams(location.search)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'tracking_chi_phi_hcp_bc', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetchFilerReportsRT("27", true, true, "", {});
        } else {
            history.push('/login?redirect=/formcontrol/tracking_chi_phi_hcp_bc');
        };
    }, []);

    const { shared, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType, SetRpScreen, fetchFilerReportsRT, ReportId, ReportParam, vw } = useContext(FeedbackContext)

    const [manv, set_manv] = useState("");
    const f = new Intl.NumberFormat();
    // const [EDITMODE, SET_EDITMODE] = useState(false);

    if (true) {
        return (
        <Container className="bg-teal-100" fluid>

                    <div>
                        {/* ALERT COMPONENT */}
                    <Form>
                        {/* START FORM BODY */}

                        <Row className="justify-content-center">
                        <Col md={4} >

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{width: "60px"}} size="sm" variant="outline-success" key={0} onClick={ () => navigate.push("/crmhome") } >CRM</Button>
                        </ButtonGroup>

                        </Col>
                        </Row>
                        
                        <div>
                        <Modal show={loading===true | shared === false} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                        <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
                        </Modal>
                            { (loading===false && shared ===true ) &&
                            <div align="center" className="pr-1" >
                            <iframe 
                            title="myFrame" 
                            frameBorder="0"  
                            src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${ReportParam}`} 
                            style={{ height: "85vh", width: "100%", maxWidth: "100%" , borderRadius: "0.75rem"  }} 
                            >
                            
                            </iframe>
                            </div>
                            }
                        </div>
                                                
                    </Form>
                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}
                    </div>
        </Container>
        )
    }
    else {
        // return (
    
        //     <div>
        //         <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
        //         <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        //         </Spinner>
        //     </div>
            
        // )
    }
}


export default Tracking_chi_phi_hcp_qua_tang_bc