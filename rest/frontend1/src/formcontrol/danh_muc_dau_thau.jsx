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
} from "react-bootstrap";

function Danh_muc_dau_thau({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial = async () => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/select_du_thau_chi_thuy/`)
        const data = await response.json();
        set_fix_data(data);
        set_lst_phap_ly(data.phap_ly);
        set_lst_khu_vuc(data.khu_vuc);
        set_lst_tinh(data.tinh_viet_hoa);
        set_lst_ten_quan_ly_tt(data.ten_quan_ly_tt);
        set_lst_hinh_thuc_thau(data.hinh_thuc_thau);
        set_lst_kh(data.lst_kh);
        set_lst_item(data.lst_item);
        SetLoading(false);
        }
    
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Danh_muc_dau_thau', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial()

        } else {
            history.push('/login');
        };
    }, []);

    const f = new Intl.NumberFormat()
    const [EDITMODE, SET_EDITMODE] = useState(false);
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [fix_data, set_fix_data] = useState({});
    const [id, set_id] = useState("");
    const [phap_ly, set_phap_ly] = useState("");
    const [lst_phap_ly, set_lst_phap_ly] = useState([]);
    const [khu_vuc, set_khu_vuc] = useState("");
    const [lst_khu_vuc, set_lst_khu_vuc] = useState([]);
    const [tinh, set_tinh] = useState("");
    const [lst_tinh, set_lst_tinh] = useState([]);
    const [ten_quan_ly_tt, set_ten_quan_ly_tt] = useState("");
    const [lst_ten_quan_ly_tt, set_lst_ten_quan_ly_tt] = useState([]);
    const [hinh_thuc_thau, set_hinh_thuc_thau] = useState("");
    const [lst_hinh_thuc_thau, set_lst_hinh_thuc_thau] = useState([]);
    const [search_kh, set_search_kh] = useState("");
    const [kh, set_kh] = useState("");
    const [lst_kh, set_lst_kh] = useState([]);
    const [ten_goi_thau, set_ten_goi_thau] = useState("");
    const [phan_tram_bao_lanh, set_phan_tram_bao_lanh] = useState("");
    const [so_ngay_bao_lanh, set_so_ngay_bao_lanh] = useState("");
    const [ngay_het_hieu_luc_bao_lanh, set_ngay_het_hieu_luc_bao_lanh] = useState(current_date);
    const [hs_t, set_hs_t] = useState("");
    const [ngay_het_hieu_luc_cktd, set_ngay_het_hieu_luc_cktd] = useState(current_date);
    const [ngay_dong_thau, set_ngay_dong_thau] = useState(current_date);
    const [hlhd, set_hlhd] = useState("");
    const [nguoi_thuc_hien, set_nguoi_thuc_hien] = useState("");

    // MULTI ITEMS
    const [lst_item, set_lst_item] = useState([]); // ĐỂ SELECT
    const [lst_cart, set_lst_cart] = useState([]);
    const [invtid, set_invtid] = useState("");
    const [nhom_dkt, set_nhom_dkt] = useState("");
    const [sl, set_sl] = useState("");
    const [don_gia, set_don_gia] = useState(""); 

    const [text, set_text] = useState("");
    const [item_uuid, set_item_uuid] = useState("");
    const [edit_sp, set_edit_sp] = useState(false);

    const URL = EDITMODE ? 'ABC' : 'XYZ'

    const handle_id_enter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            fetch_id_data(e.target.value);
            set_text(e.target.value);
        }
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
        set_text(data.id)
        console.log(data)
        SetLoading(false)

        }
    }

    const on_click_them_san_pham = (e) => {
        const arr2 = [...lst_cart];
        const data = {
            "uuid": item_uuid ==="" ? uuid() : item_uuid,
            "invtid":invtid,
            "nhom_dkt":nhom_dkt,
            "sl":Number(sl),
            "don_gia":Number(don_gia),
            "active":true
        }
        
        arr2.push(data);
        console.log("on_click_them_san_pham", arr2)
        set_lst_cart(arr2);
        set_item_uuid("");
        set_invtid("");
        set_sl("");
        set_nhom_dkt("");
        set_don_gia("");
        set_edit_sp(false)
    }


    const on_click_xoa_san_pham = (data, _) => {
        const arr2 = []
        for (const [_, element] of lst_cart.entries()) {
            if(element.sp_id === data.sp_id) {
                element.active = false
                arr2.push(element);
            }
            else {
                arr2.push(element);
            }
        }
        console.log("on_click_xoa_san_pham", arr2)
        set_lst_cart(arr2);
    }

    const on_click_edit_san_pham = (el, _) => {
        document.getElementById("IDSP").focus();
        set_item_uuid(el.uuid);
        set_invtid(el.invtid);
        set_sl(el.sl);
        set_don_gia(el.don_gia);
        set_nhom_dkt(el.nhom_dkt);
        set_edit_sp(!edit_sp);
        on_click_xoa_san_pham(el);

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

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());
        const data = {
            // "manv":manv,
            // "current_date":current_date,
            // "text":text,
            // "list_item": lst_item,
            // "lst_value_dd1": lst_value_dd1
        }
        console.log(data);
        // post_form_data(data);
        // set_text("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >
                    <Button size="sm" variant="light" onClick={e => SET_EDITMODE(!EDITMODE) } active={!EDITMODE}> CHỈNH SỬA ? </Button>

                    {EDITMODE &&
                    <Form.Control className="mt-2 text-truncate" type="text" onKeyDown={ handle_id_enter } onChange={ (e) => set_id(e.target.value) } value = {id} placeholder="Tìm Số ID" />
                    }

                    <div>
                        <h3>{  EDITMODE ? 'FORM EDIT' : 'FORM CREATE' }</h3>

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
                        
                        {/* ID */}
                        <FloatingLabel label="ID" className="border rounded" > <Form.Control disabled={EDITMODE} required type="text" placeholder="" className="" onChange={ (e) => set_id(e.target.value) } value = {id}/> </FloatingLabel>
                                                
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_phap_ly(e.target.value) }>
                            <option value="">Pháp Lý</option>
                            {lst_phap_ly
                            .map( (el, index) => 
                            <option value={el}> {el} </option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_khu_vuc(e.target.value) }>
                            <option value="">Khu Vực</option>
                            {lst_khu_vuc
                            .map( (el, index) => 
                            <option value={el}>{el}</option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_tinh(e.target.value) }>
                            <option value="">Tỉnh</option>
                            {lst_tinh
                            .map( (el, index) => 
                            <option value={el}>{el}</option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_ten_quan_ly_tt(e.target.value) }>
                            <option value="">QLKV</option>
                            {lst_ten_quan_ly_tt
                            .map( (el, index) => 
                            <option value={el}>{el}</option>
                            )
                            }
                        </Form.Select>

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_hinh_thuc_thau(e.target.value) }>
                            <option value="">HÌNH THỨC THẦU</option>
                            {lst_hinh_thuc_thau
                            .map( (el, index) => 
                            <option value={el}>{el}</option>
                            )
                            }
                        </Form.Select>

                        <InputGroup className="mt-2 d-flex" style={{height:"60px"}}>
                            <InputGroup.Text className=" w150px bg-secondary text-white text-wrap text-left">KHÁCH HÀNG</InputGroup.Text>                       
                            <Dropdown className="d-inline mt-2 w150px" autoClose="true" block="true" onSelect = {e =>set_kh(e)}>
                                <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1"> 
                                {kh ==="" ? "Bấm Để Chọn": kh}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm Giá Trị" onChange={ (e) => set_search_kh(e.target.value) } value = {search_kh} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_kh
                                    .filter( el => el.ma_va_ten.includes(search_kh))
                                    .slice(0,10)
                                    .map( (el, index) =>
                                        <>
                                        <Dropdown.Item key={index} eventKey={el.custid}> {el.ma_va_ten} </Dropdown.Item>
                                        </>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>                  
                        </InputGroup>

                        <FloatingLabel label="TÊN GÓI THẦU" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_ten_goi_thau(e.target.value) } value = {ten_goi_thau}/> </FloatingLabel>
                        <FloatingLabel label="PHẦN TRĂM BẢO LÃNH (FROM 0->100) " className="border rounded mt-2" > <Form.Control required type="number" min="0" max="100" className="" placeholder="" onChange={ (e) => set_phan_tram_bao_lanh(e.target.value) } value = {phan_tram_bao_lanh}/> </FloatingLabel>
                        <FloatingLabel label="SỐ NGÀY BẢO LÃNH" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_so_ngay_bao_lanh(e.target.value) } value = {so_ngay_bao_lanh}/> </FloatingLabel>
                        <FloatingLabel label="NGÀY HẾT HIỆU LỰC BẢO LÃNH" className="border rounded mt-2" > <Form.Control required type="date" className="" placeholder="" onChange={ (e) => set_ngay_het_hieu_luc_bao_lanh(e.target.value) } value = {ngay_het_hieu_luc_bao_lanh}/> </FloatingLabel>
                        <FloatingLabel label="HS (T)" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_hs_t(e.target.value) } value = {hs_t}/> </FloatingLabel>
                        <FloatingLabel label="NGÀY HẾT HIỆU LỰC CKTD" className="border rounded mt-2" > <Form.Control required type="date" className="" placeholder="" onChange={ (e) => set_ngay_het_hieu_luc_cktd(e.target.value) } value = {ngay_het_hieu_luc_cktd}/> </FloatingLabel>
                        <FloatingLabel label="NGÀY ĐÓNG THẦU" className="border rounded mt-2" > <Form.Control required type="date" className="" placeholder="" onChange={ (e) => set_ngay_dong_thau(e.target.value) } value = {ngay_dong_thau}/> </FloatingLabel>
                        <FloatingLabel label="HLHĐ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_hlhd(e.target.value) } value = {hlhd}/> </FloatingLabel>
                        <FloatingLabel label="NGƯỜI THỰC HIỆN" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_nguoi_thuc_hien(e.target.value) } value = {nguoi_thuc_hien}/> </FloatingLabel>


                        
                        {/* ADD MULTIPLE ITEMS WITH THE SAME ID */}

                        <div className="mt-3 p-1 border border-2 border-success rounded">

                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_invtid(e.target.value) }>
                            <option value="">Sản Phẩm</option>
                            {lst_item
                            .map( (el, index) => 
                            <option key={index} value={el.invtid}>{el.invtid +" - "+ el.descr1}</option>
                            )
                            }
                        </Form.Select>
                        <Form.Control readOnly id="" type="text" className="mt-2" placeholder="CHỌN LẠI SP KHÁC" value = {invtid}/>
                        <FloatingLabel label="NHÓM ĐKT" className="border rounded mt-2" > <Form.Control id="IDSP" type="text" className="" placeholder="" onChange={ (e) => set_nhom_dkt(e.target.value) } value = {nhom_dkt}/> </FloatingLabel>
                        <FloatingLabel label="SỐ LƯỢNG" className="border rounded mt-2" > <Form.Control  type="number" className="" placeholder="SỐ LƯỢNG" onChange={ (e) => set_sl(e.target.value) } value = {sl}/> </FloatingLabel>
                        <FloatingLabel label="ĐƠN GIÁ" className="border rounded mt-2" > <Form.Control type="number" className="" placeholder="GHI CHÚ" onChange={ (e) => set_don_gia(e.target.value) } value = {don_gia}/> </FloatingLabel>
                        
                        {!edit_sp ? (
                            <>
                            <Button disabled={ sl==="" | invtid==="" | don_gia===""} size="sm" variant="success" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            + SP
                            </Button>
                            </>
                        )
                        :(    
                            <Button disabled={ sl==="" | invtid==="" | don_gia===""} size="sm" variant="danger" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            UPDATE
                            </Button>
                        )
                        }

                        {!edit_sp && (
                        
                            lst_cart
                            .filter( el => el.active === true)
                            .map( (el, index) =>                                
                                <InputGroup key={index} className="ml-1">
                                    <Button  className="font-weight-bold w75px" variant="outline-danger" onClick={ () => on_click_xoa_san_pham(el, index) } > Xóa </Button>
                                    <Button  className="font-weight-bold w75px" variant="outline-success" onClick={ () => on_click_edit_san_pham(el, index) } > Edit </Button> 
                                    <Form.Control readOnly type="text" className="" placeholder=""  value = {el.invtid}/>
                                    <Form.Control readOnly type="number" className="" placeholder=""  value = { f.format(el.sl) }/>
                                    <Form.Control readOnly type="text" className="" placeholder=""  value = { f.format(el.don_gia) }/>
                                    <Form.Control readOnly type="text" className="" placeholder=""  value = {el.nhom_dkt}/>
                                </InputGroup>
                            )
                        )
                        }

                        </div >
                        
                        <Button disabled={edit_sp} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
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

export default Danh_muc_dau_thau