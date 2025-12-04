/* eslint-disable */
import { useContext, useEffect, useState } from "react";
// import { v4 as uuid } from 'uuid';
// import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    Col,
    Row,
    Container,
    Dropdown,
    Form,
    Spinner,
    InputGroup,
    Stack,
    FloatingLabel,
    Table,
    Card,
    Modal

} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

function TemplateSimple() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/?manv=${queryParams.get('manv')}`)
        // const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=MR0673`)
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        // set_data_kh_chung(data['data_kh_chung'])
        // set_data_hcp(data['data_hcp'])
        // set_manv_info(data['manv_info'][0])
        console.log(data);
        SetLoading(false);

        }
    }

    
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            navigate(`/login?redirect=${location.pathname}`);
        };
    }, []);

    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [text, set_text] = useState("");
    const [number, set_number] = useState("");
    const [onDate, setDate] = useState(current_date);

    const clear_data = () => {
    }

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetALert(false), 3000);
        } else {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            clear_data();
            setCount(count+1);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();

        const data = {

        }
        console.log(data);
        post_form_data(data);
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>

                        {/* ALERT COMPONENT */}
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        </Modal>

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}
                        
                        {/* TEXT */}
                        <FloatingLabel label="TEXT" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text(e.target.value) } value = {text}/> </FloatingLabel>
                        
                        {/* NUMBER */}
                        <FloatingLabel label="NUMBER" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_number(e.target.value) } value = {number} /> </FloatingLabel>
                        
                        {/* DATE */}
                        <FloatingLabel label="DATE" className="border rounded mt-2" > <Form.Control required type="date" className="" placeholder="" onChange={(e) => setDate(e.target.value)} value={onDate} /> </FloatingLabel>
                        
                        <Button disabled={false} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        </Form>
                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}

                        {/* <Card>
                            <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                                </Card.Text>
                                <Button size="sm" variant="primary">Go somewhere</Button>
                            </Card.Body>
                        </Card>

                        <InputGroup className="ml-1">
                            <Form.Control type="text" className="" placeholder="ĐCCN ĐẾN THÁNG"  />
                            <Form.Control type="text" className="" placeholder="MÃ KH" />
                        </InputGroup> */}

                        
                    </div>
                </Col>
            </Row>
        </Container>
        )
    }
    else {
        return (
    
            <div>
                <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner>
            </div>
            
        )
    }

}

export default TemplateSimple