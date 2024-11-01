/* eslint-disable */
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
    ListGroup,
    Modal,
    FloatingLabel,
    Stack,
    Dropdown,
    // Badge
    // InputGroup,
    
    
} from "react-bootstrap";

function Tao_hcp_bv({history, location}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const location_search = new URLSearchParams(location.search)

    const fetch_initial_data = async (manv) => {
        SetLoading(true);
        // const response = await fetch(`https://bi.meraplion.com/local/tao_hcp_bv_get_data_hcp/?manv=${manv}`)

        const response = await fetch(`https://bi.meraplion.com/local/tao_hcp_bv_get_data_hcp/?manv=MR3047`)
        
        if (response.ok) {
            const data = await response.json()
            set_arr_ngay_sinh(data['lst_ngay_sinh'])
            set_arr_thang_sinh(data['lst_thang_sinh'])
            set_arr_nam_sinh(data['lst_nam_sinh'])
            set_lst_gioi_tinh(data['lst_gioi_tinh']);
            set_lst_phan_loai_hcp(data['lst_phan_loai_hcp']);
            set_lst_kenh_lam_viec(data['lst_kenh_lam_viec']);
            set_lst_hcp_bv(data['lst_hcp_bv']);
            set_lst_chuc_danh(data['lst_chuc_danh']);
            set_lst_chuc_vu(data['lst_chuc_vu']);
            set_lst_nganh(data['lst_nganh']);
            set_lst_nganh_chuyen_khoa(data['lst_nganh_chuyen_khoa']);
            set_lst_nganh_khoa_phong(data['lst_nganh_khoa_phong']);

            set_lst_hcp_pcl(data['lst_hcp_pcl']);
            set_lst_chuc_vu_pcl(data['lst_chuc_vu_pcl']);
            SetLoading(false);
        }
        else {
            SetLoading(false);
        }
    }

    const [count, setCount] = useState(0);
    let data_chon_co_pm =
    [
        {
            "cacluachon": "Có code",
            "check": false
        },
        {
            "cacluachon": "Không có code",
            "check": false
        },
    ]

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Tao_hcp_bv', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        console.log("suasdt",location_search.get('suasdt'))
        } else {
            history.push('/login');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [EDITMODE, SET_EDITMODE] = useState(false);
    const [manv, set_manv] = useState("");
    const [ten_hcp, set_ten_hcp]= useState("");
    const [sdt, set_sdt]= useState("");
    const [arr_gimmick, set_arr_gimmick] = useState([]);
    const [arr_ngay_sinh, set_arr_ngay_sinh] = useState([]);
    const [chon_ngay_sinh, set_chon_ngay_sinh] = useState("");
    const [arr_thang_sinh, set_arr_thang_sinh] = useState([]);
    const [chon_thang_sinh, set_chon_thang_sinh] = useState("");
    const [arr_nam_sinh, set_arr_nam_sinh] = useState( Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i) );
    const [chon_nam_sinh, set_chon_nam_sinh] = useState("");
    const [arr_co_lam_phong_mach, set_arr_co_lam_phong_mach] = useState(data_chon_co_pm);

    const [chon_co_code, set_chon_co_code] = useState(false);
    const [check_trung_sdt, set_check_trung_sdt] = useState(false);
    const [lst_gioi_tinh, set_lst_gioi_tinh] = useState([]);
    const [chon_gioi_tinh, set_chon_gioi_tinh] = useState([]);
    const [lst_kenh_lam_viec, set_lst_kenh_lam_viec] = useState([]);
    const [chon_kenh_lam_viec, set_chon_kenh_lam_viec] = useState([]);
    const [lst_phan_loai_hcp, set_lst_phan_loai_hcp] = useState([]);
    const [chon_phan_loai_hcp, set_chon_phan_loai_hcp] = useState([]);
    const [lst_hcp_bv, set_lst_hcp_bv] = useState([]);
    const [search_mahcp_bv, set_search_mahcp_bv] = useState("");
    const [chon_mahcp_bv, set_chon_mahcp_bv] = useState("");
    const [search_hco_bv, set_search_hco_bv] = useState("");
    const [chon_hco_bv, set_chon_hco_bv] = useState("");
    const [lst_hcp_pcl, set_lst_hcp_pcl] = useState([]);
    const [search_hco_pcl, set_search_hco_pcl] = useState("");
    const [chon_hco_pcl, set_chon_hco_pcl] = useState("");
    const [lst_chuc_danh, set_lst_chuc_danh] = useState([]);
    const [chon_chuc_danh, set_chon_chuc_danh] = useState([]);
    const [lst_chuc_vu, set_lst_chuc_vu] = useState([]);
    const [chon_chuc_vu, set_chon_chuc_vu] = useState([]);
    const [lst_nganh, set_lst_nganh] = useState([]);
    const [chon_nganh, set_chon_nganh] = useState([]);
    // const [chon_nganh, set_chon_nganh] = useState("");
    const [lst_nganh_chuyen_khoa, set_lst_nganh_chuyen_khoa] = useState([]);
    const [chon_nganh_chuyen_khoa, set_chon_nganh_chuyen_khoa] = useState([]);
    const [lst_nganh_khoa_phong, set_lst_nganh_khoa_phong] = useState([]);
    const [chon_nganh_khoa_phong, set_chon_nganh_khoa_phong] = useState([]);
    const [so_tiem_nang, set_so_tiem_nang] = useState(0);
    const [so_luot_kham, set_so_luot_kham] = useState(0);

    const [lst_chuc_vu_pcl, set_lst_chuc_vu_pcl] = useState([]);
    const [chon_chuc_vu_pcl, set_chon_chuc_vu_pcl] = useState("");
    const [search, set_search] = useState("");
    
    // const [chon_qua_tang, set_chon_qua_tang] = useState("");
    // const [chon_qua_sn, set_chon_qua_sn] = useState("");
    // const [chon_hoi_nghi, set_chon_hoi_nghi] = useState("");
    // const [chon_qua_tang_hoi_nghi, set_chon_qua_tang_hoi_nghi] = useState("");
    // const [chon_hinh_thuc_hoi_nghi, set_chon_hinh_thuc_hoi_nghi] = useState("");
    // const [chon_qua_tang_2, set_chon_qua_tang_2] = useState("");
    // const [chon_qua_tang_cam_xuc, set_chon_qua_tang_cam_xuc] = useState("");
    // const [number1, set_number1] = useState("500000");
    // const [number2, set_number2] = useState("0");

    // const [arr_hcp, set_arr_hcp] = useState([]);
    // const [hcp, set_hcp] = useState("");
    // const [tong_hcp_da_dau_tu, set_tong_hcp_da_dau_tu] = useState("");
    // const [tong_tien_ke_hoach_da_dau_tu, set_tong_tien_ke_hoach_da_dau_tu] = useState("");
    // const [arr_gift, set_arr_gift] = useState(['Quà Tặng 1','Quà Tặng 2','Quà Tặng 3']);
    // const [hcp, set_hcp]= useState("");
    

    const handeClick = (e) => {
        let lst = [];
        for (let element of arr_co_lam_phong_mach) {
            let select_lua_chon = e.target.id;  
            if(element.cacluachon === select_lua_chon) {
                element.check = e.target.checked
                lst.push(element);
            }

            else if (element.cacluachon !== select_lua_chon){
                element.check = false
                lst.push(element);
            } 
            else {
                lst.push(element);
            }

            set_arr_co_lam_phong_mach(lst);

            if("Có code" === select_lua_chon & e.target.checked === true) {
                set_chon_co_code(true);
            }
            else {
                set_chon_co_code(false);
                set_chon_hco_pcl("");
                set_chon_chuc_vu("");
            }
        }

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
    //     set_ten_hcp(data.id)
    //     console.log(data)
    //     SetLoading(false)

    //     }
    // }

    const post_form_data = async (data) => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_tao_hcp_bv/`, {
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
            // CLEAR OLD DATA
            set_sdt("");
            set_ten_hcp("");
            set_chon_hco_bv("");
            // set_chon_ngay_sinh("");
            // set_chon_thang_sinh("");
            // set_chon_nam_sinh("");
            // set_chon_gioi_tinh("");
            // set_chon_kenh_lam_viec("");
            // set_chon_phan_loai_hcp("");
            // set_chon_chuc_danh("");
            // set_chon_chuc_vu("");
            // set_chon_nganh("");
            // set_chon_nganh_chuyen_khoa("");
            // set_chon_nganh_khoa_phong("");
            
            set_arr_co_lam_phong_mach(data_chon_co_pm);
            set_chon_co_code(false);
            set_chon_hco_pcl("");
            set_chon_chuc_vu_pcl("");
            set_so_tiem_nang(0);
            set_so_luot_kham(0);
            // END CLEAR DATA
            setCount(count+1);
            // window.location.reload();

        }
    }

    const handle_on_blur = (data) => {

        if (data === "123456789") {
            set_check_trung_sdt(true)
        }
        else {
            set_check_trung_sdt(false)
        }
        // e.preventDefault();
        // console.log(data);
        // post_form_data(data);

    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        // let co_lam_phong_mach = []
        // for (let i of arr_co_lam_phong_mach) {
        //     if (i.check === true) { co_lam_phong_mach.push(i.cacluachon) }
        // }

        // set_number2(Number(number2)+1)

        const data = {
            // "ma_hcp_2":ma_hcp[0],
            "manv":manv,
            "current_date":current_date,
            "sdt":sdt,
            "ten_hcp":ten_hcp,
            "hco_bv": chon_hco_bv,
            "ngay_sinh": chon_ngay_sinh,
            "thang_sinh": chon_thang_sinh,
            "nam_sinh": chon_nam_sinh,
            "gioi_tinh": chon_gioi_tinh,
            "kenh_lam_viec": chon_kenh_lam_viec,
            "phan_loai_hcp": chon_phan_loai_hcp,
            "chuc_danh": chon_chuc_danh,
            "chuc_vu": chon_chuc_vu,
            "nganh": chon_nganh,
            "nganh_chuyen_khoa": chon_nganh_chuyen_khoa,
            "nganh_khoa_phong": chon_nganh_khoa_phong,
            "co_lam_them": chon_co_code,
            "hco_lam_them": chon_hco_pcl,
            "chuc_vu_lam_them": chon_chuc_vu_pcl,
            "hco_chung_bv":"",
            "ma_hcp_1":"",
            "ma_hcp_2":"",
            "form_input":"BV",
            "inserted_at":"",
            "uuid":uuid(),
            "so_luot_kham":so_luot_kham,
            "so_tiem_nang":so_tiem_nang,
            
        }
        console.log(data);
        post_form_data(data);
        document.getElementById("focus_1").focus();

    }

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
            </Modal>
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>
                        {/* ALERT COMPONENT */}
                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{fontWeight: "bold"}}  key={1} onClick={ () => {navigate.push("/formcontrol/tao_hcp_bv"); SET_EDITMODE(false)} } className="bg-warning text-dark border-0" >Tạo Mới HCP BV</Button>
                            <Button style={{width: "60px"}} key={2} onClick={ () => SET_EDITMODE(true) } className="ml-1 bg-warning text-dark border-0" >Sửa BV</Button>
                            <Button style={{fontWeight: "bold"}} key={3} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } className="ml-1 bg-primary border-0" >Tạo Mới HCP PCL</Button>
                            <Button style={{width: "60px"}} key={4} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } className="ml-1 bg-primary border-0" >Sửa PCL</Button>
                            <Button style={{width: "30px"}} key={5} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } className="ml-1 bg-secondary border-0" >BC</Button>
                        </ButtonGroup>

                        {EDITMODE &&

                        <Dropdown className="mt-2" autoClose="true" block="true" onSelect = {e =>set_chon_mahcp_bv(e)}>
                                
                                <Dropdown.Toggle className="border-0 flex-grow-1 w-100 text-center text-dark fw-bold"  style={{height:"40px", backgroundColor:"#FFFFE0" }}> 
                                {chon_mahcp_bv ==="" ? "Chọn Mã HCP Bệnh Viện Để Sửa": chon_mahcp_bv}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_mahcp_bv(e.target.value.toLowerCase()) } value = {search_mahcp_bv} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_hcp_bv
                                    .filter( el => el.clean_ma_ten_kh.includes(search_mahcp_bv) )
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.custname}> {el.custname}  </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>
                        }

                        {/* ID */}

                        {EDITMODE &&

                        <FloatingLabel label="MÃ HCP ĐÃ CHỌN" className="border rounded" style={{color:"black"}} > <Form.Control disabled={true} required type="text" placeholder="MÃ HCP ĐÃ CHỌN" style={{backgroundColor:"#FFFFE0"}} className="" onChange={ (e) => console.log(ebc) } value = {"VuHa"}/> </FloatingLabel>
                        
                        }
                        {/* <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên (KHONG DAU) " /> */}
                        <FloatingLabel id="focus_1" label="Số điện thoại" className="border rounded mt-2" > <Form.Control type="number" className="" placeholder="xxx" onChange={ (e) => set_sdt(e.target.value) } onBlur={ e => handle_on_blur(e.target.value) } value = {sdt}/> </FloatingLabel>
                        {check_trung_sdt &&
                            <p className="ml-1 fw-bold text-danger">SĐT ĐÃ BỊ TRÙNG VUI LÒNG NHẬP SĐT KHÁC</p>
                        }
                        <FloatingLabel label="Tên HCP (IN HOA có dấu), ví dụ: NGUYỄN HÙNG ANH" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_ten_hcp(e.target.value.toLocaleUpperCase()) } value = {ten_hcp}/> </FloatingLabel>


                        <Dropdown className="mt-2" autoClose="true" block="true" onSelect = { (e) => set_chon_hco_bv(e) }>
                                
                                <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1 w-100"  style={{height:"60px"}}> 
                                {chon_hco_bv ==="" ? "Chọn HCO Bệnh Viện": chon_hco_bv}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_hco_bv(e.target.value.toLowerCase()) } value = {search_hco_bv} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_hcp_bv
                                    .filter( el => el.clean_ma_ten_kh.includes(search_hco_bv) )
                                    .map( (el, idx) =>
                                        <Dropdown.Item key={idx} eventKey={el.custname}> {el.custname}  </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>

                        <Stack direction="horizontal" gap={2} className="border-1">

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_ngay_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value=''>Ngày Sinh</option>
                            {arr_ngay_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_thang_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value=''>Tháng Sinh</option>
                            {arr_thang_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_nam_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value=''>Năm Sinh</option>
                            {arr_nam_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }
                        </Form.Select>

                        </Stack>

                        <Stack direction="horizontal" gap={2} className="border-1">

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_gioi_tinh(e.target.value) }>
                            <option value="">Giới Tính</option>
                            {lst_gioi_tinh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_kenh_lam_viec(e.target.value) }>
                            <option value="">Kênh</option>
                            {lst_kenh_lam_viec
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px" , fontSize:"15px"}}  onChange={ (e) => set_chon_phan_loai_hcp(e.target.value) }>
                            <option value="">Phân Loại HCP</option>
                            {lst_phan_loai_hcp
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        </Stack>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_chuc_danh(e.target.value) }>
                            <option value="">Chức Danh</option>
                            {lst_chuc_danh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>


                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_chuc_vu(e.target.value) }>
                            <option value="">Chức Vụ</option>
                            {lst_chuc_vu
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh(e.target.value) }>
                            <option value="">Ngành</option>
                            {lst_nganh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select disabled={chon_nganh===""} required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh_chuyen_khoa(e.target.value) }>
                            <option value="">(Ngành) Chuyên Khoa</option>
                            {lst_nganh_chuyen_khoa
                            .filter (el => el.chon_chinh === chon_nganh)
                            .map( (el, index) => 
                            <option key={index} value={el.chon_phu}> {el.chon_phu} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select disabled={chon_nganh===""} required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh_khoa_phong(e.target.value) }>
                            <option value="">(Ngành) Khoa Phòng</option>
                            {lst_nganh_khoa_phong
                            .filter (el => el.chon_chinh === chon_nganh)
                            .map( (el, index) =>
                            <option key={index} value={el.chon_phu}> {el.chon_phu} </option>
                            )
                            }
                        </Form.Select>

                        <Stack direction="horizontal" gap={1} className="border-1">
                            <FloatingLabel style={{width: "50%"}} label="Số lượt khám" className="border rounded mt-2" > <Form.Control type="number" className="" placeholder="xxx" onChange={ (e) => set_so_luot_kham(e.target.value.toLocaleUpperCase()) } value = {so_luot_kham}/> </FloatingLabel>
                            <FloatingLabel style={{width: "50%"}} label="Tiềm năng" className="border rounded mt-2" > <Form.Control type="number" className="" placeholder="xxx" onChange={ (e) => set_so_tiem_nang(e.target.value.toLocaleUpperCase()) } value = {so_tiem_nang}/> </FloatingLabel>
                        </Stack>
                        <div className="mt-2 border border-1 border-success rounded">

                        <Card className="">
                            <Card.Title className="ml-2 fw-normal">
                                Bác sỹ có làm ở phòng mạch ?
                            </Card.Title>


                            {arr_co_lam_phong_mach
                            .map( (eli, index) =>
                            <Form.Check key={index} className="text-wrap" type="switch" checked={eli.check} onChange={ handeClick } id={eli.cacluachon} label={ eli.cacluachon }/>
                            )
                            }
                        </Card>

                        <>

                        <Dropdown  className="" autoClose="true" block="true" onSelect = {e =>set_chon_hco_pcl(e)}>
                                
                                <Dropdown.Toggle disabled={!chon_co_code} className="mt-1 bg-white border-0 text-dark text-left flex-grow-1 w-100"  style={{height:"60px"}}> 
                                {chon_hco_pcl ==="" ? "Chọn HCO Phòng Mạch": chon_hco_pcl}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_hco_pcl(e.target.value.toLowerCase()) } value = {search_hco_pcl} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_hcp_pcl
                                    .filter( el => el.clean_ma_ten_kh.includes(search_hco_pcl) )
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.custname}> {el.custname} </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown  className="" autoClose="true" block="true" onSelect = {e => set_chon_chuc_vu_pcl(e)}>
                                
                                <Dropdown.Toggle disabled={!chon_co_code} className="mt-1 bg-white border-0 text-dark text-left flex-grow-1 w-100"  style={{height:"60px"}}> 
                                
                                {chon_chuc_vu_pcl ==="" ? "Chọn Chức Vụ Phòng Mạch": chon_chuc_vu_pcl}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_chuc_vu_pcl
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.chon_chinh}> {el.chon_chinh} </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>
                        
                        </>

                        </div>
                        
                        <Button disabled={false} className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        
                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        
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


export default Tao_hcp_bv