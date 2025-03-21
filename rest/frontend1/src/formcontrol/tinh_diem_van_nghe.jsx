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

function Tinh_diem_van_nghe({history}) {

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
        // set_lst_dd1(data_arr.data_hcp)
        // set_lst_dd2(data_arr.data_hoa_don)
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
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push('/login?redirect=/formcontrol/form_claim_chi_phi');
        };
    }, []);

    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [text1, set_text1] = useState("");
    const [number1, set_number1] = useState("");
    const [number2, set_number2] = useState("");
    const [onDate, setDate] = useState(current_date);

    const tick_chon = [
        { id: 1, value: "Tiết mục 1" },
        { id: 2, value: "Tiết mục 2" },
        { id: 3, value: "Tiết mục 3" }      
    ];


    const diem_chon = [
        { id: 1, value: "Điểm 8" },
        { id: 2, value: "Điểm 9" },
        { id: 3, value: "Điểm 10" }      
    ];



    // const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
    // const [lst_dd1, set_lst_dd1] = useState([])
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedValue, setSelectedValue] = useState("Bấm Để Chọn HCP");

    // const [lst_dd2, set_lst_dd2] = useState([])
    // const [searchTerm2, setSearchTerm2] = useState("");
    // const [selectedValue2, setSelectedValue2] = useState("Bấm Để Chọn Hóa Đơn");

    const [lst_dd3, set_lst_dd3] = useState([])
    const [searchTerm3, setSearchTerm3] = useState("");
    const [selectedValue2, setSelectedValue2] = useState("");
    const [selectedValue3, setSelectedValue3] = useState("");
  
    // const handleSelect = (value) => {
    //   setSelectedValue(value);
    // };

    const handleSelect3 = (value) => {
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

                        <div className="mt-2" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", backgroundColor: "#333", color: "white" }}>
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
                        </div>

                        <div className="mt-2" style={{ maxHeight: "200px", overflowY: "auto", border: "5px solid #333", padding: "10px", borderRadius: "10px", backgroundColor: "##00A79D", color: "black" }}>
                        {diem_chon.map((item) => (
                            <div key={item.id} style={{ padding: "5px 0" }}>
                            <Form.Check
                                type="radio"
                                name="diem_chon"
                                id={`option-${item.id}`}
                                label={item.value}
                                value={item.value}
                                checked={selectedValue2 === item.value}
                                onChange={(e) => setSelectedValue2(e.target.value)}
                            />
                            </div>
                        ))}
                        </div>


                                                
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

export default Tinh_diem_van_nghe