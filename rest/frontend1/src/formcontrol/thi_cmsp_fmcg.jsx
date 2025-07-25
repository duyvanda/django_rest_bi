/* eslint-disable */
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
    Form,
    Spinner,
    Card,
    Image,
    Modal
    // Dropdown,
    // InputGroup,
    // Stack,
    // FloatingLabel,
} from "react-bootstrap";

function Thi_cmsp_fmcg( {history} ) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const fetch_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/cmsp_quy_tp/?manv=${manv}&system=FMCG`)
        if (response.ok) {
            const data = await response.json()
            set_arr_detail(data['detail']);
            set_arr_input(data['header']) ;
            set_fst_cauhoi(data['header'][0].cauhoi) ;
            SetLoading(false);
            if (data['lst_manv_mt'].includes(manv)) {void(0)} else {history.push('/formcontrol/thi_cmsp_tp')};

        }
        else {
            SetLoading(false);
        }

    }
    
    const [count, setCount] = useState(0);
    const [seconds, set_seconds] = useState(2700);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'thi_cmsp_tp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        
        // if JSON.parse(localStorage.getItem("userInfo")).manv

        } else {
            history.push('/login?redirect=/formcontrol/thi_cmsp_fmcg');
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
    const [fst_cauhoi, set_fst_cauhoi] = useState([]);
    const [arr_manv_mt, set_arr_manv_mt] = useState([]);
    const [arr_indx, set_arr_indx] = useState([]);

    const handeClick = (e) => {
        let lst = [];
        let new_lst_indx = [];
        // let uniq_lst = [];

        for (const [index, element] of arr_detail.entries()) {

        let arr_id = e.target.id.split('@@');
        let select_cau_hoi = arr_id[0];
        let select_type = arr_id[1];
        let select_lua_chon = arr_id[2];
        let indx = arr_id[3];
        
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
            // new_lst_indx = [...arr_indx, indx]

            // set_arr_indx([...new Set(new_lst_indx)])

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
        
        let loc_cau_hoi = lst.filter(a => a.check === true);
        let lst_cau_hoi = loc_cau_hoi.map(a => a.cauhoi);
        set_arr_indx([...new Set(lst_cau_hoi)]); 
    }

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_cmsp_quy_tp/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        SetALert(true);
        SetALertType("alert-danger");
        SetALertText(errorData.error_message);
        setTimeout(() => {
            SetALert(false);
            SetLoading(false);
        }, 2000);
        } else {
        const successData = await response.json();
        console.log(successData);
        SetALert(true);
        SetALertType("alert-success");
        SetALertText(successData.success_message);
        setTimeout(() => {
            SetALert(false);
            SetLoading(false);
            history.push('/realtime/40?local_url=sp_f_data_cmsp_quy_tp');
            setCount(count+1);
            set_seconds(3600);
        }, 2000);
        }

    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "uuid":uuid(),
            "manv":manv,
            "countdown":seconds,
            "time_limit":2700,
            "answers": arr_detail,
            "system":"FMCG"
        }
        console.log(data);
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
                        <></>
                        <Image className="mt-2" src="https://storage.googleapis.com/django_media_biteam/images/cmsp_fmcg.jpg" fluid  />
                        <h6 className="text-center mt-2" id="focus1">FMCG - THI CMSP QUÝ - {seconds} s - ({Math.round(seconds/60) } p)</h6>
                        

                        <Form onSubmit={handle_submit}>

                        {/* START FORM BODY */}

                        {arr_input
                        .map( (el, index0) =>
                        <Card className="mt-2" key={index0}>
                        <Card.Title>{index0+1}{el.type === "M" && "-Chọn Nhiều"}-{el.cauhoi}</Card.Title>


                            {arr_detail
                            .filter( eli => eli.cauhoi.includes(el.cauhoi))
                            .map( (eli, index) =>
                                <Form.Check key={index} className="text-wrap" type="switch" checked={eli.check} onChange={ handeClick } id={eli.cauhoi+'@@'+eli.type+'@@'+eli.cacluachon+'@@'+index0} label={ eli.cacluachon }/>
                            // <option value={eli.cacluachon}> {eli.cacluachon} </option>
                            )
                            }


                        </Card>
                        )
                        }

                        {
                            arr_input.length > 1 ?
                            <>
                                <h3 style={{color:"red"}} className="mt-2 text-center">Bạn Đã Chọn:{`\xa0`}  
                                { arr_indx.length } / 20
                                </h3>
                                <Button disabled={arr_indx.length<=5} className='mt-5' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> NỘP BÀI VÀ XEM KẾT QUẢ </Button>
                            </>
                            :
                            <h4><Link style={{textDecoration:  ""}} target="_blank" key={3} className="mt-2 border-1 text-primary mx-2" to="/realtime/40?local_url=sp_f_data_cmsp_quy_tp" >XEM LẠI KẾT QUẢ</Link></h4>
                        }
                        </Form>
                        {/* END FORM BODY */}

                        
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

export default Thi_cmsp_fmcg
