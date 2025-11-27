/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { v4 as uuid } from 'uuid';
// import './myvnp.css';
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
    Nav,
    ListGroup,
    Modal,
    Alert
} from "react-bootstrap";

function Tracking_chi_phi_hcp_qua_tang_crm() {

    const { Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useNavigate();

    const [count, setCount] = useState(0);
    const f = new Intl.NumberFormat();
    const [manv, set_manv] = useState("");
    const [arr_hcp, set_arr_hcp] = useState([]);
    const [list_nv, set_list_nv] = useState([]);
    const [select_nv, set_select_nv] = useState("");
    const [search, set_search] = useState('');
    const [sl_da_chon, set_sl_da_chon] = useState(0);

    const fetch_tracking_chi_phi_get_data_hcp = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_planning_collect_hcp_qua_tang_crm/?manv=${manv}`)
        
        if (response.ok) {
        SetLoading(false);
        const data = await response.json()
        set_arr_hcp(data['lst_chon_qua_cua_nv']);
        set_sl_da_chon(data['lst_chon_qua_cua_nv'].length)
        set_list_nv(data['list_nv']);
        }
        else {
            SetLoading(false)
        }

    }

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'tracking_chi_phi_hcp_crm', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_tracking_chi_phi_get_data_hcp(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            navigate('/login');
        };
    }, [count]);

    // Recalculate sl_da_chon whenever arr_hcp or select_nv changes
    useEffect(() => {
        const filtered_arr_hcp = arr_hcp.filter(el => el.ma_crs.includes(select_nv));
        const checked_count = filtered_arr_hcp.filter(el => el.check).length;
        set_sl_da_chon(checked_count);
    }, [arr_hcp, select_nv]);

    const handeClick = (e) => {
        // (e.target.checked) ? set_sl_da_chon(sl_da_chon+1) : set_sl_da_chon(sl_da_chon-1) 
        let lst = [];
        for (const element of arr_hcp) {
        if(element.uuid === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            // element.check = false
            lst.push(element);
        }
        }
        set_arr_hcp(lst)
    }
    

    const handle_submit = (e) => {
        e.preventDefault();
        const ma_uuid = []
        const filtered_arr_hcp = arr_hcp.filter(el => el.ma_crs.includes(select_nv));
        for (let i of filtered_arr_hcp) {
            if (i.check === true) {ma_uuid.push(i.uuid)}
        }
        const data = {
            "uuid_nv":ma_uuid,
            "manv":manv,
            "status":"C",
            "inserted": Inserted_at(),
        }
        console.log(data);
        // neu khong chon ma cho nao thi ko lam gi
        if (ma_uuid.length >=1 ) {
            post_form_data( [data] );
        }
        else {
            void(0);
        }
    }


    const handle_reject = (e) => {
        e.preventDefault();
        // const current_date = formatDate(Date());
        const ma_uuid = []
        const filtered_arr_hcp = arr_hcp.filter(el => el.ma_crs.includes(select_nv));
        for (let i of filtered_arr_hcp) {
            if (i.check === true) {ma_uuid.push(i.uuid)}
        }
        const data = {
            "uuid_nv":ma_uuid,
            "manv":manv,
            "status":"R",
            "inserted": Inserted_at(),
        }
        console.log(data);
        // neu khong chon ma cho nao thi ko lam gi
        if (ma_uuid.length >=1 ) {
            post_form_data( [data] );
        }
        else {
            void(0);
        }

    }

    const post_form_data = async (data) => {
        // return;
        // SetLoading(true)
        console.log("post_form_data", data)
        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_planning_collect_hcp_qua_tang_crm/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // SetLoading(false);
            const data = await response.json();
            console.log(data);
        } else {
            // SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            setCount(count+1);
            // set_sl_da_chon(0);
            set_select_nv("");
            // window.location.reload();

        }
    }

    const navs = [
    { label: "<=", path: "/crmhome", color: "text-success" },
    { label: "ĐỀ XUẤT", path: "/formcontrol/tracking_chi_phi_hcp_qua_tang" },
    { label: "QL DUYỆT", path: "/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" },
    { label: "BC", path: "/realtime/99", color: "text-info", isExternal: true }
    ];

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
                        {/* END ALERT COMPONENT */}

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                            <Nav variant="pills" activeKey={location.pathname} className="mt-2 bg-light p-2 rounded gap-2 fw-bold" fill>
                                {navs.map(({ label, path, color, isLink }) => {
                                    const isActive = location.pathname === path; // Check if this tab is active
                                    return (
                                        <Nav.Item key={path} className="flex-fill">
                                            <Nav.Link 
                                                eventKey={path}
                                                // FIX: Only use bg-white and custom colors if NOT active. 
                                                // If active, let Bootstrap default (Blue bg + White text) take over.
                                                className={`shadow-sm border ${isActive ? "bg-merap-active" : `bg-white ${color || ""}`}`}
                                                onClick={!isLink ? () => navigate(path) : undefined}
                                                href={isLink ? path : undefined}
                                                target={isLink ? "_blank" : undefined}
                                            >
                                                {label}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        
                        <div className="bg-white border rounded shadow-sm p-3 mt-2">

                        <ListGroup className="mt-2" style={{maxHeight: "650px", overflowY: "auto"}}>

                        
                        <Form.Select className="mb-2" style={{}}  onChange={ e => set_select_nv(e.target.value) }>
                            <option value="">Chọn Nhân Viên</option>
                            {list_nv
                            .map( (el) => 
                            <option key={el.manv} value={el.manv}> {el.manv + ' - ' + el.tencvbh} </option>
                            )
                            }
                        </Form.Select>
                        

                        {/* <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên" /> */}
                        <Form.Control className="mb-2" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="🔍 Tìm mã hoặc tên (KHÔNG DẤU)" value={search} />


                        {arr_hcp
                            .filter( el => el.ma_crs.includes(select_nv))
                            .filter( el => el.clean_ten_hcp.toLowerCase().includes(search.toLowerCase()))
                            .map( (el) =>
                            <ListGroup.Item key={el.uuid} style={{maxHeight:"125px"}} className="p-1 bg-white border rounded" >
                                <Form.Check className="text-wrap" type="switch" checked={el.check} onChange={ handeClick } id={el.uuid} label={ el.ten_hien_thi } />
                            </ListGroup.Item>
                            )
                        }

                        </ListGroup>
                        </div>                       

                        
                        {/* TEXT */}
                        {/* <FloatingLabel label="CHI PHÍ GIAO TIẾP" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        <FloatingLabel label="HỘI NGHỊ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text2(e.target.value) } value = {text2}/> </FloatingLabel> */}
                        
                        {/* <Button disabled={false} className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button> */}
                        
                        {/* <h4 style={{color:"red"}} className="mt-2">Bạn Đã Chọn:{`\xa0`} {sl_da_chon} </h4> */}

                        {sl_da_chon > 0 && (
                            <Alert variant="info" className="mt-3 mb-0 py-2 shadow-sm border-0">
                                <strong>✓ Đã chọn:</strong> {sl_da_chon} lượt
                            </Alert>
                        )}

                        <div className="bg-white border rounded shadow-sm p-2 mt-2">
                            <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="lg" className="mt-2 border-0">
                                <Button disabled={false} type="submit"              className='flex-fill' variant="success"  style={{width: "100%", fontWeight: "bold"}}> ✅ DUYỆT </Button>
                                <Button disabled={false} onClick={ handle_reject }  className='flex-fill' variant="danger" style={{width: "100%", fontWeight: "bold"}}> ❌ TỪ CHỐI </Button>
                            </ButtonGroup>
                        </div>
                        
                        </Form>
                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}


                        
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

export default Tracking_chi_phi_hcp_qua_tang_crm