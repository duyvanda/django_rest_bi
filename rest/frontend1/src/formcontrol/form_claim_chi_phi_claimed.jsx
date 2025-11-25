/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
// import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
    // ButtonGroup,
    Modal,
    Button,
    ListGroup,
    // Col,
    // Row,
    Container,
    Form,
    Spinner,
    // Card,
    FloatingLabel,
    Table
} from "react-bootstrap";
import dayjs from "dayjs";
import { FaDownload } from "react-icons/fa";
import ClaimNavTabs from '../components/FormClaimNavTabs';

import { useNavigate } from "react-router-dom";

const Form_claim_chi_phi_claimed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { generateMonthOptions, get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
      
  // =================================================================
  // 1. CUSTOM HOOK FOR DATA AND STATE MANAGEMENT
  // =================================================================
  const [count, setCount] = useState(0);
  const [data_submit, set_data_submit] = useState([]);
  const [selected_kh, set_selected_kh] = useState({});
  const [search, set_search] = useState("");
  const [show_chon_hoa_don, set_show_chon_hoa_don] = useState(false);

  const [lst_invoices,  set_lst_invoices] = useState ([]);
  const [renderKey, setRenderKey] = useState(0);
  const [show_dieu_chinh_hoa_don, set_show_dieu_chinh_hoa_don] = useState(false);
  const [selected_hoa_don, set_selected_hoa_don] = useState(false);
  const [so_tien_dieu_chinh_hoa_don, set_so_tien_dieu_chinh_hoa_don] = useState(0);
  const [lst_chon_invoices,  set_lst_chon_invoices] = useState ([]);
  const [total_amount,  set_total_amount] = useState (0);

  const f = new Intl.NumberFormat();
  const monthOptions = generateMonthOptions(-2, 2);

  const [manv, set_manv] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [downloadUrl, setDownloadUrl] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
    const media = window.matchMedia('(max-width: 960px)');
    const isMB = (media.matches);
    const dv_width = window.innerWidth;
    userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
    set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
    fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
    }
      else {
        navigate(`/login?redirect=${location.pathname}`);
    };
  }, [count]);

