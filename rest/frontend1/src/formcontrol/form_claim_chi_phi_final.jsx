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
// import initSqlJs from 'sql.js';

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
        }
          else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, [count]);

    const [data_submit, set_data_submit] = useState([]);
    const [debouncedDataSubmit, setDebouncedDataSubmit] = useState([]);
    const [isDebouncing, setIsDebouncing] = useState(false);

      // NEW useEffect: Debounce data_submit changes
    useEffect(() => {
      setIsDebouncing(true);
      const handler = setTimeout(() => {
        setDebouncedDataSubmit(data_submit);
        setIsDebouncing(false); // Kết thúc debounce: kích hoạt lại nút
      }, 1500); // 1500ms debounce delay

      // Cleanup function: clear timeout if data_submit changes before the delay
      return () => {
        clearTimeout(handler);
      };
    }, [data_submit]); // Chạy lại hiệu ứng này bất cứ khi nào data_submit thay đổi

  const [invoices,  set_invoices] = useState ([]);
  // const [selected_invoices, set_selected_invoices] = useState([]);
  const f = new Intl.NumberFormat();
  const [manv, set_manv] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [downloadUrl, setDownloadUrl] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [disable, setdisable] = useState(false);
  const [OverbudgetIds, setOverbudgetIds] = useState([]);



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

const handleApproval = async (idToApprove) => {
  let record_to_post = null; // Initialize a variable to hold the selected record

  const updatedRecords = data_submit.map((record) => {
    if (record.id === idToApprove) {
      let updatedRecord = Object.assign({}, record);
      updatedRecord.status = "invmapped";
      record_to_post = updatedRecord; // Assign the updated record to the variable
      return updatedRecord;
    }
    return record;
  });

  if (record_to_post && record_to_post.so_hoa_don && record_to_post.so_hoa_don.length >= 1)
  {
      post_form_data([record_to_post]);
      console.log("Posting selected record:", record_to_post);
  } else {
    console.warn("No record found with ID to post:", idToApprove);
  }
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
  
  // const handleInvoiceChange = (id, selectedInvoice) => {
  //   const updatedRecords = data_submit.map((record) => {
  //     if (record.id === id) {
  //       let updatedRecord = Object.assign({}, record);
  //       updatedRecord.so_ke_hoach = selectedInvoice.so_tien_hoa_don;
  //       updatedRecord.so_hoa_don = selectedInvoice.so_hoa_don;
  //       updatedRecord.so_tien_hoa_don = selectedInvoice.so_tien_hoa_don;
  //       updatedRecord.ngay_hoa_don = selectedInvoice.ngay_hoa_don;
  //       return updatedRecord;
  //     }
  //     return record;
  //   });
  //   set_data_submit(updatedRecords);
  // };

const handleInvoiceChange = (id, selectedInvoices) => {
  const updatedRecords = data_submit.map((record) => {
    if (record.id === id) {
      // Map over the array of selected invoices to get the required data for each
      const newInvoiceDetails = selectedInvoices ? selectedInvoices.map( (invoice, index) => ({
        so_hoa_don: invoice.so_hoa_don,
        so_tien_hoa_don: invoice.so_tien_hoa_don,
        ngay_hoa_don: invoice.ngay_hoa_don,
        index: index + 1
      })) : [];

      // Calculate the total sum of so_tien_hoa_don from selected invoices
      // This can be used for so_ke_hoach and/or so_tien_hoa_don if you choose to sum them.
      const totalSoTienHoaDon = newInvoiceDetails.reduce((sum, invoice) => sum + (invoice.so_tien_hoa_don || 0), 0);

        return {
          ...record,
          // Store an array of objects, each containing the invoice number and amount
          so_hoa_don: newInvoiceDetails,
          // Update so_ke_hoach to reflect the total of selected invoices
          so_ke_hoach: totalSoTienHoaDon,
          // Keep so_tien_hoa_don as the sum of selected invoices
          so_tien_hoa_don: totalSoTienHoaDon,
          // Explicitly keep ngay_hoa_don as null
          ngay_hoa_don: null,
        };
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

  const check_claim = async () => {
    setIsDebouncing(true);
    try {

        const response = await fetch(`https://bi.meraplion.com/local/post_data/check_invoice_mapping_claim_cp/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(debouncedDataSubmit),
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            return data
        } else {
            const data = await response.json();
            console.log(data);
            return data
        }
    } catch (processErr) {
      console.error("Error processing data:", processErr);
    } finally {
      setIsDebouncing(false);
    }
  }
// useEffect để gọi check_claim khi data_submit thay đổi
useEffect(() => {
  async function executeProcessing() {
      const {processedData, overbudgetIds} = await check_claim();
      setOverbudgetIds(overbudgetIds);
      console.log("Dữ liệu đã xử lý (từ useEffect):", overbudgetIds);
  }
  executeProcessing();
}, [debouncedDataSubmit]); // Thêm data_submit vào dependencies

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
            <th style={{ width: '150px' }}>Số tiền cần TT</th>
            <th style={{ width: '550px' }}>Hóa đơn</th>
            <th style={{ width: '100px' }}>Tiền hóa đơn</th>
            <th style={{ width: '70px' }}>Gửi ĐN</th>
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
          {data_submit.map((record) => (
            <tr key={record.id} style={{
              padding: '5px', 
              fontSize: '14px', 
              backgroundColor: OverbudgetIds.includes(record.id) ? 'rgb(254 202 202)' : 'transparent',
              height: '150px'
              }}
              >
              <td>{record.id.slice(-6)}</td>
              <td>
                <Form.Control
                  type="text"
                  value={ f.format(record.so_ke_hoach) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                />
              </td>
              
              <td>
              <Select // SELEC INVOICE
                  options={invoices}
                  getOptionValue={(el) => el.so_hoa_don}
                  getOptionLabel={(el) => `${el.so_hoa_don} - ${f.format(el.so_tien_hoa_don)} - ${el.ngay_hoa_don}`}
                  // *** MODIFICATION HERE ***
                  // Use record.so_hoa_don directly as the value for the multi-select
                  // It's already in the format that react-select's isMulti expects (array of objects)
                  value={record.so_hoa_don}
                  // *** END MODIFICATION ***
                  onChange={(selectedInvoices) => {
                    // Call handleInvoiceChange for the specific record
                    handleInvoiceChange(record.id, selectedInvoices);
                    console.log("selectedInvoices", selectedInvoices);
                  }}
                  isClearable
                  isSearchable
                  isMulti // <--- This prop is crucial for multi-selection
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

              <td> { f.format(record.so_tien_hoa_don) }</td>
              <td>
                <Button 
                size="sm"
                disabled={
                OverbudgetIds.length >= 1 ||
                isDebouncing === true ||
                (!record.so_hoa_don || record.so_hoa_don.length === 0)
                } variant="success" onClick={() => handleApproval(record.id)}>
                Gửi
                </Button>
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


