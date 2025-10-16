/* eslint-disable */
import { useContext, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
// import { Link } from "react-router-dom";
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
    Table,
    // Stack,
    // Dropdown
} from "react-bootstrap";
import ClaimNavTabs from '../components/FormClaimNavTabs'; // adjust the path as needed

// import { Trash } from "react-bootstrap-icons";

function Cong_tac_phi({history}) {
    
    const { generateMonthOptions, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi_hoa_don_misa`)
      if (!response.ok) {
          SetLoading(false)
      }
      else {
      const data = await response.json()
      set_lst_invoices_ve_xe(data['lst_invoices'])
      console.log(data);
      SetLoading(false);

      }
  }

    const f = new Intl.NumberFormat();
    const monthOptions = generateMonthOptions(-2, 2);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {        
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Cong_tac_phi', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data();

        } else {
            history.push('/login?redirect=/formcontrol/cong_tac_phi');
        };
    }, []);
    const [manv, set_manv] = useState("");
    const [search, set_search] = useState("");
    const [lst_invoices_ve_xe,  set_lst_invoices_ve_xe] = useState ([]);
    const [show_chon_hoa_don_ve_xe,  set_show_chon_hoa_don_ve_xe] = useState (false);
    const [lst_chon_invoices_ve_xe,  set_lst_chon_invoices_ve_xe] = useState ([]);
    const [input_data, set_input_data] = useState({
        thang: '',
        tu_ngay: '',
        den_ngay: '',
        tinh: '',
        ve_xe: '',
        ky_hieu_ve_xe: '',
        so_hoa_don_ve_xe: '',
        ngay_hoa_don_ve_xe: '',
        chi_phi_khach_san: '',
        ky_hieu_khach_san: '',
        so_hoa_don_khach_san: '',
        ngay_hoa_don_khach_san: '',
        phu_cap_di_lai: '',
        inserted_at: Inserted_at()
    });

    const clear_data = () => {
            set_input_data({
                thang: '',
                tu_ngay: '',
                den_ngay: '',
                tinh: '',
                ve_xe: '',
                ky_hieu_ve_xe: '',
                so_hoa_don_ve_xe: '',
                ngay_hoa_don_ve_xe: '',
                chi_phi_khach_san: '',
                ky_hieu_khach_san: '',
                so_hoa_don_khach_san: '',
                ngay_hoa_don_khach_san: '',
                phu_cap_di_lai: '',
                inserted_at: '',
            });
        };

  const handle_switch_ve_xe = (e, inv ) => {
    let lst_tong = [];
    for (const record of lst_invoices_ve_xe) {
      let element = Object.assign({}, record); // Clone the object
      if(element.id_duy_nhat_cua_hoa_don === e.target.id) {
          element.check = e.target.checked
        //   element.selected_time = Inserted_at()
          lst_tong.push(element);
      }
      else {
        // void(0);
        lst_tong.push(element);
      }
    }
    set_lst_invoices_ve_xe(lst_tong);

    const selected_invoices = lst_tong.filter(invoice => invoice.check === true);
    set_lst_chon_invoices_ve_xe(selected_invoices);

    console.log("selected_invoices", selected_invoices)

  }

  // Not a recommended way read notes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedRecord = { ...input_data }
    if (name === "phu_cap_di_lai" || name === "chi_phi_khach_san" || name === "ve_xe") {
      updatedRecord[name] = value.replace(/\D/g, '');
    }
    else {
      updatedRecord[name] = value;
    }
    set_input_data(updatedRecord)
  };

    const post_form_data = async (data) => {
        SetLoading(true);
        console.log(input_data);
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_cong_tac_phi/`, {
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
        SetALert(true);
        SetALertType("alert-danger");
        SetALertText("CHƯA TẠO ĐƯỢC");
        setTimeout(() => SetALert(false), 3000);
    } else {
        SetLoading(false);
        const data = await response.json();
        console.log(data);
        SetALert(true);
        SetALertType("alert-success");
        SetALertText("ĐÃ TẠO THÀNH CÔNG");
        setTimeout(() => SetALert(false), 3000);
        clear_data();
    }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "manv":manv,
            ...input_data
        }
        console.log([data]);
        post_form_data([data])
    }

    // if (data_table.length >= 1) {
    if (true) {
    return (
        <Container className="bg-teal-100 h-100" fluid>
            <ClaimNavTabs />
            <Row className="justify-content-center">
                <Col md={5} >
                    <div>
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm" /> Đang tải...</Button>
                        </Modal>

                        {alert &&
                            <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlert(false)}>
                                </button>
                                <span><strong>Cảnh Báo: </strong>{alertText}</span>
                            </div>
                        }

                        <Form onSubmit={handle_submit}>
                            <div className="text-center">

                                  <FloatingLabel label="Tháng" className="border rounded mt-2">
                                    <Form.Select
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="thang"
                                        value={input_data?.thang || ''}
                                        onChange={handleInputChange}
                                    >

                                    <option value="" disabled>Kỳ chi phí KT</option>
                                    {monthOptions.map((option, idx) => (
                                        <option 
                                            key={idx} 
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </FloatingLabel>

                                <FloatingLabel label="Từ ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="tu_ngay"
                                        value={input_data?.tu_ngay || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Đến ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="den_ngay"
                                        value={input_data?.den_ngay || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Tỉnh" className="border rounded mt-2">
                                    <Form.Select
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="tinh"
                                        value={input_data?.tinh || ''}
                                        onChange={handleInputChange}
                                    >
                                    <option>Hồ Chí Minh</option>
                                    <option>Đồng Nai</option>
                                    <option>Bình Dương</option>
                                    </Form.Select>
                                </FloatingLabel>

                                <FloatingLabel label="Phụ cấp đi lại" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="phu_cap_di_lai"
                                        value={f.format(input_data?.phu_cap_di_lai || '')}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Phụ cấp ăn uống" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="phu_cap_an_uong"
                                        value={f.format(input_data?.phu_cap_an_uong || '')}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Khoản mục" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="khoan_muc"
                                        value={(input_data?.khoan_muc || '')}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                    <Button variant="success" onClick={ (e) => set_show_chon_hoa_don_ve_xe(true) } className="mb-2 mt-2 mr-2">Chọn Hóa Đơn Vé Xe ({lst_chon_invoices_ve_xe.length})</Button>
                                    {/* <Button onClick={ (e) => set_show_chon_hoa_don_khach_san(true) } className="mb-2 mt-2">Chọn Hóa Đơn Khách Sạn</Button> */}

                            </div>

                            {/* MODAL Chon Hóa Đơn Vé Xe */}
                            <Modal fullscreen={true} show={show_chon_hoa_don_ve_xe} onHide={ () => set_show_chon_hoa_don_ve_xe(false) }>
                                <Modal.Body>

                                <ListGroup className="mt-2" style={{maxHeight: "250px", overflowY: "auto"}}>
                                    <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm số hóa đơn hoặc ngày hoặc tên NCC (KHONG DAU) " value={search} />
                                    {lst_invoices_ve_xe
                                        .filter( el => el.clean_ten?.toLowerCase().includes( search.toLowerCase() ) )
                                        .sort((a, b) => a.stt - b.stt)
                                        .map( (el, index) =>
                                        <ListGroup.Item style={{ backgroundColor: el.stt === 0 ? 'rgb(254 202 202)' : 'transparent',}} key={index} className="mx-0 px-0 my-0 py-0" >
                                            <Form.Check key={index} className="text-wrap" type="switch" checked={el.check} onChange={ (e) => handle_switch_ve_xe(e, el ) } id={el.id_duy_nhat_cua_hoa_don} label={ el.ten_hien_thi + f.format(el.so_tien_claim) }/>
                                        </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                                </Modal.Body>

                                <Modal.Footer>
                                <Button variant="secondary" onClick={() => {
                                    set_show_chon_hoa_don_ve_xe(false); 
                                    }}>
                                    Đóng
                                </Button>

                                </Modal.Footer>
                            </Modal>

                            <Button
                                disabled={loading}
                                className='mt-2'
                                variant="warning"
                                type="submit"
                                style={{ width: "100%", fontWeight: "bold" }}
                            >
                                LƯU THÔNG TIN
                            </Button>
                            <p>version 1.4(15/10/2025)</p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );

    }
    else {}

}

export default Cong_tac_phi