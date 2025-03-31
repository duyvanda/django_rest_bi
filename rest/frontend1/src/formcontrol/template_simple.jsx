/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link } from "react-router-dom";
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
    Card
} from "react-bootstrap";

function TemplateSimple({history}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/?manv=${manv}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        set_text(data.id)
        console.log(data)
        SetLoading(false)

        }
    } 
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push('/login');
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
        const response = await fetch(`https://bi.meraplion.com/local/insert_data/`, {
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
        } else {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-warning");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            clear_data()

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