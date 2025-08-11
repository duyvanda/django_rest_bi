/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Card,
    ListGroup,
    Modal,
    Table
    // Dropdown,
    // InputGroup,
    // Stack,
    // FloatingLabel,
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
            set_lst_chon_gimmick(data['lst_chon_qua_tang']);
            set_mo_link(data['mo_link'])
            SetLoading(false)
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
    // eslint-disable-next-line
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [mo_link, set_mo_link] = useState("");
    const [manv, set_manv] = useState("");
    // const [lst_placeholder_cau_hoi, set_lst_placeholder_cau_hoi] = useState([]);
    // const [lst_chon_qua_tang_cam_xuc, set_lst_chon_qua_tang_cam_xuc] = useState([]);
    // const [lst_chon_qua_tang_cam_xuc_2024_dot2, set_lst_chon_qua_tang_cam_xuc_2024_dot2] = useState([]);
    const [lst_chon_gimmick, set_lst_chon_gimmick] = useState([]);
    // const [lst_chon_qua_1_5, set_lst_chon_qua_1_5] = useState([]);
    // const [lst_chon_hoi_nghi, set_lst_chon_hoi_nghi] = useState([]);
    // const [lst_chon_qua_sinh_nhat, set_lst_chon_qua_sinh_nhat] = useState([]);
    // const [lst_chon_hinh_thuc_hoi_nghi, set_lst_chon_hinh_thuc_hoi_nghi] = useState([]);



    // const [chon_qua_tang, set_chon_qua_tang] = useState("");
    // const [chon_qua_sn, set_chon_qua_sn] = useState("");
    // const [chon_hoi_nghi, set_chon_hoi_nghi] = useState("");
    // const [chon_qua_tang_hoi_nghi, set_chon_qua_tang_hoi_nghi] = useState("");
    // const [chon_hinh_thuc_hoi_nghi, set_chon_hinh_thuc_hoi_nghi] = useState("");
    // const [chon_qua_tang_2, set_chon_qua_tang_2] = useState("");
    // const [chon_qua_tang_cam_xuc, set_chon_qua_tang_cam_xuc] = useState("");
    // const [chon_qua_tang_cam_xuc_2, set_chon_qua_tang_cam_xuc_2] = useState("");
    // const [number1, set_number1] = useState("500000");
    // const [number2, set_number2] = useState("0");

    const [arr_hcp, set_arr_hcp] = useState([]);
    const [co_chon_hcp, set_co_chon_hcp] = useState("");
    // const [tong_hcp_da_dau_tu, set_tong_hcp_da_dau_tu] = useState("");
    // const [tong_tien_ke_hoach_da_dau_tu, set_tong_tien_ke_hoach_da_dau_tu] = useState("");
    // const [arr_gift, set_arr_gift] = useState(['Quà Tặng 1','Quà Tặng 2','Quà Tặng 3']);
    // const [hcp, set_hcp]= useState("");
    const [search, set_search] = useState('');

    // const dataTypes = [
    //     { id: "FLOAT", name: "FLOAT" },
    //     { id: "TIMESTAMP", name: "TIMESTAMP" },
    //     { id: "INTERGER", name: "INTERGER" },
    //     { id: "STRING", name: "STRING" }
    // ];

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
                    ten_ct:"Quà tặng theo dịp 20/10",
                    status:"H",
                    inserted_at: Inserted_at(),
                    approved_at:"",
                    approved_manv:"",
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

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>
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

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{width: "60px"}} size="sm" variant="outline-success" key={0} onClick={ () => navigate.push("/crmhome") } >CRM</Button>
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp_qua_tang" ? "primary" : "outline-primary"} key={2} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_qua_tang") } >ĐỀ XUẤT</Button>
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" ? "primary" : "outline-primary"} key={1} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_qua_tang_crm") } >QL DUYỆT</Button>
                            <Button variant="outline-primary" key={3} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_qua_tang_bc") } >BC</Button>
                        </ButtonGroup>

                        <ListGroup className="mt-2" style={{maxHeight: "250px", overflowY: "auto"}}>

                            <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên (KHONG DAU) " value={search} />

                            {arr_hcp
                                .filter( el => el.clean_ten_hcp.toLowerCase().includes( search.toLowerCase() ) )
                                .map( (el, index) =>
                                <ListGroup.Item key={index} className="mx-0 px-0 my-0 py-0" >
                                    <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handle_switch } id={el.ma_hcp_2} label={ el.ten_hcp + ' - ' +  el.ten_kh_chung + ' - ' +  el.ma_kh_chung + ' - '+ el.phan_loai_hcp}/>
                                </ListGroup.Item>
                                )
                            }

                        </ListGroup>
                    <div className="bg-white">
                        <Table bordered hover className="mt-2">
                            <thead>
                            <tr>
                                <th style={{ width: "60%" }}>Quà Tặng</th>
                                <th style={{ width: "20%" }}>Số lượng</th>
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
                                    {lst_chon_gimmick.map((el) => (
                                        <option key={el.stt} value={ el.ten_qua_tang + '--' + el.gia_tien }>
                                        { el.ten_qua_tang + '--' + el.gia_tien + 'đ' }
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

                        
                        {/* TEXT */}
                        {/* <FloatingLabel label="CHI PHÍ GIAO TIẾP" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        <FloatingLabel label="HỘI NGHỊ" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text2(e.target.value) } value = {text2}/> </FloatingLabel> */}
                        
                        <Button disabled={
                        co_chon_hcp === "" ||
                        Number(mo_link) === 0 ||
                        (
                            schema.length === 0
                        )
                        } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN 
                        </Button>

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


                        
                    </div>
                </Col>
            </Row>
        </Container>
        )
    }
    else {
        // return (
    
        //     <div>
        //         <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
        //         <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        //         </Spinner>
        //     </div>
            
        // )
    }
}


export default Tracking_chi_phi_hcp_qua_tang