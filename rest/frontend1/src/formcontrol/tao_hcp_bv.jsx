/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuid } from 'uuid';
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
    Dropdown
} from "react-bootstrap";

function Tao_hcp_bv() {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useNavigate();
    const location = useLocation();
    const location_search = new URLSearchParams(location.search)

    const fetch_initial_data = async (manv) => {
        SetLoading(true);
        // if PCL
        // const response = await fetch(`https://bi.meraplion.com/local/tao_hcp_bv_get_data_hcp/?manv=MR3047&form_layout=PCL&lam_them=BV`)
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_data_tao_hcp_bv/?manv=${manv}&form_layout=BV&lam_them=PCL`)
        
        if (response.ok) {
            const data = await response.json()
            set_arr_tinh(data['lst_tinh'])
            set_arr_ngay_sinh(data['lst_ngay_sinh'])
            set_arr_thang_sinh(data['lst_thang_sinh'])
            set_arr_nam_sinh(data['lst_nam_sinh'])
            set_lst_gioi_tinh(data['lst_gioi_tinh']);
            set_lst_phan_loai_hcp(data['lst_phan_loai_hcp']);
            set_lst_kenh_lam_viec(data['lst_kenh_lam_viec']);
            set_lst_khc_chon_chinh(data['lst_khc_chon_chinh']);
            set_lst_hcp2_bv(data['lst_hcp2_bv']);
            set_lst_chuc_danh(data['lst_chuc_danh']);
            set_lst_chuc_vu(data['lst_chuc_vu']);
            set_lst_nganh(data['lst_nganh']);
            set_lst_nganh_chuyen_khoa(data['lst_nganh_chuyen_khoa']);
            set_lst_nganh_khoa_phong(data['lst_nganh_khoa_phong']);

            set_lst_khc_chon_phu(data['lst_khc_chon_phu']);
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
        }
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
        let bol1 = location_search.get('edit') === '1' ? true : false
        SET_EDITMODE(bol1);
        } else {
            navigate('/login?redirect=/formcontrol/tao_hcp_bv');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [EDITMODE, SET_EDITMODE] = useState(false);
    const [manv, set_manv] = useState("");
    const [ten_hcp, set_ten_hcp]= useState("");
    const [sdt, set_sdt]= useState("");
    const [email, set_email]= useState("");
    const [arr_tinh, set_arr_tinh] = useState([]);
    const [chon_tinh, set_chon_tinh] = useState("");
    const [arr_quan_huyen, set_arr_quan_huyen] = useState([]);
    const [chon_quan_huyen, set_chon_quan_huyen] = useState("");
    const [arr_phuong_xa, set_arr_phuong_xa] = useState([]);
    const [chon_phuong_xa, set_chon_phuong_xa] = useState("");
    const [dia_chi, set_dia_chi] = useState("");
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
    const [chon_gioi_tinh, set_chon_gioi_tinh] = useState("");
    const [lst_kenh_lam_viec, set_lst_kenh_lam_viec] = useState([]);
    const [chon_kenh_lam_viec, set_chon_kenh_lam_viec] = useState("");
    const [lst_phan_loai_hcp, set_lst_phan_loai_hcp] = useState([]);
    const [chon_phan_loai_hcp, set_chon_phan_loai_hcp] = useState("");
    const [lst_khc_chon_chinh, set_lst_khc_chon_chinh] = useState([]);
    const [search_hco_bv, set_search_hco_bv] = useState("");
    const [chon_hco_bv, set_chon_hco_bv] = useState("");
    const [lst_hcp2_bv, set_lst_hcp2_bv] = useState([]);
    const [search_mahcp2_bv, set_search_mahcp2_bv] = useState("");
    const [chon_mahcp2_bv, set_chon_mahcp2_bv] = useState("");
    const [lst_khc_chon_phu, set_lst_khc_chon_phu] = useState([]);
    const [search_hco_pcl, set_search_hco_pcl] = useState("");
    const [chon_hco_pcl, set_chon_hco_pcl] = useState("");
    const [lst_chuc_danh, set_lst_chuc_danh] = useState([]);
    const [chon_chuc_danh, set_chon_chuc_danh] = useState("");
    const [lst_chuc_vu, set_lst_chuc_vu] = useState([]);
    const [chon_chuc_vu, set_chon_chuc_vu] = useState("");
    const [lst_nganh, set_lst_nganh] = useState([]);
    const [chon_nganh, set_chon_nganh] = useState("");
    const [lst_nganh_chuyen_khoa, set_lst_nganh_chuyen_khoa] = useState([]);
    const [chon_nganh_chuyen_khoa, set_chon_nganh_chuyen_khoa] = useState("");
    const [chon_nganh_chuyen_khoa_khac, set_chon_nganh_chuyen_khoa_khac] = useState('');
    const [lst_nganh_khoa_phong, set_lst_nganh_khoa_phong] = useState([]);
    const [chon_nganh_khoa_phong, set_chon_nganh_khoa_phong] = useState("");
    const [chon_nganh_khoa_phong_khac, set_chon_nganh_khoa_phong_khac] = useState("");
    const [so_tiem_nang, set_so_tiem_nang] = useState("");
    const [so_luot_kham, set_so_luot_kham] = useState("");
    const [lst_chuc_vu_pcl, set_lst_chuc_vu_pcl] = useState([]);
    const [chon_chuc_vu_pcl, set_chon_chuc_vu_pcl] = useState("");
    const [uuid_old, set_uuid_old] = useState("");
    const [inserted_at, set_inserted_at] = useState("");
    const [ma_hcp_1, set_ma_hcp_1] = useState("");
    const [ma_hcp_2, set_ma_hcp_2] = useState("");


    const handle_chon_tinh = async (e) => {
        let selected = e.target.value
        set_chon_tinh(selected);

        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dms_district/?state=${selected}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const data = await response.json();
            console.log(data);
            set_arr_quan_huyen(data['lst_quan_huyen'])
        }

    };

    const handle_chon_quan_huyen = async (e) => {
        let selected = e.target.value
        set_chon_quan_huyen(selected);

        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dms_ward/?district=${selected}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const data = await response.json();
            console.log(data);
            set_arr_phuong_xa(data['lst_phuong_xa'])
        }

    };
    
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
                set_chon_chuc_vu_pcl("")
            }
        }

    }
    
    
    const clear_data = () => {
        set_sdt("");
        set_email("");
        set_ten_hcp("");
        set_chon_hco_bv("");
        set_chon_mahcp2_bv("");
        set_arr_co_lam_phong_mach(data_chon_co_pm);
        set_chon_co_code(false);
        set_chon_hco_pcl("");
        set_chon_chuc_vu_pcl("");
        set_so_tiem_nang("");
        set_so_luot_kham("");
        set_uuid_old("");
        set_inserted_at("");
        set_ma_hcp_1("");
        set_ma_hcp_2("");
        set_chon_nganh_chuyen_khoa_khac("");
        set_chon_nganh_khoa_phong_khac("");
    }

    const post_form_data = async (data) => {
        SetLoading(true)

        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_crm_hcp/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText(data.error_message);
            setTimeout(() => {
            SetALert(false);
            SetLoading(false);
            }, 2000);
        } else {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText( data.success_message );
            setTimeout(() => {
            SetALert(false);
            SetLoading(false);
            }, 2000);
            clear_data();
            setCount(count+1);
        }
    }

    const handle_on_blur = async (sdt) => {

        SetLoading(true);
        // if PCL
        // const response = await fetch(`https://bi.meraplion.com/local/check_sdt_tao_hcp_bv/?sdt=${sdt}&form_layout=PCL`)
        const response = await fetch(`https://bi.meraplion.com/local/get_data/check_sdt_hco_bv/?sdt=${sdt}&hco_bv=${chon_hco_bv.split("-")[0]}`)
        if (response.ok) {
            const data = await response.json();
            SetLoading(false);
            if (data.sdt === 1) {
                set_check_trung_sdt(true)
            }
            else {
                set_check_trung_sdt(false)
            }
        }
        else {
            SetLoading(false);
        }

    }

    const handle_on_click_dropdown = async (e) => {
    
        let ten = e.split("@@")[0];
        let id = e.split("@@")[1];

        let arr_hcpp = lst_hcp2_bv.filter( (el) => el.uuid ===  id )
        arr_hcpp = arr_hcpp[0]
        console.log(arr_hcpp)

        set_sdt( arr_hcpp['sdt'] )
        set_email( arr_hcpp['email'] )
        set_ten_hcp( arr_hcpp['ten_hcp'] )

        set_chon_tinh(arr_hcpp['tinh'])
        set_chon_quan_huyen(arr_hcpp['quan_huyen'])
        set_chon_phuong_xa(arr_hcpp['phuong_xa'])
        set_dia_chi(arr_hcpp['dia_chi'])
        // set_chon_trang_thai(arr_hcpp['trang_thai'])      

        set_chon_hco_bv(arr_hcpp['hco_bv'])
        set_chon_ngay_sinh(arr_hcpp['ngay_sinh'])
        set_chon_thang_sinh(arr_hcpp['thang_sinh'])
        set_chon_nam_sinh(arr_hcpp['nam_sinh'])
        set_chon_gioi_tinh(arr_hcpp['gioi_tinh'])
        set_chon_kenh_lam_viec(arr_hcpp['kenh_lam_viec'])
        set_chon_phan_loai_hcp(arr_hcpp['phan_loai_hcp'])
        set_chon_chuc_danh(arr_hcpp['chuc_danh'])
        set_chon_chuc_vu(arr_hcpp['chuc_vu'])
        set_chon_nganh(arr_hcpp['nganh'])
        set_chon_nganh_chuyen_khoa(arr_hcpp['nganh_chuyen_khoa'])
        set_chon_nganh_khoa_phong(arr_hcpp['nganh_khoa_phong'])
        set_so_luot_kham(arr_hcpp['so_luot_kham'])
        set_so_tiem_nang(arr_hcpp['so_tiem_nang'])

        let data_lam_them =[{"cacluachon": "Có code","check": true}]

        if (arr_hcpp['co_lam_them']===1) {
            set_arr_co_lam_phong_mach(data_lam_them);
            set_chon_co_code(true);
        } else {void(0)}

        set_chon_hco_pcl(arr_hcpp['hco_lam_them']);
        set_chon_chuc_vu_pcl(arr_hcpp['chuc_vu_lam_them']);
        set_uuid_old(arr_hcpp['uuid']);
        set_inserted_at(arr_hcpp['inserted_at']);
        set_ma_hcp_1(arr_hcpp['ma_hcp_1']);
        set_ma_hcp_2(arr_hcpp['ma_hcp_2']);

        set_chon_mahcp2_bv( ten )
    }

    const handle_chon_chuc_vu = (e) => {
        const selectedChucVu = e.target.value;
        set_chon_chuc_vu(selectedChucVu);
    
        // Find the corresponding 'PHÂN LOẠI HCP' based on the selected value
        const selectedItem = lst_phan_loai_hcp.find(item => item.chon_chinh === selectedChucVu);
        
        if (selectedItem) {
          set_chon_phan_loai_hcp(selectedItem.chon_phu);
        }
      };

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        let iso_time = new Date()
        iso_time.setHours(iso_time.getHours() + 7)
        iso_time = iso_time.toISOString()
        iso_time = iso_time.replace("T", " ")
        iso_time = iso_time.replace("Z", " ")
        console.log(iso_time)


        const data = {
            "manv":manv,
            "created_date":current_date,
            "sdt":sdt,
            "ten_hcp":ten_hcp,
            "hco_bv": chon_hco_bv.split("-")[0],
            "ngay_sinh": chon_ngay_sinh,
            "thang_sinh": chon_thang_sinh,
            "nam_sinh": chon_nam_sinh,
            "gioi_tinh": chon_gioi_tinh,
            "kenh_lam_viec": chon_kenh_lam_viec, // if PCL then PCL
            "phan_loai_hcp": chon_phan_loai_hcp,
            "chuc_danh": chon_chuc_danh,
            "chuc_vu": chon_chuc_vu,
            "nganh": chon_nganh,
            "nganh_chuyen_khoa": chon_nganh_chuyen_khoa_khac ? chon_nganh_chuyen_khoa + "--" + chon_nganh_chuyen_khoa_khac : chon_nganh_chuyen_khoa,
            "nganh_khoa_phong": chon_nganh_khoa_phong_khac ? chon_nganh_khoa_phong + "--" + chon_nganh_khoa_phong_khac : chon_nganh_khoa_phong,
            "co_lam_them": Number(chon_co_code),
            "hco_lam_them": chon_hco_pcl?.split("-")[0],
            "chuc_vu_lam_them": chon_chuc_vu_pcl,
            "hco_chung_bv":"",
            "ma_hcp_1": ma_hcp_1,
            "ma_hcp_2": ma_hcp_2,
            "form_input":"BV", // if PCL then PCL
            "inserted_at":inserted_at === "" ? iso_time : inserted_at.replace("T", " ").replace("Z", " "),
            "uuid": uuid_old === "" ? uuid() : uuid_old,
            "so_luot_kham":so_luot_kham,
            "so_tiem_nang":so_tiem_nang, // if PCL then 0
            "lupd_at":iso_time,
            "tinh":chon_tinh,
            "quan_huyen":chon_quan_huyen,
            "phuong_xa":chon_phuong_xa,
            "dia_chi":dia_chi,
            "trang_thai":"active",
            "email":email
        }
        console.log([data]);
        post_form_data([data]);
    }

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
            </Modal>
            <Row className="justify-content-center">
                <Col md={4} >

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
                        <Button style={{width: "100%"}} size="sm" variant="outline-success" key={0} onClick={ () => navigate("/crmhome") } >HOME</Button>
                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{fontWeight: "bold"}}  key={1} onClick={ () => {navigate("/formcontrol/tao_hcp_bv"); SET_EDITMODE(false); clear_data() } } className="bg-warning text-dark border-0" >Tạo Mới HCP BV</Button>
                            <Button style={{width: "60px"}} key={2} onClick={ () => {navigate("/formcontrol/tao_hcp_bv?edit=1"); SET_EDITMODE(true); clear_data() } } className="ml-1 bg-warning text-dark border-0" >Sửa BV</Button>
                            <Button style={{fontWeight: "bold"}} key={3} onClick={ () => { navigate("/formcontrol/tao_hcp_pcl"); SET_EDITMODE(false); clear_data() } } className="ml-1 bg-primary border-0" >Tạo Mới HCP PCL/ED/GO</Button>
                            <Button style={{width: "60px"}} key={4} onClick={ () => { navigate("/formcontrol/tao_hcp_pcl?edit=1") ; SET_EDITMODE(true); clear_data() } } className="ml-1 bg-primary border-0" >Sửa PCL</Button>
                            <Button style={{width: "30px"}} key={5} onClick={ () => navigate("/formcontrol/tao_hcp_bc") } className="ml-1 bg-secondary border-0" >BC</Button>
                        </ButtonGroup>

                        {EDITMODE &&

                        <Dropdown className="mt-2" autoClose="true" block="true" onSelect = { (e) => handle_on_click_dropdown(e)}>
                                
                                <Dropdown.Toggle className="border-0 flex-grow-1 w-100 text-center text-dark fw-bold"  style={{height:"40px", backgroundColor:"#FFF8DC" }}>
                                 {/*if PCL then PCL  */}
                                {chon_mahcp2_bv ==="" ? "Chọn Mã HCP Bệnh Viện Để Sửa": chon_mahcp2_bv}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_mahcp2_bv(e.target.value.toLowerCase()) } value = {search_mahcp2_bv} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_hcp2_bv
                                    .filter( el => el.clean_sdt_ten_hcp.toLowerCase().includes(search_mahcp2_bv) )
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={ el.ten_hcp +'@@'+ el.uuid   }> {el.sdt + '-' +el.ten_hcp}  </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>
                        }

                        {/* ID */}

                        {/* {EDITMODE &&
                        
                        } */}
                        <Dropdown className="mt-2" autoClose="true" block="true" onSelect = { (e) => set_chon_hco_bv(e) }>
                                
                                <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1 w-100"  style={{height:"60px"}}> 
                                {chon_hco_bv ==="" ? "Chọn HCO Bệnh Viện": chon_hco_bv}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_hco_bv(e.target.value.toLowerCase()) } value = {search_hco_bv} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_khc_chon_chinh
                                    .filter( el => el.clean_ma_ten_kh.includes(search_hco_bv) )
                                    .map( (el, idx) =>
                                        <Dropdown.Item key={idx} eventKey={el.custid +'-'+ el.custname}> {el.custid +'-'+ el.custname}  </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>

                        <FloatingLabel label="Tên HCP (IN HOA có dấu), ví dụ: NGUYỄN HÙNG ANH" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="xxx" onChange={ (e) => set_ten_hcp(e.target.value.toLocaleUpperCase()) } value = {ten_hcp}/> </FloatingLabel>
                        
                        <Stack direction="horizontal" gap={2} className="border-1">
                            {/* Bọc SĐT và lỗi của nó lại */}
                            <Stack gap={1}> 
                                <FloatingLabel id="focus_1" label="Số điện thoại" className="border rounded mt-2" > 
                                    <Form.Control disabled={chon_hco_bv ===""} required type="number" className="" 
                                                placeholder="xxx" onChange={ (e) => set_sdt(e.target.value) } 
                                                onBlur={ e => handle_on_blur(e.target.value) } value = {sdt}/> 
                                </FloatingLabel>
                                {check_trung_sdt &&
                                    <p className="ml-1 fw-bold text-danger">SĐT ĐÃ BỊ TRÙNG VUI LÒNG NHẬP SĐT KHÁC</p>
                                }
                            </Stack>
                            
                            {/* Trường Email */}
                            <FloatingLabel label="Email" className="border rounded mt-2" > 
                                <Form.Control type="email" className="" placeholder="xxx" 
                                            onChange={ (e) => set_email(e.target.value) } value = {email}/> 
                            </FloatingLabel>
                        </Stack>

                    <Stack direction="horizontal" gap={2} className="border-1">

                        <Form.Select required className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => handle_chon_tinh(e)  }>
                        <option style={{fontSize:"15px"}} value= {chon_tinh} > {chon_tinh ==="" ? "Tỉnh": chon_tinh} </option>
                            {arr_tinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => handle_chon_quan_huyen(e)  }>
                        <option style={{fontSize:"15px"}} value= {chon_quan_huyen} > {chon_quan_huyen ==="" ? "Quận Huyện": chon_quan_huyen} </option>
                            {arr_quan_huyen
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_phuong_xa(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value= {chon_phuong_xa}>  {chon_phuong_xa ==="" ? "Phường Xã": chon_phuong_xa}  </option>
                            {arr_phuong_xa
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }
                        </Form.Select>

                    </Stack>

                        <Form.Group controlId="formSpecificAddress" className="mt-2">
                        <Form.Control required onChange={(e) => set_dia_chi(e.target.value)} value={dia_chi} as="textarea" rows={3} placeholder="Địa chỉ cụ thể. Ví dụ: Số nhà, Tên đường, Tòa nhà,..." />
                        </Form.Group>

                        <Stack direction="horizontal" gap={2} className="border-1">

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_ngay_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value= {chon_ngay_sinh} > {chon_ngay_sinh ==="" ? "Ngày Sinh": chon_ngay_sinh} </option>
                            {arr_ngay_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_thang_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value= {chon_thang_sinh} > {chon_thang_sinh ==="" ? "Tháng Sinh": chon_thang_sinh} </option>
                            {arr_thang_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }    
                        </Form.Select>

                        <Form.Select className="mt-2" style={{height:"60px", fontSize:"15px"}}  onChange={ (e) => set_chon_nam_sinh(e.target.value)  }>
                        <option style={{fontSize:"15px"}} value= {chon_nam_sinh}>  {chon_nam_sinh ==="" ? "Năm Sinh": chon_nam_sinh}  </option>
                            {arr_nam_sinh
                            .map( (el, index) => 
                            <option key={index} style={{fontSize:"15px"}} value={el}> {el} </option>
                            )
                            }
                        </Form.Select>

                        </Stack>

                        <Stack direction="horizontal" gap={2} className="border-1">

                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_gioi_tinh(e.target.value) }>
                            <option value= {chon_gioi_tinh} > {chon_gioi_tinh ==="" ? "Giới Tính": chon_gioi_tinh} </option>
                            {lst_gioi_tinh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>
                        
                        {/* if PCL then comment vì PCL chỉ có 1 kênh */}
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_kenh_lam_viec(e.target.value) }>
                            <option value= {chon_kenh_lam_viec}> {chon_kenh_lam_viec ==="" ? "Kênh": chon_kenh_lam_viec} </option>
                            {lst_kenh_lam_viec
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        </Stack>

                        <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_chuc_danh(e.target.value) }>
                            <option value= {chon_chuc_danh}> {chon_chuc_danh ==="" ? "Chức Danh": chon_chuc_danh} </option>
                            {lst_chuc_danh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => handle_chon_chuc_vu(e) }>
                            <option value= {chon_chuc_vu} > {chon_chuc_vu ==="" ? "Chức Vụ": chon_chuc_vu} </option>
                            {lst_chuc_vu
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select disabled={chon_chuc_vu===""} required className="mt-2" style={{height:"60px" , fontSize:"15px"}}  onChange={ (e) => set_chon_phan_loai_hcp(e.target.value) }>
                            {/* <option value = {chon_phan_loai_hcp} >  {chon_phan_loai_hcp ==="" ? "Phân Loại HCP": chon_phan_loai_hcp} </option> */}
                            {lst_phan_loai_hcp
                            .filter (el => el.chon_chinh === chon_chuc_vu)
                            .map( (el, index) => 
                            <option key={index} value={el.chon_phu}> {el.chon_phu} </option>
                            )
                            }
                        </Form.Select>
                        {/* IF PCL then comment */}
                        <Stack direction="horizontal" gap={1} className="border-1">
                            <FloatingLabel style={{width: "50%"}} label="Số lượt khám" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="xxx" onChange={ (e) => set_so_luot_kham(e.target.value.toLocaleUpperCase()) } value = {so_luot_kham}/> </FloatingLabel>
                            <FloatingLabel style={{width: "50%"}} label="Tiềm năng" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="xxx" onChange={ (e) => set_so_tiem_nang(e.target.value.toLocaleUpperCase()) } value = {so_tiem_nang}/> </FloatingLabel>
                        </Stack>

                        <Form.Select hidden={true} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh(e.target.value) }>
                            <option value= {chon_nganh} > {chon_nganh ==="" ? "Ngành": chon_nganh} </option>
                            {lst_nganh
                            .map( (el, index) => 
                            <option key={index} value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select>
                        
                        <Form.Select required disabled={chon_chuc_vu===""} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh_chuyen_khoa(e.target.value) }>
                            <option value= {chon_nganh_chuyen_khoa} >  {chon_nganh_chuyen_khoa ==="" ? "KHOA PHÒNG HCP LÀM VIỆC": chon_nganh_chuyen_khoa} </option>
                            {lst_nganh_chuyen_khoa
                            .filter (el => el.chon_chinh === chon_chuc_vu)
                            .map( (el, index) => 
                            <option key={index} value={el.chon_phu}> {el.chon_phu} </option>
                            )
                            }
                        </Form.Select>

                        {/* Show text input if "KHÁC" is selected, comment if PCL */}
                        {chon_nganh_chuyen_khoa === 'KHÁC' && (
                            <Form.Control
                            required
                            type="text"
                            placeholder="Vui lòng ghi cụ thể"
                            className="mt-2"
                            value={chon_nganh_chuyen_khoa_khac} // Controlled input with the state
                            onChange={(e) => set_chon_nganh_chuyen_khoa_khac(e.target.value)} // Update state inline on input change
                            />
                        )}

                        {/* if PCL then comment */}
                        <Form.Select required disabled={chon_chuc_vu===""} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_nganh_khoa_phong(e.target.value) }>
                            <option value= {chon_nganh_khoa_phong} > {chon_nganh_khoa_phong ==="" ? "CHUYÊN KHOA HCP HỌC": chon_nganh_khoa_phong} </option>
                            {lst_nganh_khoa_phong
                            .filter (el => el.chon_chinh === chon_chuc_vu)
                            .map( (el, index) =>
                            <option key={index} value={el.chon_phu}> {el.chon_phu} </option>
                            )
                            }
                        </Form.Select>

                        {/* Show text input if "KHÁC" is selected */}
                        {chon_nganh_khoa_phong === 'KHÁC' && (
                            <Form.Control
                            required
                            type="text" 
                            placeholder="Vui lòng ghi cụ thể" 
                            className="mt-2"
                            value={chon_nganh_khoa_phong_khac} // Controlled input with the state
                            onChange={(e) => set_chon_nganh_khoa_phong_khac(e.target.value)} // Update state inline on input change
                            />
                        )}

                        <div className="mt-2 border border-1 border-success rounded">
                        {/* if PCL then BV */}
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
                                {chon_hco_pcl ==="" ? "Chọn HCO": chon_hco_pcl}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu" onChange={ (e) => set_search_hco_pcl(e.target.value.toLowerCase()) } value = {search_hco_pcl} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_khc_chon_phu
                                    .filter( el => el.clean_ma_ten_kh.includes(search_hco_pcl) )
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.custid +'-'+ el.custname}> {el.custid +'-'+ el.custname} </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown  className="" autoClose="true" block="true" onSelect = {e => set_chon_chuc_vu_pcl(e)}>
                                
                                <Dropdown.Toggle disabled={!chon_co_code} className="mt-1 bg-white border-0 text-dark text-left flex-grow-1 w-100"  style={{height:"60px"}}> 
                                
                                {chon_chuc_vu_pcl ==="" ? "Chọn Chức Vụ": chon_chuc_vu_pcl}
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

                        {/* {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        } */}

                        <Button disabled={
                        check_trung_sdt === true ||
                        chon_hco_bv === "" ||
                        (chon_phan_loai_hcp === "KP" && Number(so_luot_kham) < 120 )
                        } className='' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN 
                        </Button>

                        {
                        chon_phan_loai_hcp === "KP" && Number(so_luot_kham) < 120 && (
                            <p style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: '1.1em' }}>
                            LỖI: Phân loại KP yêu cầu số lượt khám tối thiểu 120. Vui lòng điều chỉnh.
                            </p>
                        )
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
    }
}


export default Tao_hcp_bv