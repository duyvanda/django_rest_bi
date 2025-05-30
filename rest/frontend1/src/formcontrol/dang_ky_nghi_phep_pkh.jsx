/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import FeedbackContext from '../context/FeedbackContext';
import { Link, useLocation  } from "react-router-dom";
import Select from "react-select";
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
    Table,
    Card,
    Modal
} from "react-bootstrap";
// import { v4 as uuid } from "uuid";

const Dang_ky_nghi_phep_pkh = ({ history } ) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
  
    const fetch_initial_data = async (supid) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/get_dang_ky_nghi_phep_pkh/?supid=${supid}`)
        // const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=MR0673`)
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        set_employees(data['list_nv'])
        // set_data_kh_chung(data['data_kh_chung'])
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
        set_supid(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, []);
  
  
  
    // Define states for the inputs
    const [supid, set_supid] = useState("");
    const [employees, set_employees] = useState([]);
    const [manv, setManv] = useState("");
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);   // Default to today
    const [days, setDays] = useState("");
    const [reason, setReason] = useState("");

  // Sample list of employees
//   const employees = [
//     { value: 'mr001', label: 'Duy' },
//     { value: 'mr002', label: 'John' },
//     { value: 'mr003', label: 'Anna' }
//   ];

  // Function to clear all input values
  const clear_data = () => {
    setManv("");
    setFromDate(new Date().toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    setDays("");
    setReason("");
  };

  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/insert_dang_ky_nghi_phep_pkh/`, {
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
        setCount(count+1);

    }
}

  // Function to handle form submission
  const handle_submit = (e) => {
    e.preventDefault();

    const data = {
    manv: manv,  
    tencvbh: null,
    supid:supid,
    tenquanlytt: null,
    fromDate: fromDate,
    toDate: toDate,
    days: days,
    reason: reason,
    status:'new',
    inserted_at: Inserted_at(),
    uuid: get_id(),
    };

    console.log(data);
    post_form_data(data);
    // clear_data();
  };

  return (
    <Form onSubmit={handle_submit}>
    <Row className="justify-content-center">
    <Col md={4} >

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

      {/* Select employee */}
       {/* Select employee */}
       <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Select
            options={employees}
            isMulti
            // value={employees.find((emp) => emp.value === manv)}
            value={manv}
            onChange={setManv}
            placeholder="Chọn nv"
            styles={{
              control: (base) => ({
                ...base,
                height: "60px",
                borderColor: "lightgray",
              }),
            }}
          />
        </Col>
      </Form.Group>

      {/* From Date */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Label>From Date</Form.Label>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="Từ ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* To Date */}
      {/* <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Label>To Date</Form.Label>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="Đến ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group> */}

      {/* Number of Days */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Control
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Số ngày"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* Reason for Leave */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Form.Control
            as="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do"
            style={{ height: "60px" }}
          />
        </Col>
      </Form.Group>

      {/* Submit Button */}
      <Form.Group as={Row} className="mt-2">
        <Col sm={12}>
          <Button variant="primary" type="submit" block>
            Gửi NCRM duyệt
          </Button>
        </Col>

        <Col sm={12}>
        <Link to="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh_ncrm">
          <Button
          variant="outline-secondary"
          className="mt-2">ĐI ĐẾN NCRM
          </Button>
        </Link>
        </Col>

      </Form.Group>

      </Col>
      </Row>
    </Form>
  );
};

export default Dang_ky_nghi_phep_pkh;