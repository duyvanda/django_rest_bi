/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
// import { Link } from "react-router-dom";
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
    FloatingLabel,
    Table,
    // Stack,
    // Dropdown
} from "react-bootstrap";

// import { Trash } from "react-bootstrap-icons";

function Form_log_checkin_nhan_hang({history}) {
    
    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=${manv}&dropper=0`)
        // const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=MR3055`)
        
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        set_data_table(data['danhsach']);
        set_data_table_short(data['data_table_short']);
        set_so_kien_hang(data['so_kien_hang']);
        console.log(data);
        SetLoading(false);

        }
    }

    const fetch_initial_data_dropper = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=${manv}&dropper=1`)
        // const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=MR3055`)
        
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        set_data_table(data['danhsach']);
        set_data_table_short(data['data_table_short']);
        set_so_kien_hang(data['so_kien_hang']);
        console.log(data);
        SetLoading(false);

        }
    }

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {

        // console.log("AC")
        
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            console.log("current loc", [latitude, longitude])
        });
        
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Form_log_checkin_nhan_hang', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );

        // navigator.geolocation.getCurrentPosition(position => {
        //     const { latitude, longitude } = position.coords;
        //     setInitialPosition([latitude, longitude]);
        //     console.log("current loc", [latitude, longitude])
        // });


        } else {
            history.push('/login?redirect=/formcontrol/form_ghi_nhan_hang_log');
        };
    }, []);

    const [DROPMOD, SET_DROPMOD] = useState(false);
    const [manv, set_manv] = useState("");
    const [initialPosition, setInitialPosition] = useState([0,0]);
    const [selectedFile, setSelectedFile] = useState([]);

    const [lst_ghi_chu_chenh_lech, set_lst_ghi_chu_chenh_lech] = useState(['Chưa xác định nguyên nhân', 'Nhận thiếu tại kho', 'Giao nhầm điểm trước', 'NVC giao chưa đủ','Log giao chưa đủ']);
    const [selected_ghi_chu_chenh_lech, set_selected_ghi_chu_chenh_lech] = useState(['Chưa xác định nguyên nhân', 'Nhận thiếu tại kho', 'Giao nhầm điểm trước']);
    const [sl_kien_thuc_nhan, set_sl_kien_thuc_nhan] = useState('');
    const [sl_tui_thuc_nhan, set_sl_tui_thuc_nhan] = useState(0);
    const [sl_thung_thuc_nhan, set_sl_thung_thuc_nhan] = useState(0);
    // const [lst_hinh_thuc_thau, set_lst_hinh_thuc_thau] = useState([]);


    const [so_kien_hang, set_so_kien_hang] = useState (0);
    const [data_table, set_data_table] = useState ([]);
    const [data_table_short, set_data_table_short] = useState ([]);

    const deleteRow = (ma_chung_tu, tru_so_kien_hang) => {
        set_data_table(data_table.filter((row) => row.ma_chung_tu !== ma_chung_tu));
        set_so_kien_hang(Number(so_kien_hang) - Number(tru_so_kien_hang))
      };

    const choose_images = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile([...selectedFile, ...e.target.files]);
    }

    const handle_click_xoa_file = (fileName) => {
        setSelectedFile((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
          );
    };    

    const clear_data = () => {
        setSelectedFile([]);
        set_selected_ghi_chu_chenh_lech("");
        set_sl_kien_thuc_nhan("");
        set_sl_tui_thuc_nhan("");
        set_sl_thung_thuc_nhan("");
    }

    const post_form_data = async (data) => {
        SetLoading(true);

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        for (let i of selectedFile) {
            formData.append('images', i)
        }
        const response = await fetch(`https://bi.meraplion.com/local/file_upload_form_data_log/`, {
            method: "POST",
            headers: {
            // "Content-Type": "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
        } else {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
            clear_data();

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        // const lst_value_dd1 = []
        // for (const i of lst_dd1) {
        //     if (i.checked === true) {lst_value_dd1.push(i.id)}
        // };
        
        // console.log("lst_value_dd1", lst_value_dd1);

        const cn_sdh = data_table.map(obj => obj.cn_sdh);

        const data = {
            "manv":manv,
            "role":data_table[0].role,
            "uuid":uuid(),
            "sl_kien_thuc_nhan":Number(sl_kien_thuc_nhan),
            "sl_tui_thuc_nhan":Number(sl_tui_thuc_nhan),
            "sl_thung_thuc_nhan":Number(sl_thung_thuc_nhan),
            "selected_ghi_chu_chenh_lech":selected_ghi_chu_chenh_lech,
            "lat": initialPosition[0],
            "lgn": initialPosition[1],
            "cn_sdh": cn_sdh,
        }
        console.log(data);
        post_form_data(data);
        // set_text("");
    }

    // if (data_table.length >= 1) {
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
                        {/* <Button className="mt-2" variant="primary" size="sm" onClick={() => window.open("https://ds.merapgroup.com/formcontrol/form_ghi_nhan_hang_log", "_blank")}>Mở phiên bản web</Button> */}
                        <ButtonGroup style={{width: "100%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                            <Button style={{fontWeight: "bold"}}  key={1} onClick={ () => {SET_DROPMOD(false); clear_data(); fetch_initial_data(manv); } } variant={!DROPMOD ? "primary" : "outline-secondary"} className="border-0" >NGƯỜI NHẬN</Button>
                            {/* <Button style={{width: "60px"}} key={2} onClick={ () => {navigate.push("/formcontrol/tao_hcp_bv?edit=1"); SET_DROPMOD(true); clear_data() } } className="ml-1 bg-warning text-dark border-0" >Sửa BV</Button> */}
                            <Button style={{fontWeight: "bold"}} key={3} onClick={ () => { SET_DROPMOD(true); clear_data(); fetch_initial_data_dropper(manv); } } variant={DROPMOD ? "primary" : "outline-secondary"} className="border-0" >NGƯỜI THẢ</Button>
                        </ButtonGroup>
                        
                        <h3>FORM GHI NHẬN HÀNG HÓA LOG ({so_kien_hang})</h3>
                        { data_table.length === 0 &&
                        <h4 className="text-danger">Anh / Chị không có mã chứng từ nào để xác nhận</h4>
                        }

                        <div style={{ overflowX: 'auto' }}>
                        <Table striped bordered hover style={{ tableLayout: 'fixed', backgroundColor: '#f0f8ff' }} >
                            <thead>
                            <tr style={{ padding: '5px', fontSize: '12px' }}>
                                <th style={{ width: '120px' }}>Mã CT</th>
                                <th style={{ width: '30px', textAlign: "center" }}>X</th>
                                <th style={{ width: '100px' }} >Thả C1</th>
                                <th style={{ width: '100px' }} >Nhận C1</th>
                                <th style={{ width: '100px' }} >Thả C2</th>
                                <th style={{ width: '100px' }} >Nhận C2</th>
                                <th style={{ width: '160px' }} >SXH</th>
                                {/* <th>Column 5</th>
                                <th>Column 6</th> */}
                                {/* Add more columns as needed */}
                            </tr>
                            </thead>
                            <tbody>
                            {data_table                        
                            .map( (el, index) =>
                            <tr key={index} style={{ padding: '5px', fontSize: '16px' }}>
                                <td className="wrap-text" >{el.ma_chung_tu}</td>
                                
                                <td>
                                <Button variant="danger" size="sm" onClick={() => deleteRow(el.ma_chung_tu, el.so_kien_hang)}>
                                {/* <BsTrash /> */}
                                </Button>
                                </td>

                                <td className="wrap-text" >{el.nhan_vien_tha_hang_1}</td>
                                <td className="wrap-text" >{el.nguoi_nhan_chang_1}</td>
                                <td className="wrap-text" >{el.nhan_vien_tha_hang_2}</td>
                                <td className="wrap-text" >{el.nguoi_nhan_chang_2}</td>
                                <td className="wrap-text" >{el.string_agg_sxh}</td>
                                
                                {/* <td>Data 5</td>
                                <td>Data 6</td> */}
                                {/* Add more data as needed */}
                            </tr>
                            )
                            }
                            {/* Add more rows as needed */}
                            </tbody>
                        </Table>
                        </div>
                        {DROPMOD === false &&
                        <>
                            {/* <p>abc</p> */}
                            {/* NUMBER */}
                            <FloatingLabel label="SL kiện thực nhận" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_sl_kien_thuc_nhan(Number(e.target.value)) } value = {sl_kien_thuc_nhan} /> </FloatingLabel>
                            { (so_kien_hang !== sl_kien_thuc_nhan && sl_kien_thuc_nhan !== '') &&
                            <p style={{color:'red'}}>Đã có chênh lệch với DMS</p>
                            }
                            <FloatingLabel label="SL túi thực nhận" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_sl_tui_thuc_nhan(e.target.value) } value = {sl_tui_thuc_nhan} /> </FloatingLabel>
                            <FloatingLabel label="SL thùng thực nhận" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_sl_thung_thuc_nhan(e.target.value) } value = {sl_thung_thuc_nhan} /> </FloatingLabel>

                            {/* <FloatingLabel label="Ghi chú chênh lệch" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_lst_ghi_chu_chenh_lech(e.target.value) } value = {lst_ghi_chu_chenh_lech}/> </FloatingLabel> */}
                            
                            <Form.Select value={selected_ghi_chu_chenh_lech} required={so_kien_hang !== sl_kien_thuc_nhan} className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_selected_ghi_chu_chenh_lech(e.target.value) }>
                                <option value="">Ghi chú chênh lệch</option>
                                {lst_ghi_chu_chenh_lech
                                .map( (el, index) => 
                                <option key={index} value={el}>{el}</option>
                                )
                                }
                            </Form.Select>
                        </>
                        }
                        
                        <Card className="mt-2 border-success" style={{ borderWidth: "0.1rem" }}>
                        <Card.Title >Upload ít nhất 02 Hình Ảnh nhận hàng*</Card.Title>
                        <Card.Text >Tọa độ hiện tại của bạn {initialPosition[0]}-{initialPosition[1]} </Card.Text>
                        <Form.Control id='customFileInput' required type="file" accept="image/*" capture="environment" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
                        <Button style={{ width: '16rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput").click()}>
                            CHỌN HÌNH
                        </Button>
                        <h5 className="ml-1 mt-1 text-wrap">{Array.from(selectedFile).length} hình đã up</h5>
                        
                        {Array.from(selectedFile)
                        .map( (file, index) =>
                            <ListGroup horizontal key={index}>
                            <ListGroup.Item className="text-wrap">{file.name}</ListGroup.Item>
                            <ListGroup.Item>
                            <Button className="" size="sm" variant="danger" onClick={ () => handle_click_xoa_file(file.name) }> Xóa </Button>
                            </ListGroup.Item>
                            </ListGroup>
                        )
                        }
                        </Card>

                        <Button disabled={
                            Array.from(selectedFile).length < 2 |
                            data_table.length === 0
                            } className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        <p>version 1.9(03/03/2025)
                        </p>
                        
                        </Form>
                        {/* END FORM BODY */}

                    </div>
                </Col>
            </Row>
        </Container>
        )
    }
    else {
        return (
    
            <div>
                <h1 className="text-danger text-center">Anh / Chị không có mã chứng từ nào để xác nhận</h1>
                {/* <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner> */}
            </div>
            
        )
    }

}

export default Form_log_checkin_nhan_hang

// https://www.geeksforgeeks.org/how-to-stretch-flexbox-to-fill-the-entire-container-in-bootstrap/

// const on_click_them_san_pham = (e) => {
// const arr2 = [...lst_item];
// const data = {
// "id":sp_id,
// "name":sp_sl,
// }
// arr2.push(data);
// set_lst_item(arr2);
// }

// const on_click_xoa_san_pham = (idx) => {
// console.log(idx);
// const arr2 = lst_item.filter( (_, index) => index !== idx)
// set_lst_item(arr2);
// }

// const on_click_xoa_san_pham = (idx) => {
//     console.log(idx);
//     const arr2 = lst_item.filter( (_, index) => index !== idx)
//     set_lst_item(arr2);
// }
