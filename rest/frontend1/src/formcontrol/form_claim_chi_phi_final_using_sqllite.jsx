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
import initSqlJs from 'sql.js';

const Form_claim_chi_phi_final = ( {history} ) => {
    const location = useLocation();
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
      // 1. Initialize SQLite DB once on component mount
      const [db, setDb] = useState(null);
      const [loadingDb, setLoadingDb] = useState(true);
      useEffect(() => {
        async function initDatabase() {
          try {
            const SQL = await initSqlJs({
              locateFile: file => `/${file}`
            });
            const newDb = new SQL.Database();
            setDb(newDb);
            setLoadingDb(false);
            console.log( "Success to load SQL.js");
          } catch (err) {
            console.error("Failed to load SQL.js:", err);
            setError("Failed to load database. Check console for details.");
            setLoadingDb(false);
          }
        }
        initDatabase();
        return () => {
          if (db) {
            db.close();
            console.log("SQLite database closed when unmounts. Because you navigated to a different page. If you didn't close it, the connection could remain open and consuming memory");
          }
        };
      }, []);
    
    
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
        
          if (loadingDb===false && db) { // Fetch data once DB is ready
          fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
          }
        }
          else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, [count, loadingDb, db]);

    const [data_submit, set_data_submit] = useState([]);
    const [debouncedDataSubmit, setDebouncedDataSubmit] = useState([]);
    const [isDebouncing, setIsDebouncing] = useState(false);

      // NEW useEffect: Debounce data_submit changes
    useEffect(() => {
      setIsDebouncing(true);
      const handler = setTimeout(() => {
        setDebouncedDataSubmit(data_submit);
        setIsDebouncing(false); // Kết thúc debounce: kích hoạt lại nút
      }, 2000); // 500ms debounce delay

      // Cleanup function: clear timeout if data_submit changes before the delay
      return () => {
        clearTimeout(handler);
      };
    }, [data_submit]); // Chạy lại hiệu ứng này bất cứ khi nào data_submit thay đổi

    const [invoices,  set_invoices] = useState ([
      // { nguoi_mua_hang: "MR0673", ky_hieu: "K25TDL", so_hoa_don: "63182", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 681855},
      // { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19298", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 3592906},
      // { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19299", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 4163723},
      // { nguoi_mua_hang: "MR0673", ky_hieu: "K25TDL", so_hoa_don: "63182", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 681855},
      // { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19298", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 3592906},
      // { nguoi_mua_hang: "MR0673", ky_hieu: "C25THC", so_hoa_don: "19299", ngay_hoa_don: "28/02/2025", so_tien_hoa_don: 4163723}
    ]);
    
  const f = new Intl.NumberFormat()
  const [manv, set_manv] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [downloadUrl, setDownloadUrl] = useState("");
  const [spinning, setSpinning] = useState(false);  // Replaced `loading` with `spinning`
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  // const [disable, setdisable] = useState(false);
  const [OverbudgetIds, setOverbudgetIds] = useState([]); // Trạng thái cho dữ liệu đã xử lý



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

  // 3. Function to process data when button is clicked
  const processClaims = () => {
    try {
      db.run(`DROP TABLE IF EXISTS claims;`);
      db.run(`
      CREATE TABLE claims (
        id TEXT PRIMARY KEY,
        so_hoa_don TEXT,
        so_ke_hoach INTEGER,
        so_tien_hoa_don INTEGER
      );
      `);
      const insertStmt = db.prepare(`
      INSERT INTO claims (
        id, 
        so_hoa_don,
        so_ke_hoach,
        so_tien_hoa_don
      )
      VALUES (
        ?, ?, ?, ?
      );
      `);

      debouncedDataSubmit.forEach(row => {
        insertStmt.run([
          row.id,
          row.so_hoa_don,
          row.so_ke_hoach,
          row.so_tien_hoa_don
        ]);
      });
      insertStmt.free();

      const query = `
      with data as
      (
        SELECT
          c.id,
          c.so_hoa_don,
          SUM(c.so_ke_hoach) OVER (PARTITION BY c.so_hoa_don) AS total_claim_money,
          so_tien_hoa_don
        FROM claims AS c
        )
        select id from data
        WHERE total_claim_money > so_tien_hoa_don
        `;

      const res = db.exec(query);

      if (res.length > 0) {
        const columns = res[0].columns;
        const values = res[0].values;

        const formattedResults = values.map(row => {
          const rowObject = {};
          columns.forEach((col, i) => {
            rowObject[col] = row[i]
          }
        )
        ;
          return rowObject;
        });
        console.log("formattedResults", formattedResults)
        
        const overbudgetIds = res[0].values.map(row => row[0]);

        return {
        processedData: formattedResults,
        overbudgetIds: overbudgetIds
        };

      } else {
        return {
        processedData: [],
        overbudgetIds: []
        };
      }
    } catch (processErr) {
      console.error("Error processing data:", processErr);
    } finally {
      void(0);
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


  // 4. useEffect để gọi processClaims khi processTrigger HOẶC data_submit thay đổi
// useEffect(() => {
//   async function executeProcessing() {
//     if ( db ) {
//       const {processedData, overbudgetIds} = processClaims();
//       setOverbudgetIds(overbudgetIds);
//       console.log("Dữ liệu đã xử lý (từ useEffect):", overbudgetIds);
//     }
//   }
//   executeProcessing();
// }, [debouncedDataSubmit]);


  // 4. useEffect để gọi processClaims khi processTrigger HOẶC data_submit thay đổi
useEffect(() => {
  async function executeProcessing() {
    if ( db ) {
      const {processedData, overbudgetIds} = await check_claim();
      setOverbudgetIds(overbudgetIds);
      console.log("Dữ liệu đã xử lý (từ useEffect):", overbudgetIds);
    }
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
        <Button disabled={
          OverbudgetIds.length >= 1 |
          isDebouncing === true
          } variant="success" onClick={() => handleApproval()}>
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
            <th style={{ width: '80px' }}>KH-ID</th>
            <th style={{ width: '150px' }}>Số tiền cần TT</th>
            <th style={{ width: '300px' }}>Hóa đơn</th>
            <th style={{ width: '100px' }}>Số hóa đơn</th>
            <th style={{ width: '100px' }}>Ngày hóa đơn</th>
            <th style={{ width: '100px' }}>Tiền hóa đơn</th>
            <th style={{ width: '70px' }}>Status</th>
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
              backgroundColor: OverbudgetIds.includes(record.id) ? 'rgb(254 202 202)' : 'transparent'
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


