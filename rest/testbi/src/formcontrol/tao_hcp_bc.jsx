/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Card,
    ListGroup,
    Modal,
    FloatingLabel,
    Stack,
    Dropdown    
} from "react-bootstrap";

function Tao_hcp_bc() {

    const navigate = useNavigate();
    const location = useLocation();
    const location_search = new URLSearchParams(location.search)

    
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Tao_hcp_bc', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);

        if (loading===false){
            fetchFilerReportsRT("192", isMB, {});
        }
		else {
            navigate('/login?redirect=/formcontrol/tao_hcp_bc');
        };

        } 

    }, []);

    const {userInfo, userLogger, SetRpScreen, fetchFilerReportsRT, shared, loading, ReportId, ReportParam, vw } = useContext(FeedbackContext)

    const [manv, set_manv] = useState("");
    // const f = new Intl.NumberFormat();
    // const [EDITMODE, SET_EDITMODE] = useState(false);

    // if (true) {
        return (
        <Container className="bg-teal-100" fluid>

                    <div>
                        {/* ALERT COMPONENT */}
                        <Form>
                        {/* START FORM BODY */}

                        <Row className="justify-content-center">
                        <Col md={4} >

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{width: "60px"}} variant="outline-success" key={0} onClick={ () => navigate("/crmhome") } >CRM</Button>
                            <Button style={{width: "30px"}} key={5} onClick={ () => navigate("/formcontrol/tao_hcp_bc") } className="ml-1 bg-secondary border-0" >BC</Button>
                        </ButtonGroup>

                        </Col>
                        </Row>
                        
                        <div>
                            <Modal show={loading===true || shared === false} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
                            </Modal>
                            { (loading===false && shared ===true ) &&
                            <div align="center" className="border-1 bg-dark" >
                            <iframe title="myFrame" frameBorder="0"  src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
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


export default Tao_hcp_bc