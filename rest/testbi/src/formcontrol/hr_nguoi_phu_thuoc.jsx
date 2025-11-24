/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
// import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import InputMask from 'react-input-mask';
import {
    Button,
    Table,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Modal,
    Card,
    ListGroup,
    // FloatingLabel,
    // Stack,
    // Dropdown,
    // ListGroup,
    // ButtonGroup,
    // Badge
    // InputGroup,
    


} from "react-bootstrap";

function Hr_nguoi_phu_thuoc({history, location}) {
    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useHistory();
    const location_search = new URLSearchParams(location.search)

    const fetch_initial_data = async (manv) => {
        SetLoading(true);
        const response = await fetch(`https://bi.meraplion.com/local/hr_nguoi_phu_thuoc/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_data_table(data['data']);
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
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Hr_nguoi_phu_thuoc', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login?redirect=/formcontrol/hr_nguoi_phu_thuoc');
        };
    }, [count]);

    
    const f = new Intl.NumberFormat();
    const [manv, set_manv] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFile, setSelectedFile] = useState([]);

    const choose_images = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile([...selectedFile, ...e.target.files]);
        }

    const [data_table, set_data_table] = useState([])

    const clear_data = () => {
        setSelectedFile([]);
        // setSelectedFile_2([]);
        // set_chon_ma_kh("");
    }

    const post_form_data = async (data) => {
        SetLoading(true);

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        for (let i of selectedFile) {
            formData.append('images', i)
        }

        const response = await fetch(`https://bi.meraplion.com/local/file_upload_hr_nguoi_phu_thuoc/`, {
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

    // const handle_click = (fileName) => {
    //     setSelectedFile((prevFiles) =>
    //         prevFiles.filter((file) => file.name !== fileName)
    //       );
    // };

    // const handle_click_2 = (fileName) => {
    //     setSelectedFile_2((prevFiles) =>
    //         prevFiles.filter((file) => file.name !== fileName)
    //       );
    // };

    const handle_click_xoa_file = (fileName) => {
        setSelectedFile((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
          );
    };

    // const handle_submit = (e) => {
    //     e.preventDefault();

    //     const data = {
    //         "manv":manv,
    //         "ma_kh": chon_ma_kh.split("-")[0],
    //         "lat":initialPosition[0],
    //         "lng":initialPosition[1],
    //         "uuid": uuid()
    //     }
    //     console.log(data);
    //     post_form_data(data);

    // }
  
    const handleEdit = (item) => {
      setSelectedItem(item);
      setShowModal(true);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedItem((prevItem) => ({
          ...prevItem,
          [name]: value,
        }));
      };
  
    const handleClose = () => {
      setShowModal(false);
      setSelectedItem(null);
      setSelectedFile([]);
    };
  
    const handleSave = () => {
        const updatedData = data_table.map((item) =>
          item.id === selectedItem.id ? selectedItem : item
        );
        set_data_table(updatedData);
        console.log(selectedItem);
        post_form_data(selectedItem);
        setShowModal(false);
      };

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
            </Modal>
            <Row>
                

                        {/* ALERT COMPONENT */}
                        {/* <Form onSubmit={handle_submit}> */}
                        {/* START FORM BODY */}



                        {data_table.length !== 0 ?

                        <h1 className="ms-auto" style={{ textAlign: 'justify' }} >Anh chị vui lòng kiểm tra thông tin NPT và tải hình ảnh CCCD/ Mã định danh. Nếu có điều chỉnh vui lòng sửa trực tiếp trên đường dẫn</h1>

                        :

                        <h1>Anh chị CHƯA đăng ký người phụ thuộc</h1>

                        }
                        
                        {data_table
                            .map( (el, idx) =>
                        <Col  xs={12} lg={6}>
                        
                        <Card>
                            <Card.Body>
                            <Card.Title>Tên NPT {idx+1}: {el.ten_npt}</Card.Title>
                            <Row>
                            <Col>
                            <Card.Text>
                            Ngày sinh: {el.ngay_sinh}.<br></br>
                            MST: {el.mst_npt}.<br></br>
                            CCCD/ Mã định danh: {el.cccd}.<br></br>
                            </Card.Text>
                            </Col>
                            <Col>
                            <Card.Text>
                            Quan hệ: {el.quan_he}.<br></br>
                            Thời gian: {el.thoi_gian} - {el.thoi_gian_den}. <br></br>
                            </Card.Text>
                            
                            </Col>
                            
                            
                            </Row>
                            <Button onClick={() => handleEdit(el)} size="sm" variant="primary">Điều chỉnh</Button>
                            
                            </Card.Body>
                        
                        </Card>
                        </Col>
                        )
                        }
                        

                        

                        
                        {/* <Button disabled={
                        chon_ma_kh === "" |
                        Array.from(selectedFile).length < 1 |
                        Array.from(selectedFile_2).length < 1
                        } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN 
                        </Button>
                        <p>version 1.4</p> */}
                        
                        {/* </Form> */}

                        <Modal show={showModal} onHide={handleClose}>
                            <Modal.Header>
                            <Modal.Title>Sửa người phụ thuộc</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <Form>
                            
                            <Form.Group controlId="formName">
                            <Form.Label>Tên NPT</Form.Label>
                            <Form.Control
                            type="text"
                            name="ten_npt"
                            value={selectedItem?.ten_npt || ''}
                            onChange={handleInputChange}
                            />
                            </Form.Group>

                            <Form.Group controlId="dateInput" className="mb-3">
                            <Form.Label>Ngày sinh (dd/mm/yyyy):</Form.Label>
                            <InputMask
                            mask="99/99/9999"
                            value={selectedItem?.ngay_sinh || ''}
                            onChange={handleInputChange}
                            placeholder="DD/MM/YYYY"
                            className="form-control"
                            name="ngay_sinh"
                            />
                            </Form.Group>


                            <Form.Group controlId="formDescription">
                            <Form.Label>Quan hệ</Form.Label>
                            <Form.Control
                            as="textarea"
                            name="quan_he"
                            value={selectedItem?.quan_he || ''}
                            onChange={handleInputChange}
                            />
                            </Form.Group>

                            <Form.Group controlId="formDescription">
                            <Form.Label>CCCD/ Mã định danh</Form.Label>
                            <Form.Control
                            as="textarea"
                            name="cccd"
                            value={selectedItem?.cccd || ''}
                            onChange={handleInputChange}
                            />
                            </Form.Group>
                            
                            </Form>
                            
                            <Form.Control id='customFileInput' type="file" accept="image/*" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
                                <Button className="mt-2" style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput").click()}>
                                UP HÌNH CCCD/MĐD TỪ MÁY (02 ẢNH MẶT TRƯỚC VÀ SAU)
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

                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            ĐÓNG
                            </Button>
                            <Button disabled = {
                            Array.from(selectedFile).length < 1
                            } 
                            variant="primary" onClick={handleSave} >
                            LƯU
                            </Button>
                            </Modal.Footer>
                        </Modal>

                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}                
            </Row>
        </Container>
        )
    }
    else {
    }
}


