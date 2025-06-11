/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
    // ButtonGroup,
    Modal,
    Button,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Card,
    Table
} from "react-bootstrap";
import dayjs from "dayjs";
import { FaDownload } from "react-icons/fa";
import ClaimNavTabs from '../components/FormClaimNavTabs'; // adjust the path as needed

const Form_claim_chi_phi_final = ( {history} ) => {
    const location = useLocation();
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi_final/?manv=${manv}`)
      if (!response.ok) {
          SetLoading(false)
      }
      else {
      const data = await response.json()
      set_data_submit(data['data_submit'])
      set_invoices(data['data_hoa_don'])
      // set_data_hcp(data['data_hcp'])
      // set_manv_info(data['manv_info'][0])
      console.log(data);
      SetLoading(false);

      }
  }
    
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, [count]);

    const [data_submit, set_data_submit] = useState([])
    // const [hoa_don, set_hoa_don] = useState([])

    const [invoices,  set_invoices] = useState ([
      { nguoi_mua_hang: "MR0673", ky_hieu: "K25TDL", so_hoa_don: "63182", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 681855},
      { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19298", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 3592906},
      { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19299", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 4163723},
      { nguoi_mua_hang: "MR0673", ky_hieu: "K25TDL", so_hoa_don: "63182", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 681855},
      { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19298", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 3592906},
      { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19299", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 4163723}
    ]);
    
  const f = new Intl.NumberFormat()
  const [manv, set_manv] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [downloadUrl, setDownloadUrl] = useState("");
  const [spinning, setSpinning] = useState(false);  // Replaced `loading` with `spinning`
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [disable, setdisable] = useState(false); // State to track if submit button should be disabled

  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/insert_form_claim_chi_phi_final/`, {
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
        // clear_data();
        setCount(count+1);

    }
}

  const handleApproval = async () => {
    // const ql_duyet = isApproved ? "approved" : "rejected"
    // Create a new list of records with updated status
    const updatedRecords = data_submit.map((record) => {
      if (record.so_hoa_don) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.status = "invmapped"; // Update status
        return updatedRecord;
      }
      return record;
    });
  
    // Update state with the modified records list
    set_data_submit(updatedRecords);
    console.log(updatedRecords)
    post_form_data(updatedRecords);

  };
  

  const handlePlanningNumberChange = (id, newValue) => {
    // Create a new list of records
    const updatedRecords = data_submit.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.so_ke_hoach = newValue; // Update the value
        return updatedRecord;
      }
      return record;
    });
  
    // Update state
    set_data_submit(updatedRecords);
  };
  
  const handleInvoiceChange = (id, selectedInvoice) => {
    const updatedRecords = data_submit.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.so_ke_hoach = selectedInvoice.so_tien_hoa_don;
        updatedRecord.so_hoa_don = selectedInvoice.so_hoa_don;
        updatedRecord.so_tien_hoa_don = selectedInvoice.so_tien_hoa_don;
        updatedRecord.ngay_hoa_don = selectedInvoice.ngay_hoa_don;
        return updatedRecord;
      }
      return record;
    });
    set_data_submit(updatedRecords);
  };

  const handleNoteChange = (id, newValue) => {
    // Create a new list of records
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

  const handleConfirm = async () => {
    setSpinning(true);
    setDownloadUrl("")
    setErrorMessage(""); // Reset error message before new request
    const requestData = { fromDate, toDate, manv, id:get_id() };
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
      setSpinning(false);
    }
  }

    // Step 1: Group by invoice_number
    const groupByInvoiceNumber = data_submit.reduce((groups, { so_hoa_don, ...rest }) => {
      groups[so_hoa_don] = groups[so_hoa_don] || [];
      groups[so_hoa_don].push({ so_hoa_don, ...rest });
      return groups;
    }, {});
  
    // Step 2: For each group, calculate the total claim money, total_claim_money, and determine overbudget
    const data_submit_check_invoice_budget = data_submit.map(item => {
      // Ensure claim_money is treated as a number
      const totalClaimMoney = groupByInvoiceNumber[item.so_hoa_don].reduce((sum, { so_ke_hoach }) => {
        return sum + Number(so_ke_hoach); // Ensure each claim_money is a number before summing
      }, 0);
  
      // Handle cases where invoice_number_original_budget is invalid, empty, or NaN
      const budget = isNaN(item.so_tien_hoa_don) || item.so_tien_hoa_don === "" 
                      ? 0 
                      : Number(item.so_tien_hoa_don); // Ensure the budget is a number
  
      // Flag to determine if the record is over budget
      const overbudget = (budget > 0 && totalClaimMoney > budget) ? 1 : 0;
  
      return { ...item, total_claim_money: totalClaimMoney, overbudget };
    });

  /*
  {"recordid":1,"claim_money":"300000","invoice_number":2,"invoice_number_original_budget":1000000,"total_claim_money":1100000,"overbudget":1}
  {"recordid":2,"claim_money":"300000","invoice_number":2,"invoice_number_original_budget":1000000,"total_claim_money":1100000,"overbudget":1}
  {"recordid":3,"claim_money":500000,"invoice_number":2,"invoice_number_original_budget":1000000,"total_claim_money":1100000,"overbudget":1}
  {"recordid":4,"claim_money":500000,"invoice_number":3,"invoice_number_original_budget":600000,"total_claim_money":500000,"overbudget":0}
  {"recordid":5,"claim_money":"500000","invoice_number":3,"invoice_number_original_budget":"","total_claim_money":500000,"overbudget":0}
  */

  useEffect(() => {
    // Check if any record has overbudget flag set to 1
    const isAnyOverBudget = data_submit_check_invoice_budget.some(item => item.overbudget === 1);
    setdisable(isAnyOverBudget); // Disable button if any record is overbudget
    console.log("isAnyOverBudget", isAnyOverBudget)
  }, [data_submit_check_invoice_budget]); // Re-run when `updatedData` changes (i.e., when user updates data)

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
        <Button disabled={disable} variant="success" onClick={() => handleApproval()}>
          Gửi đề nghị
        </Button>
        <Button variant="outline-success" onClick={() => setShowModal(true)}>
          Tải dữ liệu đã được duyệt
        </Button>
      </div>

      <div className="mb-5" style={{ overflowX: 'auto' }}>
      <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }}>
        <thead>
          <tr style={{ padding: '5px', fontSize: '12px' }}>
            <th style={{ width: '80px' }}>ID</th>
            <th style={{ width: '150px' }}>Số tiền cần TT</th>
            <th style={{ width: '300px' }}>Hóa đơn</th>
            <th style={{ width: '100px' }}>Số hóa đơn</th>
            <th style={{ width: '100px' }}>Ngày hóa đơn</th>
            <th style={{ width: '100px' }}>Tiền hóa đơn</th>
            <th style={{ width: '70px' }}>Status</th>
            {/* <th style={{ width: '70px' }}>Mã NV</th> */}
            <th style={{ width: '150px' }}>Tên CVBH</th>
            <th style={{ width: '150px' }}>Tên KHC</th>
            <th style={{ width: '150px' }}>Tên HCP</th>
            <th style={{ width: '150px' }}>Quà tặng</th>
            <th style={{ width: '70px' }}>Kênh</th>
            <th style={{ width: '200px' }}>Nội dung</th>
            <th style={{ width: '200px' }}>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data_submit_check_invoice_budget.map((record) => (
            <tr key={record.id} style={{ 
              padding: '5px', 
              fontSize: '14px', 
              backgroundColor: (record.overbudget === 1 && record.so_hoa_don) ? 'red' : 'transparent' } }>
              <td>{record.id.substring(0, 8)}</td>
              <td>
                <Form.Control
                  type="text"
                  value={ f.format(record.so_ke_hoach) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                />
              </td>
              
              <td>
                <Select
                  options={invoices}
                  getOptionValue={(el) => el.so_hoa_don}
                  getOptionLabel={(el) => `${el.so_hoa_don} - ${f.format(el.so_tien_hoa_don)} - ${el.ngay_hoa_don}`}
                  value={invoices.find((inv) => inv.so_hoa_don === record.so_hoa_don) || null}
                  onChange={(selectedInvoice) => handleInvoiceChange(record.id, selectedInvoice)}
                  isSearchable
                  placeholder="Chọn hóa đơn"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#f0f8ff",
                    }),
                    placeholder: (base) => ({ ...base, color: "#212529" }),
                  }}
                />
              </td>

              <td>{record.so_hoa_don}</td>
              <td>{record.ngay_hoa_don}</td>
              <td>{ f.format(record.so_tien_hoa_don) }</td>

              <td>{record.status}</td>
              {/* <td>{record.manv}</td> */}
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

      {/* MODAL */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn khoảng thời gian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
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
            </Form.Group>
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
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </Container>
  );
};

export default Form_claim_chi_phi_final;


