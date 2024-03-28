import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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

function Wps_dang_ky_vpp({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const fetch_wps_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/wps_data_vpp/?manv=${manv}`)
        if (response.ok) {
            SetLoading(false)
            const data = await response.json()
            set_arr_vpp(data['lst_vpp'])
            set_arr_input(data['lst_input']) 
        }
        else {
            SetLoading(false)
        }

    }
    
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'wps_dang_ky_vpp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_wps_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, [count]);

    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());    
    const [arr_vpp, set_arr_vpp] = useState([]);
    const [vpp, set_vpp] = useState("");
    const [arr_input, set_arr_input] = useState([]);
    const [so_luong, set_so_luong] = useState("");
    const [onDate, setDate] = useState(current_date);
    



    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_wps_data_vpp/`, {
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
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            setCount(count+1)

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "uuid":uuid(),
            "manv":manv,
            "vpp":vpp,
            "so_luong":so_luong,
            "date":onDate,
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
                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }

                        <h1>Đăng ký VPP (WPS)</h1>

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_vpp(e.target.value) }>
                            <option value="">Chọn VPP</option>
                            {arr_vpp
                            .map( (el, index) =>
                            <option key={index} value={el.tenvpp_clean}>{el.tenvpp + '  ' + '(' + el.dvt + ')' }</option>
                            )
                            }
                        </Form.Select>
                        
                        {/* so_luong */}
                        <FloatingLabel label="Số Lượng" className="border rounded mt-2" > <Form.Control required type="so_luong" className="" placeholder="" onChange={ (e) => set_so_luong(e.target.value) } value = {so_luong} /> </FloatingLabel>
                        


                        <Button disabled={false} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        <div className='mt-2'>
                        <h3>Đã nhập</h3>
                        {arr_input
                            .map( (el, index) =>
                            <h6 className="text-dark" >{el.vpp + '  ' + '(' + el.so_luong + ')' }</h6>
                            )
                        }
                        </div>

                        {/* <Button target="_blank"  key={1} onClick={ () => navigate.push("/realtime/1001?local_url=sp_dang_ky_vpp") } className="mt-2 bg-secondary text-white border-0" >Xem lại báo cáo</Button> */}

                        </Form>
                        {/* END FORM BODY */}


                        
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

export default Wps_dang_ky_vpp