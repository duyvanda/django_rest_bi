import { useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import MYVNPContext from "../context/MYVNPContext";
import { FaChartPie } from 'react-icons/fa';


function VnpCreateKH({history}) {

  const navigate = useHistory();

  const URL = "http://localhost:5000/feedback"

  const {
    chiNhanh,
    fetchKHVNP,
    khvnp,
    fetchTinhThanh,
    handleSaveForm,
    alert,
    alertType,
    alertText,
    loading,
  } = useContext(MYVNPContext);

  const [ma_kh_search, set_ma_kh_search] = useState("");
  const [id, set_id] = useState("");
  const [ma_kh_dms, set_ma_kh_dms] = useState("");
  const [receiverName, set_receiverName] = useState("");
  const [receiverAddress, set_receiverAddress] = useState("");
  const [receiverProvinceCode, set_receiverProvinceCode] = useState("");
  const [receiverDistrictCode, set_receiverDistrictCode] = useState("");
  const [receiverCommuneCode, set_receiverCommuneCode] = useState("");
  const [receiverPhone, set_receiverPhone] = useState("");
  const [receiverEmail, set_receiverEmail] = useState("");
  const [edit, set_edit] = useState(false);

  const handle_submit = (e) => {
    e.preventDefault()
    console.log("first")
  }; 

  return (
    <Container className="bg-teal-100 h-100" fluid>
      <Row className="justify-content-center">
        <Col md={6} >
          {loading === false ?
              <div>
                <Form onSubmit={handle_submit}>
                  <InputGroup>
                    <Button variant="warning" className="font-weight-bold" size="sm" onClick={ () => navigate.push("/myvnpost") }>QUAY LẠI</Button>
                    <h1 className="mt-2 ml-2">THÊM MỚI KHÁCH HÀNG</h1>
                  </InputGroup>
                  <Form.Control className="mt-2" placeholder="ID" onChange={ (e) => set_id(e.target.value) } value = {id} />
                  <Form.Control className="mt-2" placeholder="MÃ KH" onChange={ (e) => set_ma_kh_dms(e.target.value) } value = {ma_kh_dms}/>
                  <Form.Control className="mt-2" placeholder="TÊN KH" onChange={ (e) => set_receiverName(e.target.value) } value = {receiverName}/>
                  <Form.Control className="mt-2" placeholder="ĐỊA CHỈ" onChange={ (e) => set_receiverAddress(e.target.value) } value = {receiverAddress}/>
                  <Form.Control className="mt-2" placeholder="MÃ TỈNH" onChange={ (e) => set_receiverProvinceCode(e.target.value) } value = {receiverProvinceCode}/>  
                  <Form.Control className="mt-2" placeholder="MÃ QUẬN" onChange={ (e) => set_receiverDistrictCode(e.target.value) } value = {receiverDistrictCode}/>  
                  <Form.Control className="mt-2" placeholder="MÃ PHƯỜNG XÃ" onChange={ (e) => set_receiverCommuneCode(e.target.value) } value = {receiverCommuneCode}/>  
                  <Form.Control className="mt-2" placeholder="SỐ ĐIỆN THOẠI" onChange={ (e) => set_receiverPhone(e.target.value) } value = {receiverPhone}/>  
                  <Form.Control className="mt-2" placeholder="EMAIL" onChange={ (e) => set_receiverEmail(e.target.value) } value = {receiverEmail}/>
                  <Button className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Form>
              </div>              
          :
          <h1>Loading data</h1>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default VnpCreateKH

// https://getbootstrap.com/docs/5.0/customize/color/
// https://materialui.co/colors/indigo/100
