import { useContext, useEffect, useState } from "react";
import './myvnp.css';
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    Col,
    Row,
    Container,
    Dropdown,
    Form,
    Spinner,
    InputGroup
} from "react-bootstrap";

// import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

function Theo_doi_bb_giao_nhan_hang_hoa(history) {

    const { userLogger, loading, SetLoading } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_bb_giao_nhan_hang_hoa', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        // fetch_kt_cache_data()
        } else {
            history.push('/login');
        };
    }, []);

    
    const [manv, set_manv] = useState("");
    const [lst_order, set_lst_order]  = useState({});
    const [select_order, set_select_order] = useState("");
    const [search, set_search] = useState("");
    const [kt_phanhoi, set_kt_phanhoi] = useState("");

    const fetch_kt_cache_data = async (select_order) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/kt_cache_data/?sodondathang=${select_order}`)
        const data = await response.json()
        set_lst_order(data[0])
        console.log(data[0])
        SetLoading(false)
    }

    const handle_submit = (e) => {
        e.preventDefault()
        console.log("first")
    }

    const handleSearchParam = (e) => {
        set_search(e.target.value);
    }

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            fetch_kt_cache_data(e.target.value);
            set_search(e.target.value);
        }
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
        <Row className="justify-content-center">
            <Col md={6} >
                <div>
                    <h1>Nhập thông tin thu hồi biên bản</h1>
                    <Form onSubmit={handle_submit}>
                    <Form.Control className="mt-2" type="text" onKeyDown={handleSearchEnter} value={search} onChange={handleSearchParam} placeholder="Tìm Đơn Hàng" />
                    <Form.Control className="mt-2" readOnly value = {lst_order.SODONDATHANG}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.MAKHDMS}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.DUNO}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.TENKHDMS}/>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT Đã Nhận </InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(manv + e.target.value) } value = {search}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT Đã Gửi BBGH </InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(e.target.value) } value = {search}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT Đã Gửi HĐGH</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(e.target.value) } value = {search}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT Phản Hồi</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_kt_phanhoi( `${e.target.value}Pristine` ) } value = {kt_phanhoi}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT Ghi Chú</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(e.target.value) } value = {kt_phanhoi}/></InputGroup>

                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-success text-white">MDS PHẢN HỒI</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(e.target.value) } value = {search}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-success text-white">MDS GHI CHÚ</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_search(e.target.value) } value = {search}/></InputGroup>
                    <Button className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                    </Form>

                    {loading &&
                    <div>
                        <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                        <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                        </Spinner>
                    </div>
                    }

                </div>
            </Col>
        </Row>
        </Container>
        )
    }
    else {
        return (
    
            <div>
                <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner>
            </div>
            
        )
    }

}

export default Theo_doi_bb_giao_nhan_hang_hoa

{/* <Dropdown required disabled={false} block="true" onSelect = {e =>set_select_order(e)}>

<Dropdown.Toggle className="text-dark border-0 bg-warning" style={{width: "100%"}} block="true">{select_order ==="" ? "Bấm Để Chọn": select_order}</Dropdown.Toggle>
<Dropdown.Menu style={{width: "100%"}}>
<Form.Control className='border-0' type="text" style={{}} onChange={ (e) => set_search(e.target.value) } placeholder="Tìm Mã" />
<Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
    {lst_order
    .filter( el => el.SODONDATHANG.includes(search))
    .slice(0, 20)
    .map(el =>
    <Dropdown.Item key={el.SODONDATHANG} eventKey={el.SODONDATHANG}> {el.SODONDATHANG} </Dropdown.Item>
    )}
</Dropdown.Menu>
</Dropdown> */}