export default Hr_nguoi_phu_thuoc

// <Table  className="mb-0" striped bordered variant="light" style={{ tableLayout: 'fixed' }}>
//                         <thead >
//                             <tr>
//                                 <th style={{ width: '20px' }}>id</th>
//                                 <th>ten_npt</th>
//                                 <th>ngay_sinh</th>
//                                 <th>mst_npt</th>
//                                 <th>cccd</th>
//                                 <th style={{ width: '50px' }}>QH</th>
//                                 <th style={{ width: '80px' }}>TG</th>
//                                 <th style={{ width: '60px' }}>Sửa</th>
//                             </tr>
//                         </thead>
//                             <tbody >
//                             {data_table
//                             .map( (el) =>
//                             <tr>
//                                 <td className="align-middle">{el.id}</td>
//                                 <td className="wrap-text">{el.ten_npt}</td>
//                                 <td>{el.ngay_sinh}</td>
//                                 <td className="wrap-text">{el.mst_npt}</td>
//                                 <td className="wrap-text">{el.cccd}</td>
//                                 <td className="wrap-text">{el.quan_he}</td>
//                                 <td className="wrap-text">{el.thoi_gian}</td>
//                                 <td>
                                
//                                 <Button variant="primary" size="sm" onClick={() => handleEdit(el)} >
//                                 Sửa
//                                 </Button>
                                    
//                                 </td>
//                             </tr>
//                             )
//                             }
//                             </tbody>
//                             </Table>