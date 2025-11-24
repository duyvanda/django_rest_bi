/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from 'uuid';
// import './myvnp.css';
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
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
    Table,
    Alert
    // InputGroup
} from "react-bootstrap";

function Tracking_chi_phi_hcp_qua_tang( {history} ) {

    const { get_id, Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();

    const fetch_tracking_chi_phi_get_data_hcp = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_planning_collect_hcp_qua_tang/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_arr_hcp(data['lst_hcp']);
            set_lst_chon_qua_tang(data['lst_chon_qua_tang']);
            set_mo_link(data['mo_link']);
            set_ten_chuong_trinh(data['ten_chuong_trinh']);
            set_chi_phi_thang(data['chi_phi_thang']);
            set_quy_tac(data['quy_tac']);
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
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'tracking_chi_phi_hcp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_tracking_chi_phi_get_data_hcp(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [mo_link, set_mo_link] = useState("");
    const [ten_chuong_trinh, set_ten_chuong_trinh] = useState("");
    const [chi_phi_thang, set_chi_phi_thang] = useState("");
    const [quy_tac, set_quy_tac] = useState("");
    const [show_quy_tac, set_show_quy_tac] = useState(false);
    const [manv, set_manv] = useState("");
    const [lst_chon_qua_tang, set_lst_chon_qua_tang] = useState([]);
    const [arr_hcp, set_arr_hcp] = useState([]);
    const [co_chon_hcp, set_co_chon_hcp] = useState("");
    const [search, set_search] = useState('');
    const [schema, set_schema] = useState([  ]);
    const [showExcelModal, setShowExcelModal] = useState(false);
    const [excelFile, setExcelFile] = useState("");

    const handle_switch = (e) => {
        (e.target.checked) ? set_co_chon_hcp(e.target.id) : set_co_chon_hcp("")
        let lst = [];
        for (const element of arr_hcp) {
        if(element.ma_hcp_2 === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }

        else {
            void(0)
            // element.check = false
            lst.push(element);
        }

        }
        set_arr_hcp(lst)
    }

        const ma_hcp = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_hcp.push(i.ma_hcp_2)}
        }
    
    function addSchemaRow() {
    let newSchema = schema.map(row => ({ ...row }));
    newSchema.push( { so_luong: "1", qua_gm: "", price: ""  } );
    set_schema(newSchema);
    }

    function removeSchemaRow(index) {
    let updatedSchema = [];
    for (let i = 0; i < schema.length; i++) {
        if (i !== index) {
        let row = Object.assign({}, schema[i]); // Clone each row
        updatedSchema.push(row);
        }
    }
    set_schema(updatedSchema);
    }

    function handleSchemaChange(index, field, value) {
        let updatedSchema = [];
        for (let i = 0; i < schema.length; i++) {
            let row = Object.assign({}, schema[i]); // Clone each row
            updatedSchema.push(row);
        }

        if (field === 'qua_gm') {
        updatedSchema[index][field] = value.split('--')[0];
        updatedSchema[index]['price'] = value.split('--')[1];
        }

        else {
        updatedSchema[index][field] = value;
        }

        console.log(updatedSchema);
        set_schema(updatedSchema);
    }

        const post_form_data = async (data) => {
            SetLoading(true);
            try {
                const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_planning_collect_hcp_qua_tang/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Renamed 'data' to 'errorData' to avoid conflict
                    console.log(errorData);
                    SetALert(true);
                    SetALertType("alert-danger");
                    SetALertText(errorData.error_message);
                    setTimeout(() => {
                        SetALert(false);
                        SetLoading(false);
                    }, 2000);

                } else {
                    const successData = await response.json();
                    console.log(successData);
                    SetALert(true);
                    SetALertType("alert-success");
                    SetALertText(successData.success_message);
                    setTimeout(() => {
                        SetALert(false);
                        SetLoading(false);
                    }, 2000);
                    
                    set_schema([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                }
        };


    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const ma_hcp = []
        for (let i of arr_hcp) {
            if (i.check === true) {ma_hcp.push(i.ma_hcp_2)}
        }

        const data = {
            "ma_hcp_2":ma_hcp ,
            "manv":manv,
            "inserted":"inserted",
            "uuid":uuid(),
            "qua_gmk": schema
        }
        
        let result = [];
        let maHcp2 = data.ma_hcp_2;
        let quaGmk = data.qua_gmk;
        for (let hcp of maHcp2) {
            for (let item of quaGmk) {
                result.push(
                    {
                    ma_hcp_2: hcp,
                    manv: data.manv,
                    uuid: uuid(),
                    qua_tang: item.qua_gm,
                    so_luong: item.so_luong,
                    price: item.price,
                    status:"H",
                    inserted_at: Inserted_at(),
                    approved_at:"",
                    approved_manv:"",
                    ten_chuong_trinh:ten_chuong_trinh,
                    chi_phi_thang: chi_phi_thang.split('-').reverse().join('-')
                    }
                );
            }
        }
        
        console.log("data", data);
        console.log(result);
        post_form_data(result);
        // set_gia_tri_smn("");

    }

// Modal for adding Excel file and table name
  const handleExcelModalClose = () => setShowExcelModal(false);
  const handleExcelModalShow = () => setShowExcelModal(true);
  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setExcelFile(file);
      const formData = new FormData();
      formData.append("excelFile", file);
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
      const response = await fetch("https://bi.meraplion.com/local/tracking_chi_phi_qua_tang_upload_excel/", {
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
        { label: "ĐỀ XUẤT", path: "/formcontrol/tracking_chi_phi_hcp_qua_tang" },
        { label: "QL DUYỆT", path: "/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" },
        { label: "BC", path: "/realtime/99", color: "text-info", isExternal: true }
    ];

    const filtered = arr_hcp.filter(el =>
        el.clean_ten_hcp.toLowerCase().includes(search.toLowerCase())
    );

        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >

            {/* <div> */}
                        {/* ALERT COMPONENT */}
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

                            {alert && (
                                <Alert
                                    variant={alertType} // e.g., 'danger', 'warning', 'success'
                                    onClose={() => SetALert(false)} // You must handle the state update here
                                    dismissible
                                    className="mt-2 text-start" // Added text-start to align text left if parent is centered
                                >
                                    <Alert.Heading as="h6" className="mb-1">
                                        <strong>Cảnh Báo: </strong>
                                    </Alert.Heading>
                                    {alertText}
                                </Alert>
                            )}
                        </Modal>

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                        {/* <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{width: "60px"}} size="sm" variant="outline-success" key={0} onClick={ () => navigate.push("/crmhome") } >CRM</Button>
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp_qua_tang" ? "primary" : "outline-primary"} key={2} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_qua_tang") } >ĐỀ XUẤT</Button>
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" ? "primary" : "outline-primary"} key={1} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_qua_tang_crm") } >QL DUYỆT</Button>
                            <Link to="/realtime/99" target="_blank" rel="noopener noreferrer"> <Button variant="outline-info text-dark" key={3}>BC</Button> </Link>
                        </ButtonGroup> */}
                        <h5 className="bg-white border rounded shadow-sm p-2 mt-2 mb-2 d-flex align-items-center">
                            <Badge bg="primary" className="me-2">CT</Badge>
                            <span className="fw-bold text-dark">{ten_chuong_trinh}</span>
                        </h5>

                        <Nav variant="pills" activeKey={location.pathname} className="mt-2 bg-light p-2 rounded gap-2 fw-bold" fill>
                            {navs.map(({ label, path, color, isLink }) => {
                                const isActive = location.pathname === path; // Check if this tab is active
                                return (
                                    <Nav.Item key={path} className="flex-fill">
                                        <Nav.Link 
                                            eventKey={path}
                                            // FIX: Only use bg-white and custom colors if NOT active. 
                                            // If active, let Bootstrap default (Blue bg + White text) take over.
                                            className={`shadow-sm border ${isActive ? "bg-merap-active" : `bg-white ${color || ""}`}`}
                                            onClick={!isLink ? () => navigate.push(path) : undefined}
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

                        {/* <Button variant="outline-info" onClick={() => set_show_quy_tac(true)} className="mt-1 text-dark" size="sm">Show quy tắc</Button> */}
                        
                        <Modal show={show_quy_tac}>
                            <Modal.Body>
                                <div style={{ whiteSpace: 'pre-line' }}>
                                {quy_tac}
                                </div>
                            </Modal.Body>
                            <Button variant="secondary" onClick={() => set_show_quy_tac(false)} >Close</Button>
                        </Modal>

                        
                    <div className="bg-white border rounded shadow-sm p-3 mt-3">
                        <Table bordered hover className="mt-2">
                            <thead>
                            <tr>
                                <th style={{ width: "60%" }}>Tên Quà</th>
                                <th style={{ width: "20%" }}>SL</th>
                                <th style={{ width: "20%" }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {schema.map((row, index) => (
                                <tr key={index}>
                                <td>
                                    <Form.Select
                                    value={row.dataType}
                                    onChange={(e) =>
                                        {
                                            handleSchemaChange(index, "qua_gm", e.target.value);
                                        }

                                    }
                                    className="mt-2"
                                    >
                                    <option value="">Click chọn</option>
                                    {lst_chon_qua_tang.map((el) => (
                                        <option key={el.stt} value={ el.ten_qua_tang + '--' + el.gia_tien }>
                                        { el.ten_qua_tang + '--' + f.format(el.gia_tien) + 'đ' }
                                        </option>
                                    ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                    type="number"
                                    value={row.so_luong}
                                    onChange={(e) => handleSchemaChange(index, "so_luong", e.target.value)}
                                    placeholder=""
                                    className="mt-2"
                                    />
                                </td>

                                <td className="d-flex justify-content-center">
                                    <Button variant="danger" onClick={() => removeSchemaRow(index)} className="mt-2">
                                    Remove
                                    </Button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        <div className="d-flex gap-3 mt-2">
                            <Button onClick={addSchemaRow} variant="success" className="w-auto" size="sm">
                            Thêm Quà
                            </Button>
                        </div>
                    </div>

                        {/* <div className="bg-white border rounded shadow-sm p-3"></div> */}
                        <div className="mt-2 d-grid gap-2 d-md-flex bg-white border rounded shadow-sm p-3">
                        <Button 
                            variant="info" 
                            size="lg" 
                            className="flex-fill text-white" // Added text-white for better contrast on "info"
                            onClick={() => set_show_quy_tac(true)}
                        >
                            📖 Xem quy tắc chương trình
                        </Button>

                        <Button
                        disabled={
                        co_chon_hcp === "" ||
                        Number(mo_link) === 0 ||
                        (
                            schema.length === 0
                        )
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
                        
                        { ['MR1119', 'MR0474', 'MR2616', 'MR2417', 'MR0673'].includes(manv) &&
                        <Button variant="danger" size="sm" onClick={handleExcelModalShow} className="mt-2">
                        + Thay đổi data (ADMIN)
                        </Button>
                        }
                        </Form>
                              {/* Modals */}
                              {/* Excel File and Table Name Modal */}
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
                                <p>Link hiện tại</p>
                                <a href={"https://bi.meraplion.com/DMS/hcp_qua_tang/dieu_chinh_chon_qua.xlsx"} target="_blank" rel="noopener noreferrer">
                                {"https://bi.meraplion.com/DMS/hcp_qua_tang/dieu_chinh_chon_qua.xlsx"}
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

                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}


                        
            {/* </div> */}
                </Col>
            </Row>
        </Container>
        )
}


export default Tracking_chi_phi_hcp_qua_tang