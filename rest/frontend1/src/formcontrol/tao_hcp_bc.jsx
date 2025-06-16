/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link } from "react-router-dom";
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

function Tao_hcp_bc({history, location}) {

    const navigate = useHistory();
    const location_search = new URLSearchParams(location.search)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Tao_hcp_bc', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);

        fetchFilerReportsRT("192", true, true, "sp_f_tao_hcp_bv", {});
        } else {
            history.push('/login?redirect=/formcontrol/tao_hcp_bc');
        };
    }, []);

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType, SetRpScreen, fetchFilerReportsRT, ReportId, ReportParam, vw } = useContext(FeedbackContext)

    const [manv, set_manv] = useState("");
    const f = new Intl.NumberFormat();
    const [EDITMODE, SET_EDITMODE] = useState(false);

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
                            <Button style={{fontWeight: "bold"}}  key={1} onClick={ () => {navigate.push("/formcontrol/tao_hcp_bv"); SET_EDITMODE(false); clear_data() } } className="bg-warning text-dark border-0" >Tạo Mới HCP BV</Button>
                            {/* <Button style={{width: "60px"}} key={2} onClick={ () => {navigate.push("/formcontrol/tao_hcp_bv?edit=1"); SET_EDITMODE(true); clear_data() } } className="ml-1 bg-warning text-dark border-0" >Sửa BV</Button> */}
                            <Button style={{fontWeight: "bold"}} key={3} onClick={ () => { navigate.push("/formcontrol/tao_hcp_pcl"); SET_EDITMODE(false); clear_data() } } className="ml-1 bg-primary border-0" >Tạo Mới HCP PCL</Button>
                            {/* <Button style={{width: "60px"}} key={4} onClick={ () => { navigate.push("/formcontrol/tao_hcp_pcl?edit=1") ; SET_EDITMODE(true) } } className="ml-1 bg-primary border-0" >Sửa PCL</Button> */}
                            <Button style={{width: "30px"}} key={5} onClick={ () => navigate.push("/formcontrol/tao_hcp_bc") } className="ml-1 bg-secondary border-0" >BC</Button>
                        </ButtonGroup>

                        </Col>
                        </Row>
                        
                        <div>
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                        <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
                        </Modal>
                            {!loading &&
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


export default Tao_hcp_bc