// =================================================================
// 2. HELPER FUNCTIONS
// =================================================================

  const fetch_initial_data = async (manv) => {
    SetLoading(true);
    let api1_url = `https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi_crm_approved/?manv=${manv}&page=invmapped`;
    let api2_url = `https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi_hoa_don_misa`;
    try {
        const [response1, response2] = await Promise.all([
        fetch(api1_url),
        fetch(api2_url),
      ]);
      if (!response1.ok || !response2.ok) {
          throw new Error('One of the API calls failed');
      }
      else {
        const data1 = await response1.json();
        const data2 = await response2.json();
        set_data_submit(data1['lst_da_duyet'])
        set_lst_invoices(data2['lst_invoices'])
        console.log("data1", data1);
        console.log("data2", data2);
      }
    } 
    catch (error) {console.error('Error fetching data:', error);} 
    finally {SetLoading(false);}
  }

    const clear_data = () => {
      set_selected_kh({});
      set_search("");
      set_show_chon_hoa_don(false);
        
      set_selected_kh({});
      set_search("");
      set_show_chon_hoa_don(false);
      set_lst_invoices([]);
      setRenderKey(0);
      set_show_dieu_chinh_hoa_don(false);
      set_selected_hoa_don(false);
      set_so_tien_dieu_chinh_hoa_don(0);
      set_lst_chon_invoices([]);
      set_total_amount(0);
  };
  
  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_form_claim_chi_phi_hoa_don/`, {
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
            // clear_data();
            // setCount(count+1);
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
            clear_data();
            setCount(count+1);
            }, 2000);
        }
}

// =================================================================
// 3. EVENT HANDLERS
// =================================================================

  const handlePlanningNumberChange = (id, newValue) => {
    const updatedRecords = data_submit.map((record) => {
      if (record.id === id) {
        let updatedRecord = { ...record };
        if (Number(newValue) < Number(record.max_ke_hoach)) {
          updatedRecord.so_tien_claim = Number(newValue); // Update the value
          return updatedRecord;
        } else {
          
        window.alert(
          `Đã vượt ngưỡng tối đa của kế hoạch!\n\n` +
          `Đã nhập: ${f.format(newValue)}\n` +
          `Ngưỡng tối đa: ${f.format(record.max_ke_hoach)}`
        );

          return record;
        }
      }
      return record;
    });
    set_data_submit(updatedRecords);
  };
  
  const handleNoteChange = (id, newValue) => {
    const updatedRecords = data_submit.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.ghi_chu = newValue; // Update the value
        return updatedRecord;
      }
      return record;
    });
      set_data_submit(updatedRecords);
  };

  const handle_switch = (e, kh_id, tong_so_tien_claim, inv ) => {
    let lst_tong = [];
    for (const record of lst_invoices) {
      let element = Object.assign({}, record); // Clone the object
      if(element.id_duy_nhat_cua_hoa_don === e.target.id) {
          element.check = e.target.checked
          element.selected_time = Inserted_at()
          lst_tong.push(element);
      }
      else {
        void(0);
        lst_tong.push(element);
      }
    }
    // END FOR
    let lst_selected = lst_tong.filter(invoice => invoice.check);
    console.log("lst_selected", lst_selected)

    const totalAmount = lst_selected.reduce(
      (sum, invoice) => sum + invoice.so_tien_claim,
      0
    );

    if (Number(totalAmount) <= Number(tong_so_tien_claim))
      {
        console.log("ok", totalAmount, tong_so_tien_claim);
        set_lst_invoices(lst_tong);
        set_lst_chon_invoices(lst_selected);
        set_total_amount(totalAmount);
      }
    else {
          setRenderKey(renderKey + 1);
          console.log("not ok", totalAmount, tong_so_tien_claim);
          set_so_tien_dieu_chinh_hoa_don(tong_so_tien_claim - total_amount);
          set_show_dieu_chinh_hoa_don(true);
          set_selected_hoa_don(inv);
    }
  }
  
  const handle_dieu_chinh_so_tien = (id) => {
  const updatedRecords = lst_invoices.map((record) => {
    if (record.id_duy_nhat_cua_hoa_don === id) {
      let updatedRecord = Object.assign({}, record); // Clone the object
      updatedRecord.so_tien_claim = Number(so_tien_dieu_chinh_hoa_don);
      updatedRecord.stt = 0;
      // updatedRecord.check = true;
      return updatedRecord;
    }
    return record;
  });
    set_lst_invoices(updatedRecords);
  };

  const handle_xac_nhan_invoice = async (khid, so_tien_claim, lst_chon_invoices) => {
    SetLoading(true);

    let data = [{
      khid,
      manv,
      so_tien_claim,
      lst_chon_invoices,
      status:"I",
      inserted_at: Inserted_at(),
    }]

    console.log(data);
    post_form_data(data);
  }

  const handleConfirm = async () => {
    SetLoading(true);
    setDownloadUrl("")
    setErrorMessage(""); // Reset error message before new request
    let from_date = toDate.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')
    let to_date = toDate.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')
    const requestData = { from_date, to_date, manv, id:get_id() };
    console.log(requestData)
    try {
      const response = await fetch("https://bi.meraplion.com/local/get_form_claim_chi_phi_excel/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.excel_url) {
        setDownloadUrl(result.excel_url);
      } else {
        throw new Error('No download URL found in response');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setErrorMessage("There was an error processing your request. Please try again later.");
    } finally {
      SetLoading(false);
    }
  }

  // =================================================================
  // 4. UI RENDERING
  // =================================================================

  return (
    <Container className="h-100" fluid> 
      {/* Responsive Full-Width Buttons */}
        <ClaimNavTabs />

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

      <div className="d-flex gap-2 mb-3">
        <Button variant="outline-success" onClick={() => setShowModal(true)}>
          Tải dữ liệu đã được duyệt
        </Button>
      </div>

      <div className="mb-5" style={{ overflowX: 'auto' }}>
      <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }}>
        <thead>
          <tr style={{ padding: '5px', fontSize: '12px' }}>
            <th style={{ width: '80px' }}>KH-ID</th>
            <th style={{ width: '120px' }}>Số tiền tối đa</th>
            <th style={{ width: '120px' }}>Số tiền duyệt</th>
            <th style={{ width: '120px' }}>Số tiền cần TT</th>
            <th style={{ width: '70px' }}>Hóa đơn</th>
            <th style={{ width: '200px' }}>Tên CVBH</th>
            <th style={{ width: '200px' }}>Tên KHC</th>
            <th style={{ width: '200px' }}>Tên HCP</th>
            <th style={{ width: '200px' }}>Quà tặng</th>
            <th style={{ width: '70px' }}>Kênh</th>
            <th style={{ width: '200px' }}>Nội dung</th>
            <th style={{ width: '200px' }}>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data_submit.map((record) => (
            <tr key={record.id} 
              style={{
              padding: '5px', 
              fontSize: '14px', 
              // backgroundColor: OverbudgetIds.includes(record.id) ? 'rgb(254 202 202)' : 'transparent',
              }}
              >
              <td>{record.id.slice(-6)}</td>
              <td>{f.format(record.max_ke_hoach)}</td>
              <td>{f.format(record.approved_so_ke_hoach)}</td>
              <td>
                <Form.Control
                  type="text"
                  value={ f.format(record.so_tien_claim) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                />
              </td>
              
              <td>
                <Button onClick={() => {
                  set_show_chon_hoa_don(true);
                  set_selected_kh(record)
                  }} size="sm">HĐ</Button>
              </td>

              <td>{record.tencvbh}</td>
              <td>{record.pubcustname}</td>
              <td>{record.ten_hcp}</td>
              <td>{record.qua_tang}</td>
              <td>{record.kenh}</td>
              <td>{record.noi_dung}</td>
              <td>
                <Form.Control
                  type="text"
                  value={ record.ghi_chu }
                  onChange={(e) => handleNoteChange(record.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      {/* MODAL Chon Hóa Đơn */}
      <Modal fullscreen={true} show={show_chon_hoa_don} onHide={() => set_show_chon_hoa_don(false)}>
        <Modal.Body>
          <div className="mb-3">
            <h5 className="mb-3 text-primary fw-bold">Thông tin thanh toán</h5>
            <div className="mb-2">
              <span className="text-muted">Số KH-ID: </span>
              <strong>{selected_kh.id + '-' +selected_kh.noi_dung}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Cho NT-BV: </span>
              <strong>{selected_kh.pubcustname}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Cho HCP (Nếu có): </span>
              <strong>{selected_kh.ten_hcp}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Bạn muốn thanh toán: </span>
              <strong className="text-success">{f.format(selected_kh.so_tien_claim)}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">Bạn đã chọn: </span>
              <strong className="text-info">{f.format(total_amount)}</strong>
            </div>
            <div className="mb-2">
              <span className="text-muted">CL: </span>
              <strong className="text-info">{f.format(selected_kh.so_tien_claim - total_amount)}</strong>
            </div>
          </div>

          <ListGroup key={renderKey} className="mt-2" style={{maxHeight: "250px", overflowY: "auto"}}>
              <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm số hóa đơn hoặc ngày hoặc tên NCC (KHONG DAU) " value={search} />
              {lst_invoices
                  .filter( el => el.clean_ten.toLowerCase().includes( search.toLowerCase() ) )
                  .sort((a, b) => a.stt - b.stt)
                  .map( (el, index) =>
                  <ListGroup.Item style={{ backgroundColor: el.stt === 0 ? 'rgb(254 202 202)' : 'transparent',}} key={index} className="mx-0 px-0 my-0 py-0" >
                      <Form.Check key={index} className="text-wrap" type="switch" checked={el.check} onChange={ (e) => handle_switch(e, selected_kh.id, selected_kh.so_tien_claim, el ) } id={el.id_duy_nhat_cua_hoa_don} label={ el.ten_hien_thi + f.format(el.so_tien_claim) }/>
                  </ListGroup.Item>
                  )
              }
          </ListGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
              set_show_chon_hoa_don(false); 
              set_lst_chon_invoices([]);
                const resetInvoices = lst_invoices.map(invoice => ({
                ...invoice, 
                check: false
              }));
              set_lst_invoices(resetInvoices);
              }}>
            Đóng
          </Button>
          <Button variant="primary" onClick={ () => handle_xac_nhan_invoice(selected_kh.id, selected_kh.so_tien_claim,  lst_chon_invoices) } disabled={loading} >
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show_dieu_chinh_hoa_don} onHide={() => {set_show_dieu_chinh_hoa_don(false);set_so_tien_dieu_chinh_hoa_don(0)}}>
        <Modal.Header closeButton>
          <Modal.Title>Hóa đơn chọn đã vượt quá số tiền, vui lòng điều chỉnh và chọn lại</Modal.Title>
        </Modal.Header>
        <Modal.Body>Số tiền còn lại: {f.format(selected_kh.so_tien_claim - total_amount)}</Modal.Body>
        <Form>
            <Form.Group className="mb-3 ml-3">
              <Form.Label>Điều chỉnh thành:</Form.Label>
              <Form.Control
                type="text"
                value={f.format(so_tien_dieu_chinh_hoa_don)}
                onChange={(e) => set_so_tien_dieu_chinh_hoa_don(e.target.value.replace(/\D/g, ""))}
                // onChange={(e) => handle_dieu_chinh_so_tien(selected_hoa_don.id_duy_nhat_cua_hoa_don, e.target.value.replace(/\D/g, ""))}
              />
            </Form.Group>
        </Form>
        <Button onClick={()=> {
          handle_dieu_chinh_so_tien(selected_hoa_don.id_duy_nhat_cua_hoa_don); 
          set_show_dieu_chinh_hoa_don(false);
          }
          } variant="outline-info">Điều chỉnh</Button>
      </Modal>

      {/* MODAL Excel */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn khoảng thời gian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group className="mb-3">
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group> */}

            <FloatingLabel label="Tháng" className="border rounded mt-2">
              <Form.Select
                  required
                  className=""
                  placeholder=""
                  type="date"
                  name="ky_chi_phi_kt"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
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

            {downloadUrl && (
            <div className="mt-3">
              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-success d-flex align-items-center"
                style={{ padding: "10px 20px", textDecoration: "none" }}
              >
                <FaDownload className="mr-2" /> Tải xuống dữ liệu
              </a>
            </div>
          )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading} >
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Tải data"}
          </Button>
        </Modal.Footer>
      </Modal>
    
    </Container>
  );
};

export default Form_claim_chi_phi_claimed;