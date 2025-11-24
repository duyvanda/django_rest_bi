/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
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
    ListGroup
} from "react-bootstrap";

export function MdsTraThuongCmmQ12025L2() {
    const { Inserted_at, userLogger, loading, SetLoading, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useNavigate();
    
    const fetch_initial_data = async (manv) => {
        SetLoading(true);
        // Data for L2 is different
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_data_mds_tra_thuong_cmm_2025_l2/?manv=${manv}`)
        
        if (response.ok) {
            const data = await response.json()
            set_data_table(data['data'] || []);
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
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'mds_tra_thuong_cmm_q12025_l2', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            navigate('/login?redirect=/formcontrol/mds_tra_thuong_cmm_q12025');
        };
    }, [count]);

    
    const [manv, set_manv] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFile, setSelectedFile] = useState([]);

    const choose_images = (e) => {
        setSelectedFile([...selectedFile, ...e.target.files]);
        }

    const [data_table, set_data_table] = useState([])

    const clear_data = () => {
        setSelectedFile([]);
    }

    const post_form_data = async (data) => {
        SetLoading(true);

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        for (let i of selectedFile) {
            formData.append('images', i)
        }

        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_data_mds_tra_thuong_cmm_q32025/`, {
            method: "POST",
            headers: {
            },
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
        } else {
            const data = await response.json();
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
            clear_data();
            setCount(count+1);

        }
    }

    const handle_click_xoa_file = (fileName) => {
        setSelectedFile((prevFiles) =>
            prevFiles.filter((file) => file.name !== fileName)
          );
    };

    const handleEdit = (item) => {
      setSelectedItem(item);
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setSelectedItem(null);
      setSelectedFile([]);
    };
  
    const handleSave = () => {
        const data = {
            "manv": manv,
            "ma_kh_dms":selectedItem.ma_kh_dms,
            "ten_kh":selectedItem.ten_kh,
            "inserted_at": Inserted_at(),
            "type":"l2"
        }
        post_form_data([data]);
        setShowModal(false);
      };

    return (
    <Container className="bg-teal-100 h-100" fluid>
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
        <Row>
            
                    <h1 className="ms-auto" style={{ textAlign: 'justify' }} >TRẢ THƯỞNG CMM 2025 - L2</h1>
                    
                    {data_table
                    .map( (el, idx) =>
                        <Col key={idx} xs={12} md={4} lg={3} >
                            <Card className="card-hover-effect">
                                <Card.Body>
                                <Card.Title>Tên KH {idx+1}: {el.ten_kh}</Card.Title>
                                <Card.Text>
                                Mã KH: {el.ma_kh_dms}.<br></br>
                                Tình Trạng Trả Thưởng: { Number(el.done) === 1 ? "Đã trả" : "Chưa trả"}.
                                </Card.Text>
                                <Button onClick={() => handleEdit(el)} size="sm"  variant={el.done === 0 ? "primary" : "outline-secondary"} className={el.done === 0 ? "btn-merap-primary" : ""}  >Thực hiện trả thưởng</Button>
                                </Card.Body>
                            
                            </Card>
                        </Col>
                    )
                    }
                    
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header>
                        <Modal.Title>Xác nhận trả thưởng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                        
                        <Form.Group controlId="formName">
                        <Form.Label>Tên KH: {selectedItem?.ten_kh || ''} </Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                        <Form.Label>Mã KH: {selectedItem?.ma_kh_dms || ''}</Form.Label>
                        </Form.Group>

                        <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Mã Quà</th>
                            <th>Tên Quà</th>
                            <th>SL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedItem?.detail?.map((gift, index) => (
                            <tr key={index} className="py-0">
                            <td className="py-0">{gift.ma_qua}</td>
                            <td className="py-0">{gift.ten_qua}</td>
                            <td className="py-0">{gift.sl}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                        
                        </Form>
                        
                        <Form.Control id='customFileInput' type="file" accept="image/*" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
                            <Button className="mt-2" style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput").click()}>
                            UP HÌNH <br></br> (ít nhất 2 hình: Khách hàng nhận hàng và Biên bản ký nhận hàng)
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
                        Array.from(selectedFile).length < 2 |
                        Number(selectedItem?.done)  === 1
                        } 
                        variant="primary" onClick={handleSave} >
                        LƯU (Ver: 20-10-2025)
                        </Button>
                        </Modal.Footer>
                    </Modal>

        </Row>
    </Container>
    )
}
