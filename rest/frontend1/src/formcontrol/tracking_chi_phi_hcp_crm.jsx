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
    ListGroup
} from "react-bootstrap";

function Tracking_chi_phi_hcp_crm({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();

    const fetch_tracking_chi_phi_get_data_hcp = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/tracking_chi_phi_get_data_hcp_crm/?manv=${manv}`)
        
        if (response.ok) {
        SetLoading(false);
        const data = await response.json()
        set_arr_hcp(data['lst_hcp']);
        set_tong_hcp_da_dau_tu(data['tong_hcp_da_dau_tu']);
        set_tong_tien_ke_hoach_da_dau_tu(data['tong_tien_ke_hoach_da_dau_tu']);
        set_list_nv(data['list_nv']);
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
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'tracking_chi_phi_hcp_crm', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_tracking_chi_phi_get_data_hcp(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [arr_hcp, set_arr_hcp] = useState([]);
    const [tong_hcp_da_dau_tu, set_tong_hcp_da_dau_tu] = useState("");
    const [tong_tien_ke_hoach_da_dau_tu, set_tong_tien_ke_hoach_da_dau_tu] = useState("");
    const [list_nv, set_list_nv] = useState([]);
    const [select_nv, set_select_nv] = useState("");
    const [search, set_search] = useState('');
    const [sl_da_chon, set_sl_da_chon] = useState(0);

    const handeClick = (e) => {
        (e.target.checked) ? set_sl_da_chon(sl_da_chon+1) : set_sl_da_chon(sl_da_chon-1) 
        let lst = [];
        for (const [index, element] of arr_hcp.entries()) {
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
        const current_date = formatDate(Date());

        const ma_uuid = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_uuid.push(i.uuid)}
        }

        const data = {
            "uuid_nv":ma_uuid,
            "manv":manv,
            "current_date":current_date,
            "inserted":"inserted",
            "uuid":uuid(),
            "status":"C"
        }
        console.log(data);

        // neu khong chon ma cho nao thi ko lam gi
        if (ma_uuid.length >=1 ) {
            post_form_data(data);
        }
        else {
            void(0);
        }
    }


    const handle_reject = (e) => {
        // e.preventDefault();
        const current_date = formatDate(Date());

        const ma_uuid = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_uuid.push(i.uuid)}
        }

        const data = {
            "uuid_nv":ma_uuid,
            "manv":manv,
            "current_date":current_date,
            "inserted":"inserted",
            "uuid":uuid(),
            "status":"R"
        }
        console.log(data);

        // neu khong chon ma cho nao thi ko lam gi
        if (ma_uuid.length >=1 ) {
            post_form_data(data);
        }
        else {
            void(0);
        }

    }

    const post_form_data = async (data) => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_tracking_chi_phi_hcp_crm/`, {
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
            set_sl_da_chon(0);
            set_select_nv("");
            // window.location.reload();

        }
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

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hco_crm") } className="bg-warning text-dark border-0" >HCO</Button>
                            <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_crm") } >HCP</Button>
                            <Link style={{textDecoration:  "none"}} target="_blank" key={3} className="border-1 text-dark mx-2" to="/realtime/271?local_url=sp_f_data_tracking_chi_phi_hcp" >View Báo Cáo</Link>
                        </ButtonGroup>

                        <Card className="mt-2">
                            <Card.Body>
                            <Card.Title>HCP: TRACKING CHI PHÍ ĐẦU TƯ</Card.Title>
                                <Card.Text>
                                Tổng số HCP đã đầu tư: {tong_hcp_da_dau_tu} HCP
                                <br></br>
                                Tổng số tiền đã đầu tư: {f.format(tong_tien_ke_hoach_da_dau_tu)} VNĐ
                                <br></br>
                                Tổng số tiền thực tế đã đầu tư: 0 VNĐ
                                </Card.Text>
                                {/* <Button size="sm" variant="primary">Go somewhere</Button> */}
                            </Card.Body>
                        </Card>

                        <ListGroup className="mt-2" style={{maxHeight: "650px", overflowY: "auto"}}>

                        
                        <Form.Select className="mt-2" style={{}}  onChange={ e => set_select_nv(e.target.value) }>
                            <option value="">Chọn Nhân Viên</option>
                            {list_nv
                            .map( (el, index) => 
                            <option value={el.manv}> {el.manv + ' - ' + el.tencvbh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên" />


                        {arr_hcp
                            .filter( el => el.ma_crs.includes(select_nv))
                            .filter( el => el.clean_ten_hcp.toLowerCase().includes(search.toLowerCase()))
                            .map( (el, index) =>
                            <ListGroup.Item style={{maxHeight:"125px"}} className="border border-secondary mx-0 px-0" >
                                <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.uuid} label={ el.ten_hcp + ' - ' +  el.ten_kh_chung + ' - ' +  el.ma_kh_chung + ' - '+ el.phan_loai_hcp}/>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.ma_hcp_1 + ' - Quà Cảm Xúc: '+ el.chon_qua_tang_cam_xuc  + ' - ' + 'Quà 1/5: '+ el.chon_qua_tang_2 + ' - Quà Tặng: '+ el.chon_qua_tang + ' - Quà SN: '+ el.chon_qua_sn + ' - Hội Nghị: '+ el.chon_hoi_nghi + ' - '+  el.chon_qua_tang_hoi_nghi + '(' +  el.ma_crs  + ')'}  </p>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{'Tổng Tiền: '+ f.format (Number(el.tong_tien_kh)) }  </p>
                            </ListGroup.Item>
                            )
                        }

                        </ListGroup>                        

                        
                        {/* TEXT */}
                        {/* <FloatingLabel label="CHI PHÍ GIAO TIẾP" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        <FloatingLabel label="HỘI NGHỊ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text2(e.target.value) } value = {text2}/> </FloatingLabel> */}
                        
                        {/* <Button disabled={false} className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button> */}
                        
                        <h4 style={{color:"red"}} className="mt-2">Bạn Đã Chọn:{`\xa0`} {sl_da_chon} </h4>

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button disabled={false} className='mt-2' variant="success" type="submit" style={{width: "100%", fontWeight: "bold"}}> DUYỆT </Button>
                            <Button disabled={false} onClick={ handle_reject } className='mt-2' variant="danger" style={{width: "100%", fontWeight: "bold"}}> TỪ CHỐI </Button>
                        </ButtonGroup>
                        
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
        return (
    
            <div>
                <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner>
            </div>
            
        )
    }

}

export default Tracking_chi_phi_hcp_crm