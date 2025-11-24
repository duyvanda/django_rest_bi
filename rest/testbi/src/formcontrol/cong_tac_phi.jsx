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
    
    const { get_id, generateMonthOptions, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi_hoa_don_misa`)
      if (!response.ok) {
          SetLoading(false)
      }
      else {
        const data = await response.json()
        let invoices = data['lst_invoices']
        const updatedInvoices = invoices.map(el => ({
        ...el,
        cost_type: null,
        }));

      set_lst_invoices(updatedInvoices)
      console.log(data);
      SetLoading(false);

      }
  }

    const f = new Intl.NumberFormat();
    const monthOptions = generateMonthOptions(-2, 2);


    const [count, setCount] = useState(0);
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
    }, [count]);
    const [manv, set_manv] = useState("");
    const [search, set_search] = useState("");
    const [lst_invoices,  set_lst_invoices] = useState ([]);
    const [show_chon_hoa_don,  set_show_chon_hoa_don] = useState (false);

    const [lst_chon_invoices,  set_lst_chon_invoices] = useState ([]);
    const [total_hotel_cost,  set_total_hotel_cost] = useState (0);
    const [total_transport_cost,  set_total_transport_cost] = useState (0);

    const [input_data, set_input_data] = useState({
                ky_chi_phi_kt: '',
                tu_ngay: '',
                den_ngay: '',
                tinh: '',
                phu_cap_di_lai: '',
                phu_cap_an_uong: '',
                khoan_muc: '',
                inserted_at: ''
    });

    const clear_data = () => {
            set_input_data({
                ky_chi_phi_kt: '',
                tu_ngay: '',
                den_ngay: '',
                tinh: '',
                phu_cap_di_lai: '',
                phu_cap_an_uong: '',
                khoan_muc: '',
                inserted_at: '',
            });

            set_lst_chon_invoices([]);
            set_total_hotel_cost(0);
            set_total_transport_cost(0);
        };

  const handle_switch = (e, new_type='transport' ) => {

    console.log(e.target.name, e.target.checked, e.target.id)
    let lst_tong = [];
    for (const record of lst_invoices) {
      let element = Object.assign({}, record);
      if(element.id_duy_nhat_cua_hoa_don === e.target.id) {
				element.check = e.target.checked
					if (e.target.checked === true) {
						element.cost_type = new_type
					}
					else {element.cost_type = null}
				lst_tong.push(element);
      }
      else {
        lst_tong.push(element);
      }
    }
    set_lst_invoices(lst_tong);
    const selected_invoices = lst_tong.filter(invoice => invoice.check === true);
    set_lst_chon_invoices(selected_invoices);
    console.log("selected_invoices", selected_invoices)


    // 💰 Calculate totals by cost type
    const total_transport_cost = selected_invoices
    .filter(inv => inv.cost_type === "transport")
    .reduce((sum, inv) => sum + (inv.so_tien_claim || 0), 0);
    set_total_transport_cost(total_transport_cost);

    const total_hotel_cost = selected_invoices
    .filter(inv => inv.cost_type === "hotel")
    .reduce((sum, inv) => sum + (inv.so_tien_claim || 0), 0);
    set_total_hotel_cost(total_hotel_cost);
  }

  // Not a recommended way read notes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedRecord = { ...input_data }
    if (name === "phu_cap_di_lai" || name === "chi_phi_khach_san" || name === "phu_cap_an_uong" || name === "ve_xe") {
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
        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_form_cong_tac_phi/`, {
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

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const cloned_input_data = structuredClone(input_data);
        cloned_input_data['inserted_at'] = Inserted_at();
        const data = {
            "khid":"CTP"+get_id(),
            "manv":manv,
            "lst_chon_invoices": lst_chon_invoices,
            "tong_tien_ve_xe": total_transport_cost,
            "tong_tien_khach_san": total_hotel_cost,
            ...cloned_input_data
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
                            <div className="text-center">

                                  <FloatingLabel label="Tháng" className="border rounded mt-2">
                                    <Form.Select
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="ky_chi_phi_kt"
                                        value={input_data?.ky_chi_phi_kt || ''}
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
                                    <option value={""}>Chọn Tỉnh</option>
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

                                    <Button variant="success" onClick={ (e) => set_show_chon_hoa_don(true) } className="mb-2 mt-2 mr-2">Chọn Hóa Đơn Vé Xe Hoặc KS ({lst_chon_invoices.length})</Button>
                                    {/* <Button onClick={ (e) => set_show_chon_hoa_don(true) } className="mb-2 mt-2">Chọn Hóa Đơn Khách Sạn</Button> */}

                            </div>

                            {/* MODAL Chon Hóa Đơn Vé Xe */}
                            <Modal fullscreen={true} show={show_chon_hoa_don} onHide={ () => set_show_chon_hoa_don(false) }>
                                <Modal.Body>

                                <div className="mb-3">
                                    <h5 className="mb-3 text-primary fw-bold">Thông tin thanh toán</h5>
                                    <div className="mb-2">
                                    <span className="text-muted">Tiền vé xe: </span>
                                    <strong>{ f.format(total_transport_cost) }</strong>
                                    </div>
                                    <div className="mb-2">
                                    <span className="text-muted">Tiền KS: </span>
                                    <strong>{f.format(total_hotel_cost)}</strong>
                                    </div>
                                </div>

                            <ListGroup className="mt-2" style={{
                                // maxHeight: "700px",
                                overflowY: "auto"
                            }}>
                            <Form.Control
                                type="text"
                                onChange={(e) => set_search(e.target.value)}
                                placeholder="Tìm số hóa đơn hoặc ngày hoặc tên NCC (KHONG DAU)"
                                value={search}
                            />

                            {lst_invoices
                                .filter((el) => el.clean_ten?.toLowerCase().includes(search.toLowerCase()))
                                .sort((a, b) => a.stt - b.stt)
                                .map((el, index) => (
                                <ListGroup.Item
                                    key={index}
                                    style={{
                                    backgroundColor: el.stt === 0 ? "rgb(254 202 202)" : "transparent",
                                    }}
                                    className="px-2 py-2"
                                >
                                    {/* Switch to select invoice */}
                                    <Form.Check
                                    type="switch"
                                    checked={el.check}
                                    name="switch"
                                    onChange={(e) => handle_switch(e)}
                                    id={el.id_duy_nhat_cua_hoa_don}
                                    label={`${el.ten_hien_thi} ${f.format(el.so_tien_claim)}`}
                                    className="text-wrap fw-semibold"
                                    />

                                    {/* Cost type radios BELOW label — always visible */}
                                    <div className="d-flex gap-3 ps-0 mt-0">
                                    <Form.Check
                                        type="radio"
                                        id={el.id_duy_nhat_cua_hoa_don}
                                        name={`cost-type-${el.id_duy_nhat_cua_hoa_don}`}
                                        label="Hotel"
                                        checked={el.cost_type === "hotel"}
                                        onChange={(e) => handle_switch(e, "hotel")}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id={el.id_duy_nhat_cua_hoa_don}
                                        name={`cost-type-${el.id_duy_nhat_cua_hoa_don}`}
                                        label="Xe"
                                        checked={el.cost_type === "transport"}
                                        onChange={(e) => handle_switch(e, "transport")}
                                    />
                                    </div>
                                </ListGroup.Item>
                                ))}
                            </ListGroup>


                            </Modal.Body>

                                <Modal.Footer>
                                <Button variant="secondary" onClick={() => {
                                    set_show_chon_hoa_don(false); 
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