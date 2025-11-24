/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
// import './myvnp.css';
import { Link, useLocation, useNavigate  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
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
import ClaimNavTabs from '../components/FormClaimNavTabs'; // adjust the path as needed

const Form_claim_chi_phi_crm_claimed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
    const fetch_initial_data = async (manv) => {
      SetLoading(true)
      const response = await fetch(`https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi_crm_claimed/?manv=${manv}&page=approved_invmapped`)
      if (!response.ok) {
          SetLoading(false)
      }
      else {
      const data = await response.json()
      set_data_submit(data['lst_duyet_hoa_don'])
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

  const [data_submit, set_data_submit] = useState([])
  const f = new Intl.NumberFormat()
  const [manv, set_manv] = useState("");

  const post_form_data = async (data) => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_form_claim_chi_phi_crm_claimed/`, {
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
        setCount(count+1);
        }, 2000);
    }
}

  const handleApproval = async (isApproved) => {
    const ql_duyet = isApproved ? "D" : "E"
    const updatedRecords = data_submit.map((record) => {
      if (record.checked) {
        let updatedRecord = Object.assign({}, record); // Clone the object
        updatedRecord.status = ql_duyet; // Update status
        updatedRecord.inserted_at = Inserted_at();
        return updatedRecord;
      }
      return record;
    });

    let lst_selected = updatedRecords.filter(el => el.checked);
    console.log("lst_selected", lst_selected)
  
    set_data_submit(lst_selected);
    console.log(lst_selected)
    post_form_data(lst_selected);
  };
  

  const handleCheckboxChange = (e) => {
    const updatedRecords = data_submit.map((record) => {
      if (record.id === e.target.id) {
        let updatedRecord = Object.assign({}, record);
        updatedRecord.checked = e.target.checked;
        return updatedRecord;
      }
      return record;
    });
      set_data_submit(updatedRecords);
  };
  
  

  // const handlePlanningNumberChange = (id, newValue) => {
  //   const updatedRecords = data_submit.map((record) => {
  //     if (record.id === id) {
  //       let updatedRecord = Object.assign({}, record); 
  //       updatedRecord.so_ke_hoach = newValue;
  //       return updatedRecord;
  //     }
  //     return record;
  //   });
  //     set_data_submit(updatedRecords);
  // };
  
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

  return (
    <Container className="mt-4">
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
        <Button variant="success" onClick={() => handleApproval(true)}>
          CONFIRM
        </Button>
        <Button variant="danger" onClick={() => handleApproval(false)}>
          DENY
        </Button>

        <Link to="/formcontrol/form_claim_chi_phi_crm">
          <Button
          variant={location.pathname === "/formcontrol/form_claim_chi_phi_crm" ? "secondary" : "outline-secondary"} 
          className="w-100">DUYỆT ĐỀ XUẤT
          </Button>
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
      <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }}>
        <thead>
          <tr style={{ padding: '5px', fontSize: '12px' }}>
          <th style={{ width: '80px' }}>ID</th>
          <th style={{ width: '70px', textAlign: "center" }}>Chuyển</th>
          <th style={{ width: '100px' }}>Status</th>
          <th style={{ width: '150px' }}>Số tiền TT</th>
          {/* <th style={{ width: '100px' }}>Số hóa đơn</th>
          <th style={{ width: '100px' }}>Ngày hóa đơn</th>
          <th style={{ width: '100px' }}>Tổng tiền</th> */}
          {/* <th style={{ width: '70px' }}>Mã NV</th> */}
          <th style={{ width: '150px' }}>Tên CVBH</th>
          <th style={{ width: '150px' }}>Tên KHC</th>
          <th style={{ width: '150px' }}>Tên HCP</th>
          <th style={{ width: '150px' }}>Quà tặng</th>
          <th style={{ width: '150px' }}>Kênh</th>
          <th style={{ width: '200px' }}>Nội dung</th>
          <th style={{ width: '200px' }}>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data_submit.map((record) => (
            <tr key={record.id} style={{ padding: '5px', fontSize: '14px' }}>
              <td>{record.id.slice(-6)}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={record.id}
                  checked={record.checked}
                  onChange={(e) => handleCheckboxChange(e)}
                />
              </td>
              <td>{record.status}</td>

              <td> { f.format(record.so_tien_claim_hoa_don) }
                {/* <Form.Control
                readOnly
                  type="text"
                  value={ f.format(record.so_ke_hoach) }
                  onChange={(e) => handlePlanningNumberChange(record.id, e.target.value.replace(/\D/g, "") )}
                /> */}
              </td>
              {/* <td>{record.so_hoa_don}</td>
              <td>{new Date(record.ngay_hoa_don).toLocaleDateString("vi-VN")}</td>
              <td>{ f.format(record.so_tien_hoa_don) }</td> */}
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
    </Container>
  );
};

export default Form_claim_chi_phi_crm_claimed;
