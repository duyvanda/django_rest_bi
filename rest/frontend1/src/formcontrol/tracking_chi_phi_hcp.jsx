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

function Tracking_chi_phi_hcp( {history} ) {

    const { Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();

    const fetch_tracking_chi_phi_get_data_hcp = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/tracking_chi_phi_get_data_hcp/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_arr_hcp(data['lst_hcp']);
            // set_tong_hcp_da_dau_tu(data['tong_hcp_da_dau_tu']);
            // set_tong_tien_ke_hoach_da_dau_tu(data['tong_tien_ke_hoach_da_dau_tu']);

            set_lst_placeholder_cau_hoi(data['lst_placeholder_cau_hoi']);
            set_lst_chon_qua_tang_cam_xuc(data['lst_chon_qua_tang_cam_xuc']);
            // set_lst_chon_qua_1_5(data['lst_chon_qua_1_5']);
            // set_lst_chon_qua_sinh_nhat(data['lst_chon_qua_sinh_nhat']);
            // set_lst_chon_hoi_nghi(data['lst_chon_hoi_nghi']);
            // set_lst_chon_hinh_thuc_hoi_nghi(data['lst_chon_hinh_thuc_hoi_nghi']);
            set_lst_chon_qua_tang_cam_xuc_2024_dot2(data['lst_chon_qua_tang_cam_xuc_2024_dot2']);
            set_lst_chon_gimmick(data['lst_chon_gimmick']);
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
    const [manv, set_manv] = useState("");
    const [lst_placeholder_cau_hoi, set_lst_placeholder_cau_hoi] = useState([]);
    const [lst_chon_qua_tang_cam_xuc, set_lst_chon_qua_tang_cam_xuc] = useState([]);
    const [lst_chon_qua_tang_cam_xuc_2024_dot2, set_lst_chon_qua_tang_cam_xuc_2024_dot2] = useState([]);
    const [lst_chon_gimmick, set_lst_chon_gimmick] = useState([]);
    // const [lst_chon_qua_1_5, set_lst_chon_qua_1_5] = useState([]);
    // const [lst_chon_hoi_nghi, set_lst_chon_hoi_nghi] = useState([]);
    // const [lst_chon_qua_sinh_nhat, set_lst_chon_qua_sinh_nhat] = useState([]);
    // const [lst_chon_hinh_thuc_hoi_nghi, set_lst_chon_hinh_thuc_hoi_nghi] = useState([]);



    const [chon_qua_tang, set_chon_qua_tang] = useState("");
    const [chon_qua_sn, set_chon_qua_sn] = useState("");
    const [chon_hoi_nghi, set_chon_hoi_nghi] = useState("");
    const [chon_qua_tang_hoi_nghi, set_chon_qua_tang_hoi_nghi] = useState("");
    const [chon_hinh_thuc_hoi_nghi, set_chon_hinh_thuc_hoi_nghi] = useState("");
    const [chon_qua_tang_2, set_chon_qua_tang_2] = useState("");
    const [chon_qua_tang_cam_xuc, set_chon_qua_tang_cam_xuc] = useState("");
    const [chon_qua_tang_cam_xuc_2, set_chon_qua_tang_cam_xuc_2] = useState("");
    // const [number1, set_number1] = useState("500000");
    // const [number2, set_number2] = useState("0");

    const [arr_hcp, set_arr_hcp] = useState([]);
    const [hcp, set_hcp] = useState("");
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

    const handeClick = (e) => {
        (e.target.checked) ? set_hcp(e.target.id) : set_hcp("")
        let lst = [];
        for (const element of arr_hcp) {
        if(element.ma_hcp_2 === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            element.check = false
            lst.push(element);
        }
        }
        set_arr_hcp(lst)
    }
    
    function addSchemaRow() {
    let newSchema = schema.map(row => ({ ...row }));
    newSchema.push( { so_luong: "", qua_gm: "", price: ""  } );
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


        // if (field === 'qua_gm') {
        //     const matchedItem = lst_chon_gimmick.find(item => item.ten_vat_tu_gim_qt === value);
        //     if (matchedItem) {
        //         updatedSchema[index]['price'] = matchedItem.gia_tien;
        //     } else {
        //         updatedSchema[index]['price'] = 0;
        //     }
        // }        
        console.log(updatedSchema);
        set_schema(updatedSchema);
    }


    // const fetch_id_data = async (select_id) => {
    //     SetLoading(true)
    //     const response = await fetch(`https://bi.meraplion.com/local/template/?id=${select_id}`)
        
    //     if (!response.ok) {
    //         SetLoading(false)
    //     }

    //     else {
    //     const data_arr = await response.json()
    //     const data = data_arr[0]
    //     set_text1(data.id)
    //     console.log(data)
    //     SetLoading(false)

    //     }
    // }

        const post_form_data = async (data) => {
            SetLoading(true);
            try {
                const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_planning_collect_hcp_gm/`, {
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
                    const successData = await response.json(); // Renamed 'data' to 'successData' to avoid conflict
                    console.log(successData);
                    SetALert(true);
                    SetALertType("alert-success");
                    SetALertText(successData.success_message);
                    setTimeout(() => {
                        SetALert(false);
                        SetLoading(false);
                    }, 2000);
                    set_chon_qua_tang_cam_xuc("");
                    set_chon_qua_tang_cam_xuc_2("");
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

        // set_number2(Number(number2)+1)

        let chon_qua_tang_cam_xuc_final = (chon_qua_tang_cam_xuc !== "") ? chon_qua_tang_cam_xuc : chon_qua_tang_cam_xuc_2

        const data = {
            "ma_hcp_2":ma_hcp[0] ,
            "manv":manv,
            "current_date":current_date,
            "chon_qua_tang":chon_qua_tang,
            "chon_qua_sn": chon_qua_sn,
            "chon_hoi_nghi": chon_hoi_nghi,
            "chon_qua_tang_hoi_nghi": chon_qua_tang_hoi_nghi,
            "inserted":"inserted",
            "uuid":uuid(),
            "status":"H",
            "approved_time":"",
            "approved_manv":"",
            "approved_uuid":"",
            "chon_hinh_thuc_hoi_nghi": chon_hinh_thuc_hoi_nghi,
            "chon_qua_tang_2": chon_qua_tang_2,
            "chon_qua_tang_cam_xuc": chon_qua_tang_cam_xuc_final,
            "qua_gmk": schema
        }
        
        let result = [];
        if (data.qua_gmk && data.qua_gmk.length > 0) {
        for (let item of data.qua_gmk) {
            result.push({
            ma_hcp_2: data.ma_hcp_2,
            manv: data.manv,
            inserted: Inserted_at(),
            uuid: data.uuid,
            qua_gm: item.qua_gm,
            so_luong: item.so_luong,
            price: item.price,
            });
        }
        } else {
        result = [data]; // Keep original data as a one-item array
        }
        console.log("data", data);
        console.log(result);

        post_form_data(result);


        // set_gia_tri_smn("");

    }

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
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp" ? "primary" : "outline-primary"} key={2} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp") } >ĐỀ XUẤT</Button>
                            <Button variant={location.pathname === "/formcontrol/tracking_chi_phi_hcp_crm" ? "primary" : "outline-primary"} key={1} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_crm") } >QL DUYỆT</Button>
                            <Button variant="outline-primary" key={3} onClick={ () => navigate.push("/formcontrol/tracking_chi_phi_hcp_bc") } >BC</Button>
                            {/* <Link style={{textDecoration:  "none"}} target="_blank" key={3} className="border-1 text-dark mx-2" to="/realtime/271?local_url=sp_f_data_tracking_chi_phi_hcp" >View Báo Cáo</Link> */}
                        </ButtonGroup>

                        {/* <Card className="mt-2">
                            <Card.Body>
                            <Card.Title>HCP: TRACKING CHI PHÍ ĐẦU TƯ 09/06</Card.Title>
                                <Card.Text>
                                Tổng số HCP đã đầu tư: {tong_hcp_da_dau_tu} HCP
                                <br></br>
                                Tổng số tiền đã đầu tư: {f.format(tong_tien_ke_hoach_da_dau_tu)} VNĐ
                                <br></br>
                                Tổng số tiền thực tế đã đầu tư: 0 VNĐ
                                </Card.Text>
                            </Card.Body>
                        </Card> */}

                        <ListGroup className="mt-2" style={{maxHeight: "250px", overflowY: "auto"}}>

                            <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên (KHONG DAU) " value={search} />

                            {arr_hcp
                                .filter( el => el.clean_ten_hcp.toLowerCase().includes( search.toLowerCase() ) )
                                .map( (el, index) =>
                                <ListGroup.Item className="mx-0 px-0 my-0 py-0" >
                                    <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.ma_hcp_2} label={ el.ten_hcp + ' - ' +  el.ten_kh_chung + ' - ' +  el.ma_kh_chung + ' - '+ el.phan_loai_hcp}/>
                                </ListGroup.Item>
                                )
                            }
                            {/* <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{'Tổng Tiền: '+ f.format (Number(el.tong_tien_kh)) }  </p> */}
                            {/* <p className="ml-4 mb-0"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.ma_hcp_1  + ' - Quà Tặng: '+ el.chon_qua_tang + ' - Quà SN: '+ el.chon_qua_sn + ' - Hội Nghị: '+ el.chon_hoi_nghi + ' - '+  el.chon_qua_tang_hoi_nghi  }  </p> */}


                        </ListGroup>

                        {/* <Form.Select disabled={chon_qua_tang_cam_xuc_2!==""} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang_cam_xuc(e.target.value)  }>                                 
                            <option value=''>
                                {lst_placeholder_cau_hoi[0]?.loai}
                            </option>

                            {lst_chon_qua_tang_cam_xuc
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        
                        </Form.Select> */}

                        {/* <Form.Select disabled={chon_qua_tang_cam_xuc!==""} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang_cam_xuc_2(e.target.value)  }>                                 
                            <option value=''>

                            {lst_placeholder_cau_hoi[1]?.loai}
                            </option>

                            {lst_chon_qua_tang_cam_xuc_2024_dot2
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        
                        </Form.Select> */}
                        
                        {/* <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang(e.target.value)  }>                                 
                            <option value=''>
                                {lst_placeholder_cau_hoi[2]?.loai}
                            </option>

                            {lst_chon_gimmick
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        
                        </Form.Select> */}

                        {/* <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_tang_2(e.target.value)  }>                                 
                            <option value=''>
                                {lst_placeholder_cau_hoi[3]?.loai}
                            </option>
                            {lst_chon_qua_1_5
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                    
                        </Form.Select> */}

                        {/* <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_qua_sn(e.target.value)  }>                                 
                            <option value=''>
                                {lst_placeholder_cau_hoi[4]?.loai}
                            </option>
                            {lst_chon_qua_sinh_nhat
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }

                        
                        </Form.Select> */}

                        {/* <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_hoi_nghi(e.target.value)  }>                                 
                            <option value=''>
                                {lst_placeholder_cau_hoi[5]?.loai}
                            </option>
                            {lst_chon_hoi_nghi
                            .map( (el, index) => 
                            <option value={el.chon_chinh}> {el.chon_chinh} </option>
                            )
                            }
                        </Form.Select> */}


                        
                        {/* { chon_hoi_nghi &&
                        <>
                            <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_chon_hinh_thuc_hoi_nghi(e.target.value)  }>                                 
                                <option value=''>Hình Thức</option>
                                {lst_chon_hinh_thuc_hoi_nghi
                                .map( (el, index) => 
                                <option value={el.chon_chinh}> {el.chon_chinh} </option>
                                )
                                }
                            </Form.Select>
                        </>
                        } */}


                    <div className="bg-white">
                        <Table bordered hover className="mt-2">
                            <thead>
                            <tr>
                                <th style={{ width: "60%" }}>Quà Gimmick</th>
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
                                        // const [qua_gm_value, price_value] = e.target.value.split('--');
                                        // console.log(qua_gm_value)
                                        // console.log(price_value)
                                        handleSchemaChange(index, "qua_gm", e.target.value);
                                        // handleSchemaChange(index, "price", price_value);
                                        }

                                    }
                                    className="mt-2"
                                    >
                                    <option value="">Click chọn</option>
                                    {lst_chon_gimmick.map((el) => (
                                        <option key={el.stt} value={ el.ten_vat_tu_gim_qt + '--' + el.gia_tien }>
                                        { el.ten_vat_tu_gim_qt + '--' + el.gia_tien + 'đ' }
                                        </option>
                                    ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                    type="number"
                                    value={row.column}
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
                        hcp === "" |
                        (
                            chon_qua_tang_cam_xuc === "" &
                            schema.length === 0
                            // chon_qua_tang === "" &
                            // chon_qua_sn === "" &
                            // chon_hoi_nghi === "" &
                            // chon_qua_tang_2 === ""
                        )
                        } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        </Form>
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


export default Tracking_chi_phi_hcp