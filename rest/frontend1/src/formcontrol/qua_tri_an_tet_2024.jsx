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
    FloatingLabel,
    Stack,
    Dropdown,
    // Badge
    // InputGroup,
    
    
} from "react-bootstrap";

function Qua_tri_an_tet_2024({history, location}) {
    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const location_search = new URLSearchParams(location.search)

    const fetch_initial_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/qua_tri_an_tet_2024/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_danhsach(data['data']);
            SetLoading(false);
        }
        else {
            SetLoading(false);
        }
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Qua_tri_an_tet_2024', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        // console.log("suasdt",location_search.get('suasdt'))
        // let bol1 = location_search.get('edit') === '1' ? true : false
        // SET_EDITMODE(bol1);
        

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            console.log([latitude, longitude])
    
        });

        } else {
            history.push('/login?redirect=/formcontrol/qua_tri_an_tet_2024');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [manv, set_manv] = useState("");
    const [initialPosition, setInitialPosition] = useState([0,0]);

    const [danhsach, set_danhsach] = useState([]);
    const [search_hco_bv, set_search_hco_bv] = useState("");
    const [chon_ma_kh, set_chon_ma_kh] = useState("");

    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFile_2, setSelectedFile_2] = useState([]);

    const choose_images = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile([...selectedFile, ...e.target.files]);
        }

    const choose_images_2 = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile_2([...selectedFile_2, ...e.target.files]);
        }
    
    
    
    const clear_data = () => {
        setSelectedFile([]);
        setSelectedFile_2([]);
        set_chon_ma_kh("");
        // set_sdt("");
        // set_ten_hcp("");
        // set_chon_ma_kh("");
        // set_chon_mahcp2_bv("");
        // set_arr_co_lam_phong_mach(data_chon_co_pm);
        // set_chon_co_code(false);
        // set_chon_hco_pcl("");
        // set_chon_chuc_vu_pcl("");
        // set_so_tiem_nang(0);
        // set_so_luot_kham(0);
        // set_uuid_old("");
        // set_inserted_at("");
        // set_ma_hcp_1("");
        // set_ma_hcp_2("");
    }

    const post_form_data = async (data) => {
        SetLoading(true);

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        for (let i of selectedFile) {
            formData.append('checkin', i)
        }
        for (let j of selectedFile_2) {
            formData.append('quatang', j)
        }

        const response = await fetch(`https://bi.meraplion.com/local/file_upload_qua_tri_an_tet_2024/`, {
            method: "POST",
            headers: {
            // "Content-Type": "application/json",
            },
            body: formData,
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

    const handle_click_xoa_file = (fileName) => {
        setSelectedFile((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
          );
    };

    const handle_click_xoa_file_2 = (fileName) => {
        setSelectedFile_2((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
          );
    };

    const handle_submit = (e) => {
        e.preventDefault();
        // const current_date = formatDate(Date());

        // let iso_time = new Date()
        // iso_time.setHours(iso_time.getHours() + 7)
        // iso_time = iso_time.toISOString()
        // iso_time = iso_time.replace("T", " ")
        // iso_time = iso_time.replace("Z", " ")
        // console.log(iso_time)


        const data = {
            "manv":manv,
            "ma_kh": chon_ma_kh.split("-")[0],
            "lat":initialPosition[0],
            "lng":initialPosition[1],
            "uuid": uuid()
        }
        console.log(data);
        post_form_data(data);

    }

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
            </Modal>
            <Row className="justify-content-center">
                <Col md={4} >

                    <div>
                        {/* ALERT COMPONENT */}
                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}

                        <Row>
                        <Col className="d-flex justify-content-center">
                            <Button className="mt-2" size="sm" variant="secondary" onClick={ () => window.open('https://ds.merapgroup.com/reportscreen/200', '_blank') } >
                            Bấm xem Báo Cáo
                            {/* <Link style={{textDecoration:  "none"}} target="_blank" key={3} className="border-1 mt-2" to="/reportscreen/200" ></Link> */}
                            </Button>
                        </Col>
                        </Row>

                        <Dropdown className="mt-2 "  autoClose="true" block="true" onSelect = { (e) => set_chon_ma_kh(e) }>
                                
                                <Dropdown.Toggle className="bg-white text-dark text-left flex-grow-1 w-100 border-success"  style={{height:"60px", borderWidth: "0.1rem"}}> 
                                
                                {chon_ma_kh ==="" ? "Chọn Khách Hàng": chon_ma_kh}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="w-100" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm không dấu mã hoặc tên" onChange={ (e) => set_search_hco_bv(e.target.value.toLowerCase()) } value = {search_hco_bv} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    danhsach
                                    .filter( el => el.clean_ma_ten_kh.includes(search_hco_bv) )
                                    .map( (el, idx) =>
                                        <Dropdown.Item key={idx} eventKey={el.ma_kh +'-'+ el.ten_kh}> {el.ma_kh +'-'+ el.ten_kh}  </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>

                        <Card className="mt-2 border-success" style={{ borderWidth: "0.1rem" }}>
                        <Card.Title >Upload 01 Hình Ảnh (Có chân dung tại NT)*</Card.Title>
                        <Card.Text >Tọa độ hiện tại của bạn {initialPosition[0]}-{initialPosition[1]} </Card.Text>
                        <Form.Control id='customFileInputCapture' type="file" accept="image/*" capture="environment" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
                        <Button style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInputCapture").click()}>
                            CHỤP HÌNH
                        </Button>
                        
                        <Form.Control id='customFileInput' type="file" accept="image/*" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
                        <Button className="mt-2" style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput").click()}>
                            UP HÌNH TỪ MÁY
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

                        
                        <Card className="mt-2 border-success" style={{ borderWidth: "0.1rem" }}>
                        <Card.Title >Upload 01 Hình Ảnh Tặng Quà*</Card.Title>
                        <Form.Control id='customFileInputCapture_2' accept="image/*" capture="environment" type="file" style={{width: "115px", fontWeight: "bold" , display: "none"}} multiple={true}  onChange={ (e) => choose_images_2(e) } ></Form.Control>
                        <Button style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInputCapture_2").click()}>
                            CHỤP HÌNH
                        </Button>

                        <Form.Control id='customFileInput_2' accept="image/*" type="file" style={{width: "115px", fontWeight: "bold" , display: "none"}} multiple={true}  onChange={ (e) => choose_images_2(e) } ></Form.Control>
                        <Button className="mt-2" style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput_2").click()}>
                            UP HÌNH TỪ MÁY
                        </Button>
                        <h5 className="ml-1 mt-1 text-wrap">{Array.from(selectedFile_2).length} hình đã up</h5>
                        
                        {Array.from(selectedFile_2)
                        .map( (file, index) => 
                            <ListGroup horizontal key={index}>
                            <ListGroup.Item className="text-wrap">{file.name}</ListGroup.Item>
                            <ListGroup.Item>
                            <Button size="sm" variant="danger" onClick={ () => handle_click_xoa_file_2(file.name) }> Xóa </Button>
                            </ListGroup.Item>
                            </ListGroup>
                            
                        )
                        }
                        </Card>

                        {/* <Form.Group controlId="formFileMultiple" className="mb-3" >
                        <Form.Label>Multiple files input example</Form.Label>
                        <Form.Control type="file" style={{width: "115px", fontWeight: "bold"}} multiple={true} />
                        </Form.Group> */}




                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        
                        <Button disabled={
                        chon_ma_kh === "" |
                        Array.from(selectedFile).length < 1 |
                        Array.from(selectedFile_2).length < 1
                        } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN 
                        </Button>
                        <p>version 1.5</p>
                        
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
    }
}


export default Qua_tri_an_tet_2024