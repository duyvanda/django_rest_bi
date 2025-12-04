/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
    Button,
    // ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    // Card,
    Badge,
    Nav,
    ListGroup,
    Modal,
    // Table,
    Alert
    // InputGroup
} from "react-bootstrap";

function Dang_ky_hcp_tham_du_hoi_nghi() {

    const { get_id, Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATE VARIABLES ---
    const f = new Intl.NumberFormat();
    const [mo_link, set_mo_link] = useState("");
    const [ten_chuong_trinh, set_ten_chuong_trinh] = useState("");
    // const [chi_phi_thang, set_chi_phi_thang] = useState("");
    const [quy_tac, set_quy_tac] = useState("");
    const [show_quy_tac, set_show_quy_tac] = useState(false);
    const [manv, set_manv] = useState("");
    
    // Priority Selection
    const [lst_chon_uu_tien, set_lst_chon_uu_tien] = useState([]);
    const [nguoi_upload_file_data, set_nguoi_upload_file_data] = useState([]);
    const [selected_uu_tien, set_selected_uu_tien] = useState(""); 

    const [arr_hcp, set_arr_hcp] = useState([]);
    const [co_chon_hcp, set_co_chon_hcp] = useState("");
    const [search, set_search] = useState('');
    
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [excelFile, setExcelFile] = useState("");

    const fetch_first_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dang_ky_hcp_tham_du_hoi_nghi/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_arr_hcp(data['lst_hcp']);
            
            set_mo_link(data['mo_link']);
            set_ten_chuong_trinh(data['ten_chuong_trinh']);
            set_quy_tac(data['quy_tac']);
            set_lst_chon_uu_tien(data['lst_chon_uu_tien'] || [] ); 
            set_nguoi_upload_file_data(data['nguoi_upload_file_data'] || []);
            SetLoading(false);
        }
        else {
            SetLoading(false)
        }
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'dang_ky_hcp_tham_du_hoi_nghi', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_first_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            navigate('/login');
        };
    }, [count]);

    const handle_switch = (e) => {
        (e.target.checked) ? set_co_chon_hcp(e.target.id) : set_co_chon_hcp("")
        let lst = [];
        for (const element of arr_hcp) {
        if(element.ma_hcp_2 === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            lst.push(element);
        }
        }
        set_arr_hcp(lst)
    }

    const ma_hcp = []
    for (let i of arr_hcp) {
        if (i.check === true) {ma_hcp.push(i.ma_hcp_2)}
    }
    
    const post_form_data = async (data) => {
        SetLoading(true);
        try {
            const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_dang_ky_hcp_tham_du_hoi_nghi/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                console.log(errorData);
                SetALert(true);
                SetALertType("danger");
                SetALertText(errorData.error_message);
                setTimeout(() => {
                    SetALert(false);
                    SetLoading(false);
                }, 2000);

            } else {
                const successData = await response.json();
                console.log(successData);
                SetALert(true);
                SetALertType("success");
                SetALertText(successData.success_message);
                setTimeout(() => {
                    SetALert(false);
                    SetLoading(false);
                }, 2000);

                set_selected_uu_tien(""); 
            }
        } catch (error) {
            console.error("Fetch error:", error);
            }
    };


    const handle_submit = (e) => {
        e.preventDefault();
        
        const ma_hcp = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_hcp.push(i.ma_hcp_2)}
        }

        const data = {
            "ma_hcp_2":ma_hcp ,
            "manv":manv,
            "inserted":"inserted",
        }
        
        let result = [];
        let maHcp2 = data.ma_hcp_2;
        
        // Logic: Loop through selected HCPs only. Gifts are removed.
        for (let hcp of maHcp2) {
                result.push(
                    {
                    ma_hcp_2: hcp,
                    manv: data.manv,
                    uuid: uuid(),
                    status:"H",
                    inserted_at: Inserted_at(),
                    approved_at:"",
                    approved_manv:"",
                    ten_chuong_trinh:ten_chuong_trinh,
                    loai_chuong_trinh: location.search.split('=')[1],
                    ten_lua_chon: selected_uu_tien
                    }
                );
        }
        
        console.log("data", data);
        console.log(result);
        post_form_data(result);
    }

  // Excel Modal handlers
  const handleExcelModalClose = () => setShowExcelModal(false);
  const handleExcelModalShow = () => setShowExcelModal(true);
  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(file);
    } else {
      window.alert("Please upload a valid Excel file.");
    }
  };

  const handleExcelSubmit = async () => {
    if (!excelFile ) {
      window.alert("Please fill in all fields.");
      return;
    }
    const formData = new FormData();
    formData.append("excelFile", excelFile);
    try {
      const response = await fetch("https://bi.meraplion.com/local/dang_ky_hcp_tham_du_hoi_nghi_upload_excel/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        window.alert("THÀNH CÔNG !!! Excel file successfully submitted.");
        console.log(data)
      setExcelFile(null);
      } else {
        window.alert(data.error_message);
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      window.alert("Error occurred while uploading the Excel file.");
    }
    handleExcelModalClose();
  };

    const navs = [
        { label: "<=", path: "/crmhome", color: "text-success" },
        { label: "On", path: "/formcontrol/dang_ky_hcp_tham_du_hoi_nghi?type=online" },
        { label: "Off", path: "/formcontrol/dang_ky_hcp_tham_du_hoi_nghi?type=offline" },
        { label: "QL", path: "/formcontrol/dang_ky_hcp_tham_du_hoi_nghi_crm" },
        { label: "BC", path: "/reports", color: "text-info", isExternal: true }
    ];

        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >

                        {/* ALERT COMPONENT */}
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

                            {alert && (
                                <Alert
                                    variant={alertType}
                                    onClose={() => SetALert(false)}
                                    dismissible
                                    className="mt-2 text-start"
                                >
                                    <Alert.Heading as="h6" className="mb-1">
                                        <strong>Cảnh Báo: </strong>
                                    </Alert.Heading>
                                    {alertText}
                                </Alert>
                            )}
                        </Modal>

                        <Form onSubmit={handle_submit}>
                        
                        <h5 className="bg-white border rounded shadow-sm p-2 mt-2 mb-2 d-flex align-items-center">
                            <Badge bg="primary" className="me-2">CT</Badge>
                            <span className="fw-bold text-dark">{ten_chuong_trinh}</span>
                        </h5>

                        <Nav variant="pills" activeKey={location.pathname} className="mt-2 bg-light p-2 rounded gap-2 fw-bold" fill>
                            {navs.map(({ label, path, color, isLink }) => {
                                const isActive = (location.pathname + location.search) === path;
                                return (
                                    <Nav.Item key={path} className="flex-fill">
                                        <Nav.Link 
                                            eventKey={path}
                                            className={`shadow-sm border ${isActive ? "bg-merap-active" : `bg-white ${color || ""}`}`}
                                            onClick={!isLink ? () => navigate(path) : undefined}
                                            href={isLink ? path : undefined}
                                            target={isLink ? "_blank" : undefined}
                                        >
                                            {label}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            })}
                        </Nav>

                    <div className="bg-white border rounded shadow-sm p-3 mt-2">
                        <ListGroup className="mt-2" style={{maxHeight: "350px", overflowY: "auto"}}>
                            <Form.Control className="mb-2" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="🔍 Tìm mã hoặc tên (KHÔNG DẤU)" value={search} />
                            {arr_hcp
                                .filter( el => el.clean_ten_hcp.toLowerCase().includes( search.toLowerCase() ) )
                                .map( (el, index) =>
                                <ListGroup.Item key={index} className="p-1 bg-white border rounded" >
                                    <Form.Check key={index} className="text-wrap" type="switch" checked={el.check} onChange={ handle_switch } id={el.ma_hcp_2} label={ el.id + ')'+ el.ten_hien_thi}/>
                                </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </div>

                        {ma_hcp.length > 0 && (
                            <Alert variant="info" className="mt-3 mb-0 py-2 shadow-sm border-0">
                                <strong>✓ Đã chọn:</strong> {ma_hcp.length} bác sĩ
                            </Alert>
                        )}

                        {/* Priority Selection Section - DIRECT RADIO BUTTONS */}
                        <div className="bg-white border rounded shadow-sm p-3 mt-3">
                             <Form.Label className="fw-bold text-primary mb-2">
                                    ⭐ Chọn Ưu Tiên <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="d-flex flex-column gap-2">
                                {lst_chon_uu_tien.map((item) => (
                                    <div key={item.stt} className="p-2 border rounded bg-light">
                                        <Form.Check 
                                            type="radio"
                                            id={`priority-${item.stt}`}
                                            name="priorityGroup"
                                            label={item.ten_lua_chon}
                                            value={item.ten_lua_chon}
                                            checked={selected_uu_tien === item.ten_lua_chon}
                                            onChange={(e) => set_selected_uu_tien(e.target.value)}
                                            className="fw-bold mb-0"
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                ))}
                                {lst_chon_uu_tien.length === 0 && <p className="text-muted">Đang tải danh sách ưu tiên...</p>}
                            </div>
                        </div>
                        
                        <Modal show={show_quy_tac}>
                            <Modal.Body>
                                <div style={{ whiteSpace: 'pre-line' }}>
                                {quy_tac}
                                </div>
                            </Modal.Body>
                            <Button variant="secondary" onClick={() => set_show_quy_tac(false)} >Close</Button>
                        </Modal>

                        <div className="mt-2 d-grid gap-2 d-md-flex bg-white border rounded shadow-sm p-3">
                        <Button 
                            variant="info" 
                            size="lg" 
                            className="flex-fill text-white"
                            onClick={() => set_show_quy_tac(true)}
                        >
                            📖 Xem quy tắc chương trình
                        </Button>

                        <Button
                        disabled={
                        co_chon_hcp === "" ||
                        Number(mo_link) === 0 ||
                        selected_uu_tien === "" // Only checks priority now
                        }
                            variant="primary" 
                            size="lg" 
                            className="flex-fill"
                            onClick={handle_submit}
                        >
                            📤 Lưu thông tin
                        </Button>
                        </div>
                        

                        {Number(mo_link) === 0 && <p>Chưa mở link nhập</p>}
                        
                        { nguoi_upload_file_data.includes(manv) &&
                        <Button variant="danger" size="sm" onClick={handleExcelModalShow} className="mt-2">
                        + Thay đổi data (ADMIN)
                        </Button>
                        }
                        </Form>
                        
                            <Modal show={showExcelModal} onHide={handleExcelModalClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Upload Excel File</Modal.Title>
                            </Modal.Header>
                        
                            <Modal.Body>
                                <Form>
                                <Form.Group controlId="formExcelFile">
                                    <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleExcelFileChange}
                                    />
                                </Form.Group>                        
                                </Form>
                            <p>Data Mẫu</p>
                            <a href={"https://bi.meraplion.com/DMS/hcp_qua_tang/dang_ky_hcp_tham_du_hoi_nghi/1763618356686_data_mau.xlsx"} target="_blank" rel="noopener noreferrer">
                            Tải về file mẫu Excel
                            </a>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleExcelModalClose}>
                                Close
                                </Button>
                                <Button disabled={false} variant="primary" onClick={handleExcelSubmit}>
                                Submit Excel
                                </Button>
                            </Modal.Footer>
                            </Modal>

                </Col>
            </Row>
        </Container>
        )
}


export default Dang_ky_hcp_tham_du_hoi_nghi