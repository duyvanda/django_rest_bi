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
    Modal,
    Alert
} from "react-bootstrap";
// import { v4 as uuid } from "uuid";

const Dang_ky_nghi_phep_pkh = ({ history } ) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
  
    const fetch_initial_data = async (supid) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dang_ky_nghi_phep_pkh/?supid=${supid}&page=crm`)
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
    const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_dang_ky_nghi_phep_pkh/`, {
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
    post_form_data([data]);
    // clear_data();
  };
  const companyColor = '#00A79D'; // Define your company color
  return (
    <Form onSubmit={handle_submit} className="p-4 border rounded shadow-sm bg-white">
      {/* Loading Modal */}
      <Modal show={loading} centered size="sm" backdrop="static" keyboard={false}>
        <Modal.Body className="text-center d-flex flex-column align-items-center justify-content-center py-4">
          <Spinner animation="border" role="status" className="mb-3" style={{ color: '#00A79D' }} />
          <p className="mb-0">Đang tải...</p>
        </Modal.Body>

        {alert &&
        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
        </div>
        }

      </Modal>

      <Row className="justify-content-center">

        {/* TAB COMPONENTS */}
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


        <Col md={6}>

          {/* Select employee */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Chọn nhân viên</Form.Label>
            <Select
              options={employees}
              isMulti
              value={manv}
              onChange={setManv}
              placeholder="Tìm kiếm hoặc chọn nhân viên..."
              noOptionsMessage={() => "Không tìm thấy nhân viên"}
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "50px",
                  borderColor: state.isFocused ? companyColor : "#ced4da", // Highlight border on focus
                  boxShadow: state.isFocused ? `0 0 0 0.25rem ${companyColor}40` : "none", // Subtle shadow on focus
                  '&:hover': {
                    borderColor: state.isFocused ? companyColor : "#80bdff", // Keep company color on hover when focused
                  },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: `${companyColor}1A`, // A lighter tint of the company color for tags
                  color: companyColor,
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: companyColor,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? companyColor : state.isFocused ? `${companyColor}10` : null, // Selected and hover background
                  color: state.isSelected ? 'white' : 'black', // Text color for selected
                  '&:active': {
                    backgroundColor: companyColor,
                  },
                }),
              }}
            />
          </Form.Group>

          {/* From Date */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Từ ngày</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ height: "50px" }}
            />
          </Form.Group>

          {/* Number of Days */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Số ngày nghỉ</Form.Label>
            <Form.Control
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Nhập số ngày nghỉ"
              min="0"
              step="0.1" // Add this line
              style={{ height: "50px" }}
            />
          </Form.Group>

          {/* Reason for Leave */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Lý do nghỉ phép</Form.Label>
            <Form.Control
              as="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mô tả lý do nghỉ phép của bạn..."
              rows={4}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-100 py-3 fw-bold"
            style={{
              backgroundColor: companyColor,
              borderColor: companyColor,
              color: 'white', // Ensure text is readable against the custom background
            }}
          >
            Gửi NCRM duyệt
          </Button>

        </Col>
      </Row>
    </Form>
  );
};

export default Dang_ky_nghi_phep_pkh;