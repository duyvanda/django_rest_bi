/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import FeedbackContext from '../context/FeedbackContext';
import { Link, useLocation  } from "react-router-dom";
import Select from "react-select";
import {
    Button,
    Col,
    Row,
    // Container,
    // Dropdown,
    Form,
    Spinner,
    // InputGroup,
    // Stack,
    // FloatingLabel,
    Table,
    // Card,
    Modal
} from "react-bootstrap";
// import { v4 as uuid } from "uuid";

import { useNavigate } from "react-router-dom";

const Dang_ky_nghi_phep_pkh_ncrm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
  
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dang_ky_nghi_phep_pkh/?manv=${manv}&page=ncrm`)
        // const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=MR0673`)
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        set_data_submit(data['data'])
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
            navigate(`/login?redirect=${location.pathname}`);
        };
    }, [count]);



    const [manv, set_manv] = useState("");
    const [data_submit, set_data_submit] = useState([]);
    
      // Update the 'checked' status when the switch is toggled
      const handleSwitchChange = (uuid) => {
        const updatedData = data_submit.map((item) => {
          if (item.uuid === uuid) {
            item.checked = !item.checked;
          }
          return item;
        });
        set_data_submit(updatedData);
      };

      const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_dang_ky_nghi_phep_pkh/`, {
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
    
      const handleApproval = async (isApproved) => {
        const ql_duyet = isApproved ? "approved" : "rejected"
        // Create a new list of records with updated status
        const updatedRecords = data_submit.map((record) => {
          if (record.checked) {
            let updatedRecord = Object.assign({}, record); // Clone the object
            updatedRecord.status = ql_duyet; // Update status
            updatedRecord.inserted_at = Inserted_at();
            return updatedRecord;
          }
          else {void(0);}
          // return record;
        });
      
        // Update state with the modified records list
        console.log("updatedRecords", updatedRecords)
        set_data_submit(updatedRecords);
        post_form_data(updatedRecords);
    
      };
    
      return (
        <div>
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

        <Row className="justify-content-center mb-1 mt-1">
        <Col xs={3}>
          <Link to="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh">
            <Button
              variant={location.pathname === "/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh" ? "primary" : "outline-primary"}
              className="w-100"
            >
              ĐỀ XUẤT
            </Button>
          </Link>
        </Col>
        <Col xs={3}>
          <Link to="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh_ncrm">
            <Button
              variant={location.pathname === "/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh_ncrm" ? "secondary" : "outline-secondary"}
              className="w-100"
            >
              QL DUYỆT
            </Button>
          </Link>
        </Col>
      </Row>

          {/* Buttons for approving or denying */}
          <div className="mt-2" style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "flex-start" }}>
          <Button
            disabled={manv !== 'MR0485'}
            variant="success"
            onClick={() => handleApproval(true)}
            style={{ padding: '5px 10px' }} // Smaller padding
          >
            CONFIRM
          </Button>
          <Button
            variant="danger"
            onClick={() => handleApproval(false)}
            style={{ padding: '5px 10px' }} // Smaller padding
          >
            DENY
          </Button>
        </div>
    
        <div className="scrollable-table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Switch</th>
              <th style={{ width: '100px' }}>Số thứ tự ID (time)</th>
              <th style={{ width: '80px' }}>Mã NV</th>
              <th style={{ width: '100px' }}>Tên NV</th>
              <th style={{ width: '100px' }}>Tên QL</th>
              <th style={{ width: '150px' }}>Lý do</th>
              <th style={{ width: '100px' }}>Từ ngày</th>
              {/* <th style={{ width: '100px' }}>Đến ngày</th> */}
              <th style={{ width: '50px' }}>Số ngày</th>

              {/* <th className="switch-col">Switch</th>
              <th className="id-col">Số thứ tự ID (time)</th>
              <th className="manv-col">Mã NV</th>
              <th className="tennv-col">Tên NV</th>
              <th className="tenql-col">Tên QL</th>
              <th className="reason-col">Lý do</th>
              <th className="fromdate-col">Từ ngày</th>
              <th className="todate-col">Đến ngày</th>
              <th className="days-col">Số ngày</th> */}
            </tr>
          </thead>
          <tbody>
            {data_submit.map((item) => (
              <tr key={item.uuid}>
                <td>
                  <Form.Check
                    type="switch"
                    checked={item.checked}
                    onChange={() => handleSwitchChange(item.uuid)}
                  />
                </td>
                <td style={{ width: '100px' }} >{item.uuid}</td>
                <td>{item.manv}</td>
                <td>{item.tencvbh}</td>
                <td>{item.tenquanlytt}</td>
                <td>{item.reason}</td>
                <td>{formatDate(item.fromdate)}</td>
                {/* <td>{formatDate(item.toDate)}</td> */}
                <td>{item.days}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <style>
        {`
          /* CSS for table layout */
          .scrollable-table-container {
            overflow-x: auto;
            width: 100%;
          }

          table {
            table-layout: fixed;
            background-color: #f0f8ff;
            width: 100%;
          }

          th, td {
            word-wrap: break-word; /* Allow text to wrap */
            overflow-wrap: break-word; /* Ensure long words can break into new lines */
          }
          }
        `}
      </style>
        </div>
      );
    };

export default Dang_ky_nghi_phep_pkh_ncrm;