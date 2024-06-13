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

function Thi_cmsp({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const fetch_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/cmsp_quy_tp/`)
        if (response.ok) {
            SetLoading(false)
            const data = await response.json()
            set_arr_detail(data['detail'])
            set_arr_input(data['header']) 
        }
        else {
            SetLoading(false)
        }

    }
    
    const [count, setCount] = useState(0);
    const [seconds, set_seconds] = useState(3600);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'thi_cmsp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login?redirect=/formcontrol/thi_cmsp');
        };

    }, [count]);

    useEffect(() => {

        if (seconds > 0) {
            setTimeout(() => set_seconds(seconds - 1), 1000);
        } else {
        set_seconds(0);
        }

    }, [seconds]);

    
    const [manv, set_manv] = useState("");
    const [arr_detail, set_arr_detail] = useState([]);
    const [arr_input, set_arr_input] = useState([]);

    const handeClick = (e) => {
        let lst = [];
        for (const [index, element] of arr_detail.entries()) {

        let arr_id = e.target.id.split('@@');
        let select_cau_hoi = arr_id[0];
        let select_type = arr_id[1];
        let select_lua_chon = arr_id[2];
        
        if (select_type === 'S') {
        
            if(element.cacluachon === select_lua_chon & element.cauhoi === select_cau_hoi) {
                element.check = e.target.checked
                lst.push(element);
            }

            else if (element.cacluachon !== select_lua_chon & element.cauhoi === select_cau_hoi){
                element.check = false
                lst.push(element);
            } 
            else {
                lst.push(element);
            }

            set_arr_detail(lst);

        }
    else {
        if(element.cacluachon === select_lua_chon & element.cauhoi === select_cau_hoi) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            lst.push(element);
        }
        set_arr_detail(lst);
    }
    }
    }


    const post_form_data = async (data) => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_cmsp_quy_tp/`, {
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
            // SetLoading(false);
            const data = await response.json();
            console.log(data);
            history.push('/realtime/401?local_url=sp_f_data_cmsp_quy_tp');
            // SetALert(true);
            // SetALertType("alert-success");
            // SetALertText("ĐÃ TẠO THÀNH CÔNG");
            // document.getElementById("focus1").focus();
            // setTimeout(() => SetALert(false), 3000
            // );
            
            // setCount(count+1);
            
            // set_seconds(3600);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "uuid":uuid(),
            "manv":manv,
            "countdown":seconds,
            "time_limit":3600,
            "answers": arr_detail,
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
                        <div  className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        <></>
                        <h4 className="text-center" id="focus1">TP - THI SMSP QUÝ 02/2024 - {seconds} giây - ({Math.round(seconds/60) } Phút) 

                        {/* <h4><Link style={{textDecoration:  ""}} target="_blank" key={3} className="border-1 text-primary mx-2" to="/realtime/401?local_url=sp_f_data_cmsp_quy_tp" >View KQ</Link></h4> */}
                        </h4>
                        

                        <Form onSubmit={handle_submit}>

                        {/* START FORM BODY */}

                        {arr_input
                        .map( (el, index) =>
                        <Card className="mt-2" key={index}>
                        <Card.Title>{index+1}-{el.cauhoi}</Card.Title>


                            {arr_detail
                            .filter( eli => eli.cauhoi.includes(el.cauhoi))
                            .map( (eli, index) =>
                                <Form.Check key={index} className="text-wrap" type="switch" checked={eli.check} onChange={ handeClick } id={eli.cauhoi+'@@'+eli.type+'@@'+eli.cacluachon} label={ eli.cacluachon }/>
                            // <option value={eli.cacluachon}> {eli.cacluachon} </option>
                            )
                            }


                        </Card>
                        )
                        }

                        <Button disabled={false} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> NỘP BÀI VÀ XEM KẾT QUẢ </Button>

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

export default Thi_cmsp
