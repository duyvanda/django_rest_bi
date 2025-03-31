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
    Card,
    Modal
} from "react-bootstrap";

function Form_claim_chi_phi({history}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=${manv}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        // const data = data_arr[0]
        set_lst_dd1(data_arr.data_hcp)
        set_lst_dd2(data_arr.data_hoa_don)
        set_lst_dd3(data_arr.tick_chon)
        // console.log(data)
        SetLoading(false)

        }
    } 
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Form_claim_chi_phi', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push('/login');
        };
    }, []);

    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [text1, set_text1] = useState("");
    const [number1, set_number1] = useState("");
    const [number2, set_number2] = useState("");
    const [onDate, setDate] = useState(current_date);



    // const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
    const [lst_dd1, set_lst_dd1] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("Bấm Để Chọn HCP");

    const [lst_dd2, set_lst_dd2] = useState([])
    const [searchTerm2, setSearchTerm2] = useState("");
    const [selectedValue2, setSelectedValue2] = useState("Bấm Để Chọn Hóa Đơn");

    const [lst_dd3, set_lst_dd3] = useState([])
    const [searchTerm3, setSearchTerm3] = useState("");
    const [selectedValue3, setSelectedValue3] = useState("");
  
    const handleSelect = (value) => {
      setSelectedValue(value);
    };

    const handleSelect2 = (value) => {
        setSelectedValue2(value);
      };

    const clear_data = () => {
        setSearchTerm("");
        setSearchTerm2("");
        setSelectedValue("Bấm Để Chọn HCP");
        setSelectedValue2("Bấm Để Chọn Hóa Đơn");
        set_number1("");
        set_number2("");
        set_text1("");
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
            // "text":text,
            // "number":number,
            // "date":onDate,
        }
        console.log(data);
        clear_data()
        // post_form_data(data);
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

                        <InputGroup className="mt-2 d-flex" style={{ height: "60px" }}>
                        {/* <InputGroup.Text className="w150px bg-secondary text-white">SELECT ONE</InputGroup.Text> */}
                        <Dropdown className="d-inline mx-2 w150px">
                            <Dropdown.Toggle className="text-dark bg-white flex-grow-1 border-0">
                            {selectedValue}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: "410px", overflowY: "auto" }}>
                            <Form.Control
                                className="mt-2"
                                type="text"
                                placeholder="Tìm Giá Trị"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {lst_dd1
                                .filter((el) => el.clean_ten_hcp.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((el, index) => (
                                <Dropdown.Item key={index} onClick={() => handleSelect(el.ten_hcp)}>
                                    {el.ten_hcp}
                                </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        </InputGroup>

                        <InputGroup className="mt-2 d-flex" style={{ height: "60px" }}>
                        {/* <InputGroup.Text className="w150px bg-secondary text-white">SELECT ONE</InputGroup.Text> */}
                        <Dropdown className="d-inline mx-2 w150px">
                            <Dropdown.Toggle className="text-dark bg-white flex-grow-1 border-0">
                            {selectedValue2}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ maxHeight: "410px", overflowY: "auto" }}>
                            <Form.Control
                                className="mt-2"
                                type="text"
                                placeholder="Tìm Giá Trị"
                                onChange={(e) => setSearchTerm2(e.target.value)}
                            />
                            {lst_dd2
                                .filter((el) => el.so_ngay_hoa_don.toLowerCase().includes(searchTerm2.toLowerCase()))
                                .map((el, index) => (
                                <Dropdown.Item key={index} onClick={() => handleSelect2(el.so_ngay_hoa_don)}>
                                    {el.so_ngay_hoa_don}
                                </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        </InputGroup>

                        {/* <InputGroup className="ml-1">
                            <Form.Control type="text" className="" placeholder="ĐCCN ĐẾN THÁNG"  />
                            <Form.Control type="text" className="" placeholder="MÃ KH" />
                        </InputGroup> */}
                            
                        {/* NUMBER */}
                        <FloatingLabel label="ĐỀ XUẤT KẾ HOẠCH" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_number1(e.target.value) } value = {number1} /> </FloatingLabel>
                        <FloatingLabel label="DUYỆT KẾ HOẠCH" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_number2(e.target.value) } value = {number2} /> </FloatingLabel>
                        
                        <Form.Select
                            required
                            className="mt-2"
                            style={{ height: "60px" }}
                            onChange={(e) => setSelectedValue3(e.target.value)}
                            >
                            <option value="">CHỌN NỘI DUNG</option>
                            {lst_dd3.map((item) => (
                                <option key={item.id} value={item.value}>
                                {item.value}
                                </option>
                            ))}
                        </Form.Select>
                        
                        <FloatingLabel label="GHI CHÚ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        
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
                        </Card> */}

                        
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

export default Form_claim_chi_phi