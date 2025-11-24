/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'

// import { useState } from "react";
// import { Form, Button } from "react-bootstrap";
import { BiStar, BiTrophy } from "react-icons/bi";
import { FaStar, FaFire } from "react-icons/fa";


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
    Card,
    Modal
} from "react-bootstrap";

function Tinh_diem_van_nghe({history}) {
    const location = useLocation();

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/get_tinh_diem_van_nghe/?manv=${manv}`)
        
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data_arr = await response.json()
        set_tick_chon(data_arr['tick_chon'])
        SetLoading(false)
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
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, [count]);

    const [manv, set_manv] = useState("");
    // const current_date = formatDate(Date());
    // const [text1, set_text1] = useState("");
    // const [number1, set_number1] = useState("");
    // const [number2, set_number2] = useState("");
    // const [onDate, setDate] = useState(current_date);
    // const [selectedValue2, setSelectedValue2] = useState(null);
    const [tick_chon, set_tick_chon] = useState([]);
    // const tick_chon = [
    //     { id: 1, value: "Tiết mục 1" },
    //     { id: 2, value: "Tiết mục 2" },
    //     { id: 3, value: "Tiết mục 3" }      
    // ];


    const diem_chon = [
        { id: 1, value: "6 điểm : Ổn", color: "#d1d1d1", icon: <BiStar /> },
        { id: 2, value: "7 điểm : Hay", color: "#a0e6a0", icon: <FaStar /> },
        { id: 3, value: "8 điểm : Khá Hay", color: "#6ad06a", icon: <FaStar style={{ color: "gold" }} /> },
        { id: 4, value: "9 điểm : Rất Hay", color: "#42c1f5", icon: <FaFire style={{ color: "red" }} /> },
        { id: 5, value: "10 điểm : Xuất Sắc", color: "#ffbf47", icon: <BiTrophy style={{ color: "gold" }} /> }
    ];



    // const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
    // const [lst_dd1, set_lst_dd1] = useState([])
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedValue, setSelectedValue] = useState("Bấm Để Chọn HCP");

    // const [lst_dd2, set_lst_dd2] = useState([])
    // const [searchTerm2, setSearchTerm2] = useState("");
    // const [selectedValue2, setSelectedValue2] = useState("Bấm Để Chọn Hóa Đơn");

    // const [lst_dd3, set_lst_dd3] = useState([])
    // const [searchTerm3, setSearchTerm3] = useState("");
    const [selectedValue2, setSelectedValue2] = useState("");
    const [selectedValue3, setSelectedValue3] = useState("");
  
    // const handleSelect = (value) => {
    //   setSelectedValue(value);
    // };

    // const handleSelect3 = (value) => {
    //     setSelectedValue2(value);
    //   };

    const clear_data = () => {
        setSelectedValue2("");
        setSelectedValue3("");
    }

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_tinh_diem_van_nghe/`, {
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
            clear_data();
            setCount(count+1);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();

        const data = {
            "manv":manv,
            "tiet_muc":selectedValue3,
            "diem_chon":selectedValue2,
        }
        console.log(data);
        // clear_data()
        post_form_data(data);
    }

    if (true) {
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

                        {/* <div className="mt-2" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", backgroundColor: "#333", color: "white" }}>
                        {tick_chon.map((item) => (
                            <div key={item.id} style={{ padding: "5px 0" }}>
                            <Form.Check
                                type="radio"
                                name="tick_chon"
                                id={`option-${item.id}`}
                                label={item.value}
                                value={item.value}
                                checked={selectedValue3 === item.value}
                                onChange={(e) => setSelectedValue3(e.target.value)}
                            />
                            </div>
                        ))}
                        </div> */}

                        <Form.Select required className="mt-2" style={{height:"60px", border: "1px solid #333"}} value={selectedValue3}  onChange={ e => setSelectedValue3(e.target.value) }>
                            <option value="">Chọn tiết mục</option>
                            {tick_chon
                            .map( (el, index) => 
                            <option value={el.value}>{el.value}</option>
                            )
                            }
                        </Form.Select>

                        <div className="mt-2" style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #333", padding: "10px", borderRadius: "10px", backgroundColor: "##00A79D", color: "black" }}>

                            {diem_chon.map((item) => (
                            <label 
                            key={item.id} 
                            style={{ 
                                display: "flex", alignItems: "center", gap: "12px",
                                padding: "10px", margin: "5px 0", borderRadius: "8px",
                                backgroundColor: selectedValue2 === item.value ? item.color : "#fff",
                                border: `2px solid ${item.color}`,
                                transition: "0.3s",
                                cursor: "pointer",
                                boxShadow: selectedValue2 === item.value ? "0px 0px 10px rgba(0,0,0,0.2)" : "none"
                            }}
                            >
                            <span style={{ fontSize: "22px", width: "25px", textAlign: "center", display: "flex", alignItems: "center" }}>
                                {item.icon}
                            </span>
                            <Form.Check
                                type="radio"
                                name="diem_chon"
                                id={`option-${item.id}`}
                                label={item.value}
                                value={item.value}
                                checked={selectedValue2 === item.value}
                                onChange={(e) => setSelectedValue2(e.target.value)}
                                style={{ display: "flex", alignItems: "center", flex: 1 }}
                            />
                            </label>
                            ))}

                        </div>


                                                
                        <Button disabled={!selectedValue2} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold", backgroundColor: selectedValue2 ? "#00A79D" : "#ccc", border: "None"}}> Gửi đánh giá </Button>
                        
                                    {/* Submit Button (Disabled if no point is selected) */}
                        {/* <Button 
                            type="submit" 
                            disabled={!selectedValue2} 
                            style={{
                                marginTop: "15px",
                                backgroundColor: selectedValue2 ? "#007bff" : "#ccc",
                                border: "none",
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: selectedValue2 ? "pointer" : "not-allowed",
                                width: "100%"
                            }}
                        >
                            Gửi Đánh Giá
                        </Button> */}

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
                        </Card> */}

                        
                    </div>
                </Col>
            </Row>
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

export default Tinh_diem_van_nghe