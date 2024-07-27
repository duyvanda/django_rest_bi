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

function Tracking_chi_phi_pcl({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();

    const fetch_tracking_chi_phi_get_data_hco = async () => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/tracking_chi_phi_get_data_pcl/`)
        const data = await response.json()
        set_arr_hcp(data['lst_hco']);
        set_tong_hco_da_dau_tu(data['tong_hco_da_dau_tu']);
        set_tong_tien_ke_hoach_da_dau_tu(data['tong_tien_ke_hoach_da_dau_tu']);
        SetLoading(false);
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_tracking_chi_phi_get_data_hco();
        } else {
            history.push('/login');
        };
    }, [count]);


    const f = new Intl.NumberFormat()
    const [counter, set_counter] = useState(1);
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [chon_khoa_phong_smn, set_chon_khoa_phong_smn] = useState("");
    const [chon_thang_smn, set_chon_thang_smn] = useState("");
    const [gia_tri_smn, set_gia_tri_smn] = useState("");
    const [chon_thang_sms, set_chon_thang_sms] = useState("");
    const [gia_tri_sms, set_gia_tri_sms] = useState("");
    const [chon_thang_ttk, set_chon_thang_ttk] = useState("");
    const [chon_loai_ttk, set_chon_loai_ttk] = useState("");
    const [gia_tri_ttk, set_gia_tri_ttk] = useState("");
    // const [number1, set_number1] = useState("500000");
    // const [number2, set_number2] = useState("0");
    const [onDate, setDate] = useState(current_date);

    const [arr_hcp, set_arr_hcp] = useState([]);
    const [tong_hco_da_dau_tu, set_tong_hco_da_dau_tu] = useState("");
    const [tong_tien_ke_hoach_da_dau_tu, set_tong_tien_ke_hoach_da_dau_tu] = useState("");
    // const [hcp, set_hcp]= useState("");
    const [search, set_search] = useState('');

    const handeClick = (e) => {
        let lst = [];
        for (const [index, element] of arr_hcp.entries()) {
        if(element.ma_kh_chung === e.target.id) {
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
    


    const fetch_id_data = async (select_id) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/?id=${select_id}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        set_gia_tri_smn(data.id)
        console.log(data)
        SetLoading(false)

        }
    }

    const post_form_data = async (data) => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_tracking_chi_phi_hco/`, {
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

        const ma_hco = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_hco.push(i.ma_kh_chung)}
        }

        // set_number2(Number(number2)+1)

        const data = {
            "ma_kh_chung":ma_hco[0],
            "manv":manv,
            "current_date":current_date,
            "chon_khoa_phong_smn":chon_khoa_phong_smn,
            "chon_thang_smn":chon_thang_smn,
            "gia_tri_smn":gia_tri_smn,
            "chon_thang_sms":chon_thang_sms,
            "gia_tri_sms":gia_tri_sms,
            "chon_loai_ttk":chon_loai_ttk,
            "chon_thang_ttk":chon_thang_ttk,
            "gia_tri_ttk":gia_tri_ttk
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
                            {/* <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_pcl") } className="bg-success text-white border-0" >PCL</Button> */}
                            <Button onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } className="bg-primary text-white border-0"> HCP</Button>
                        </ButtonGroup>

                        <Card className="mt-2">
                            <Card.Body>
                            <Card.Title>HCO: TRACKING CHI PHÍ ĐẦU TƯ</Card.Title>
                                <Card.Text>
                                Tổng số HCO đã đầu tư: {tong_hco_da_dau_tu} HCO
                                <br></br>
                                Tổng số tiền đã đầu tư: {f.format(tong_tien_ke_hoach_da_dau_tu)} VNĐ
                                <br></br>
                                Tổng số tiền thực tế đầu tư: 0 VNĐ
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <ListGroup className="mt-2" style={{maxHeight: "400px", overflowY: "auto"}}>

                        <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value.toLowerCase())} placeholder="Tìm Mã Hoặc Tên" />

                        {arr_hcp
                            .filter( el => el.clean_ten_kh_chung.toLowerCase().includes(search))
                            .map( (el, index) =>
                            <ListGroup.Item key={el.id} style={{maxHeight:"90px"}} className="border border-secondary mx-0 px-0" >
                                <Form.Check key={el.id} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.ma_kh_chung} label={el.ten_kh_chung + ' - '  + el.phan_loai_hco + ' - '  + el.ma_kh_chung }/>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{ 'Merap tận tâm '+ f.format(el.merap_tt) + ' - SMS '+ f.format(el.sms) + ' - SMN '+  f.format(el.smn) + ' - Tài Trợ Khác '+  f.format(el.ttk) }  </p>
                            <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{ 'Tổng Mức Đầu Tư: '+ f.format (Number(el.merap_tt) + Number(el.ttk) + Number(el.sms) + Number(el.smn)  )  }  </p>
                            </ListGroup.Item>
                            )
                        }
                        </ListGroup>

                        
                        {/* SMN */}
                        <div className=" mt-2 border border-1 border-success rounded">

                        <h6 className="mt-2 ml-1 fw-bold">SMN</h6>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_khoa_phong_smn(e.target.value)  }>                                 
                            <option value=''>Chọn Khoa Phòng SMN</option>
                            <option value='CHĂM SÓC KHÁCH HÀNG'>CHĂM SÓC KHÁCH HÀNG</option>
                            <option value='CHĂM SÓC KHÁCH HÀNG'>CHĂM SÓC KHÁCH HÀNG</option>
                        )
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_thang_smn(e.target.value)  }>                              
                            <option value=''>Chọn Tháng SMN</option>
                            <option value='Tháng 1'>Tháng 1</option>
                            <option value='Tháng 2'>Tháng 2</option>
                            <option value='Tháng 3'>Tháng 3</option>
                        )
                        </Form.Select>

                        <FloatingLabel label={"Giá Trị SMN" + " : " + f.format(gia_tri_smn) } className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_gia_tri_smn(e.target.value) } value = {gia_tri_smn}/> </FloatingLabel>

                        </div>

                        {/* SMS */}
                        <div className=" mt-2 border border-1 border-success rounded">
                        <h6 className="mt-2 ml-1 fw-bold">SMS</h6>
                                
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_thang_sms(e.target.value)  }>                                 
                            <option value=''>Chọn Tháng SMS</option>
                            <option value='Tháng 1'>Tháng 1</option>
                            <option value='Tháng 2'>Tháng 2</option>
                            <option value='Tháng 3'>Tháng 3</option>
                        )
                        </Form.Select>

                        <FloatingLabel label={"Giá Trị SMS" + " : " + f.format(gia_tri_sms) } className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_gia_tri_sms(e.target.value) } value = {gia_tri_sms}/> </FloatingLabel>

                        </div>

                        <div className=" mt-2 border border-1 border-success rounded">
                        <h6 className="mt-2 ml-1 fw-bold">Tài Trợ Khác</h6>

                        <Form.Select required className="mt-2" style={{height:"60px"}} onChange={ (e) => set_chon_loai_ttk(e.target.value)  }>                                 
                            <option value=''>Chọn Loại Tài Trợ</option>
                            <option value='Hội Nghị KHBV'>Hội Nghị KHBV</option>
                            <option value='Từ Thiện'>Từ Thiện</option>
                            <option value='Trang Thiết Bị Y Tế'>Trang Thiết Bị Y Tế</option>
                        
                        </Form.Select>
                                
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_thang_ttk(e.target.value)  }>                                 
                            <option value=''>Chọn Tháng Tài Trợ Khác</option>
                            <option value='Tháng 1'>Tháng 1</option>
                            <option value='Tháng 2'>Tháng 2</option>
                            <option value='Tháng 3'>Tháng 3</option>
                        
                        </Form.Select>

                        <FloatingLabel label={"Giá Trị Tài Trợ Khác" + " : " + f.format(gia_tri_ttk) } className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_gia_tri_ttk(e.target.value) } value = {gia_tri_ttk}/> </FloatingLabel>

                        </div>
                                                
                        <Button disabled={false} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
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

// export default Tracking_chi_phi_pcl