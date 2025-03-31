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

const Form_claim_chi_phi_ql_duyet = ( {history} ) => {
    const location = useLocation();
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi_ql_duyet/?manv=${manv}`)
      
      if (!response.ok) {
          SetLoading(false)
      }
      else {
      const data = await response.json()
      set_data_submit(data['data_submit'])
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
  const f = new Intl.NumberFormat()
  const [manv, set_manv] = useState("");

  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/insert_form_claim_chi_phi_ql_duyet/`, {
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
        return updatedRecord;
      }
      return record;
    });
  
    // Update state with the modified records list
    set_data_submit(updatedRecords);
    post_form_data(updatedRecords);


    // try {
    //   const response = await fetch("/api/approval", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(updatedRecords),
    //   });
    //   if (!response.ok) {
    //     console.error("Failed to send approval data");
    //   }
    // } catch (error) {
    //   console.error("Error sending approval data:", error);
    // }

  };
  

  const handleCheckboxChange = (id) => {
    // Create a new list of records with updated checked status
    const updatedRecords = data_submit.map((record) => {
      if (record.id === id) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.checked = !updatedRecord.checked; // Toggle the checked status
        return updatedRecord;
      }
      return record;
    });
  
    // Update state with the modified records list
    set_data_submit(updatedRecords);

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
  
  

  return (
    <Container className="mt-4">
      <Row className="justify-noi_dung-center mb-1 mt-1">
      <Col xs={4}>
      <Link to="/formcontrol/form_claim_chi_phi">
      <Button 
      variant={location.pathname === "/formcontrol/form_claim_chi_phi" ? "primary" : "outline-primary"}
      className="w-100">ĐỀ XUẤT</Button>
      </Link>
      </Col>
      <Col xs={4}>
      <Link to="/formcontrol/form_claim_chi_phi_ql_duyet">
      <Button 
      variant={location.pathname === "/formcontrol/form_claim_chi_phi_ql_duyet" ? "secondary" : "outline-secondary"} 
      className="w-100">QL DUYỆT</Button>
      </Link>
      </Col>
      <Col xs={4}>
      <Link to="/formcontrol/form_claim_chi_phi_final">
      <Button
      variant={location.pathname === "/formcontrol/form_claim_chi_phi_final" ? "success" : "outline-success"} 
      className="w-100">CLAIM CHI PHÍ</Button>
      </Link>
      </Col>
      </Row>

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
        <Button variant="success" onClick={() => handleApproval(true)}>
          Approve
        </Button>
        <Button variant="danger" onClick={() => handleApproval(false)}>
          Reject
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
      <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }}>
        <thead>
          <tr style={{ padding: '5px', fontSize: '12px' }}>
            <th style={{ width: '150px' }}>ID</th>
            <th style={{ width: '70px', textAlign: "center" }}>Switch</th>
            <th style={{ width: '70px' }}>Status</th>
            <th style={{ width: '150px' }}>Số kế hoạch</th>
            <th style={{ width: '70px' }}>manv</th>
            <th style={{ width: '150px' }}>tencvbh</th>
            <th style={{ width: '150px' }}>pubcustname</th>
            <th style={{ width: '150px' }}>ten_hcp</th>
            <th style={{ width: '150px' }}>qua_tang</th>
            <th style={{ width: '150px' }}>kenh</th>
            <th style={{ width: '200px' }}>noi_dung</th>
            <th style={{ width: '200px' }}>ghi_chu</th>

          </tr>
        </thead>
        <tbody>
          {data_submit.map((record) => (
            <tr key={record.id} style={{ padding: '5px', fontSize: '14px' }}>
              <td>{record.id}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`switch-${record.id}`}
                  checked={record.checked}
                  onChange={() => handleCheckboxChange(record.id)}
                />
              </td>
              <td>{record.status}</td>

              <td>
                <Form.Control
                  type="text"
                  value={ f.format(record.so_ke_hoach) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                />
              </td>

              <td>{record.manv}</td>
              <td>{record.tencvbh}</td>
              <td>{record.pubcustname}</td>
              <td>{record.ten_hcp}</td>
              <td>{record.qua_tang}</td>
              <td>{record.kenh}</td>
              <td>{record.noi_dung}</td>

              <td>
                <Form.Control
                  type="text"
                  value={ f.format(record.so_ke_hoach) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                />
              </td>
              <td>{record.ghi_chu}</td>

            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      {/* <div className="d-flex flex-wrap gap-3">
        {data_submit.map((record) => (
          <Card key={record.id} className="p-3 shadow" style={{ width: "300px" }}>
            <Card.Body className="p-0">
              <Form.Check 
                type="switch"
                id={`switch-${record.id}`}
                checked={record.checked}
                onChange={() => handleCheckboxChange(record.id)}
                className="mb-4"
              />
              <Card.Title>ID: {record.id}</Card.Title>
              <div><strong>Status:</strong> {record.status}</div>
              <div><strong>manv:</strong>{record.manv}</div>
              <div><strong>tencvbh:</strong>{record.tencvbh}</div>
              <div><strong>pubcustname:</strong>{record.pubcustname}</div>
              <div><strong>ten_hcp:</strong>{record.ten_hcp}</div>
              <div><strong>qua_tang:</strong>{record.qua_tang}</div>
              <div><strong>kenh:</strong>{record.kenh}</div>
              <div><strong>noi_dung:</strong>{record.noi_dung}</div>
              <div><strong>ghi_chu:</strong>{record.ghi_chu}</div>
              <Form.Group>
              <Form.Label><strong>Số kế hoạch: {f.format(record.so_ke_hoach)}</strong></Form.Label>
              <Form.Control
                type="number"
                value={record.so_ke_hoach} // Use record's value directly
                onChange={(e) => handlePlanningNumberChange(record.id, e.target.value)}
              />
            </Form.Group>
            </Card.Body>
          </Card>
        ))}
      </div> */}
    </Container>
  );
};

export default Form_claim_chi_phi_ql_duyet;
