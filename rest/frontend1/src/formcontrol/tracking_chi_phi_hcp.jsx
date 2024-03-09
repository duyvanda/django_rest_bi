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
    Dropdown,
    Form,
    Spinner,
    InputGroup,
    Stack,
    FloatingLabel,
    Card,
    ListGroup
} from "react-bootstrap";

function Tracking_chi_phi_hcp({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();

    const fetch_tracking_chi_phi_get_data_hcp = async () => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/tracking_chi_phi_get_data_hcp/`)
        const data = await response.json()
        set_arr_hcp(data['lst_hcp'])
        set_tong_hcp_da_dau_tu(data['tong_hcp_da_dau_tu'])
        set_tong_tien_ke_hoach_da_dau_tu(data['tong_tien_ke_hoach_da_dau_tu'])
        SetLoading(false)
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_tracking_chi_phi_get_data_hcp();
        } else {
            history.push('/login');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [chon_qua_tang, set_chon_qua_tang] = useState("");
    const [chon_qua_sn, set_chon_qua_sn] = useState("");
    const [chon_hoi_nghi, set_chon_hoi_nghi] = useState("");
    const [chon_qua_tang_hoi_nghi, set_chon_qua_tang_hoi_nghi] = useState("");
    // const [text1, set_text1] = useState("");
    // const [text2, set_text2] = useState("");
    // const [text3, set_text3] = useState("");
    const [number1, set_number1] = useState("500000");
    const [number2, set_number2] = useState("0");
    // const [onDate, setDate] = useState(current_date);

    const [arr_hcp, set_arr_hcp] = useState([]);
    const [tong_hcp_da_dau_tu, set_tong_hcp_da_dau_tu] = useState("");
    const [tong_tien_ke_hoach_da_dau_tu, set_tong_tien_ke_hoach_da_dau_tu] = useState("");
    // const [arr_gift, set_arr_gift] = useState(['Quà Tặng 1','Quà Tặng 2','Quà Tặng 3']);
    // const [hcp, set_hcp]= useState("");
    const [search, set_search] = useState('');

    const handeClick = (e) => {
        let lst = [];
        for (const [index, element] of arr_hcp.entries()) {
        if(element.ma_hcp_2 === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            element.check = false
            lst.push(element);
        }
        }
        set_arr_hcp(lst)
    }
    


    // const fetch_id_data = async (select_id) => {
    //     SetLoading(true)
    //     const response = await fetch(`https://bi.meraplion.com/local/template/?id=${select_id}`)
        
    //     if (!response.ok) {
    //         SetLoading(false)
    //     }

    //     else {
    //     const data_arr = await response.json()
    //     const data = data_arr[0]
    //     set_text1(data.id)
    //     console.log(data)
    //     SetLoading(false)

    //     }
    // }

    const post_form_data = async (data) => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_tracking_chi_phi_hcp/`, {
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
            setCount(count+1)
            // window.location.reload();

        }
    }
    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const ma_hcp = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_hcp.push(i.ma_hcp_2)}
        }

        // set_number2(Number(number2)+1)

        const data = {
            "ma_hcp_2":ma_hcp[0],
            "manv":manv,
            "current_date":current_date,
            "chon_qua_tang":chon_qua_tang,
            "chon_qua_sn": chon_qua_sn,
            "chon_hoi_nghi": chon_hoi_nghi,
            "chon_qua_tang_hoi_nghi": chon_qua_tang_hoi_nghi,
            "inserted":"inserted",
            "uuid":uuid()
        }
        console.log(data);
        post_form_data(data);


        // set_gia_tri_smn("");

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
                            <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hco") } className="bg-warning text-dark border-0" >HCO</Button>
                            <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } >HCP</Button>
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

                        <ListGroup className="mt-2" style={{maxHeight: "400px", overflowY: "auto"}}>

                        <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên" />
                        {/* {arr_hcp
                            .map( (el, index) =>
                            <ListGroup.Item style={{maxHeight:"75px"}} className="border border-secondary mx-0 px-0" >
                                <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.contract_code} label={el.contract_name + ' - '+el.public_name}/>
                            <p className="ml-4"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.contract_code + ' - ' + 'Quà Tặng '+ el.merap_tt + ' - Chi Phí Giao Tiếp '+ el.sms + ' - Hội Nghị '+ el.smn}  </p>
                            </ListGroup.Item>
                            )
                        } */}

                        {arr_hcp
                            .filter( el => el.clean_ten_hcp.toLowerCase().includes(search))
                            .map( (el, index) =>
                            <ListGroup.Item style={{maxHeight:"125px"}} className="border border-secondary mx-0 px-0" >
                                <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.ma_hcp_2} label={ el.ten_hcp + ' - ' +  el.ten_kh_chung + ' - ' +  el.ma_kh_chung + ' - '+ el.phan_loai_hcp}/>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.ma_hcp_1  + ' - ' + 'Quà Tặng: '+ el.chon_qua_tang + ' - Quà SN: '+ el.chon_qua_sn + ' - Hội Nghị: '+ el.chon_hoi_nghi + ' - '+  el.chon_qua_tang_hoi_nghi }  </p>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{'Tổng Tiền: '+ f.format (Number(el.tong_tien_kh)) }  </p>
                            </ListGroup.Item>
                            )
                        }

                        </ListGroup>                        
                        
                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang(e.target.value)  }>                                 
                            <option value=''>Chọn Quà Tặng</option>
                            <option value='Yến'>Yến</option>
                            <option value='Nón protect'>Nón protect</option>
                            <option value='Sổ tay'>Sổ tay</option>
                        )
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_sn(e.target.value)  }>                                 
                            <option value=''>Chọn Quà Sinh Nhật</option>
                            <option value='Loại 1'>Loại 1</option>
                            <option value='Loại 2'>Loại 2</option>
                        )
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_hoi_nghi(e.target.value)  }>                                 
                            <option value=''>Chọn Hội Nghị</option>
                            <option value='Dược'>Dược</option>
                            <option value='TMH MN T3'>TMH MN T3</option>
                            <option value='TMH MB T5'>TMH MB T5</option>
                            <option value='TMH TQ T10'>TMH TQ T10</option>
                        )
                        </Form.Select>
                        
                        { chon_hoi_nghi &&

                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang_hoi_nghi(e.target.value)  }>                                 
                            <option value=''>Ưu Tiên</option>
                            <option value='Ưu Tiên 1'>Ưu Tiên 1</option>
                            <option value='Ưu Tiên 2'>Ưu Tiên 2</option>
                        )
                        </Form.Select>

                        }

                        
                        {/* TEXT */}
                        {/* <FloatingLabel label="CHI PHÍ GIAO TIẾP" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        <FloatingLabel label="HỘI NGHỊ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text2(e.target.value) } value = {text2}/> </FloatingLabel> */}
                        
                        <Button disabled={false} className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
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

export default Tracking_chi_phi_hcp