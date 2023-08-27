import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import MYVNPContext from "../context/MYVNPContext";

function VnpCreateKH({history}) {

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

  const handle_changed = (e) => {
    const data = e.target.value;
    console.log(data)
    set_ma_kh_search(data);

  };
  
  const handle_click = () => {
    fetchKHVNP(ma_kh_search)
    set_edit(false)
  };

  const handle_edit = () => {
    set_id(khvnp.id)
    set_ma_kh_dms(khvnp.makhdms)
    set_receiverName(khvnp.receiverName)
    set_receiverAddress(khvnp.receiverAddress)
    set_receiverProvinceCode(khvnp.receiverProvinceCode)
    set_receiverDistrictCode(khvnp.receiverDistrictCode)
    set_receiverCommuneCode(khvnp.receiverCommuneCode)
    set_receiverPhone(khvnp.receiverPhone)
    set_receiverEmail(khvnp.receiverEmail)
    set_edit(!edit)
  };

  const handle_changed_id = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_id(data);
  };

  const handle_changed_ma_kh_dms = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_ma_kh_dms(data);
  }; 

  const handle_changed_receiverName = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverName(data);
  }; 

  const handle_changed_receiverAddress = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverAddress(data);
  }; 

  const handle_changed_receiverProvinceCode = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverProvinceCode(data);
  }; 

  const handle_changed_receiverDistrictCode = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverDistrictCode(data);
  }; 

  const handle_changed_receiverCommuneCode = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverCommuneCode(data);
  }; 

  const handle_changed_receiverPhone = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverPhone(data);
  }; 

  const handle_changed_receiverEmail = (e) => {
    const data = e.target.value;
    console.log(data) // should be empty
    set_receiverEmail(data);
  }; 

  const handle_submit = (e) => {
    e.preventDefault()
    console.log("first")
  }; 

  return (
    <Container >
      <Row className="justify-content-center">
        <Col md={6} >
          {loading === false ?
              <div>
                <Form onSubmit={handle_submit}>
                  <h1 className="mt-2 text-center">THÊM MỚI KHÁCH HÀNG</h1>
                  <Form.Control className="mt-2" placeholder="ID" onChange={handle_changed_id} value = {id} />
                  <Form.Control className="mt-2" placeholder="MÃ KH" onChange={handle_changed_ma_kh_dms} value = {ma_kh_dms}/>
                  <Form.Control className="mt-2" placeholder="TÊN KH" onChange={handle_changed_receiverName} value = {receiverName}/>
                  <Form.Control className="mt-2" placeholder="ĐỊA CHỈ" onChange={handle_changed_receiverAddress} value = {receiverAddress}/>
                  <Form.Control className="mt-2" placeholder="MÃ TỈNH" onChange={handle_changed_receiverProvinceCode} value = {receiverProvinceCode}/>  
                  <Form.Control className="mt-2" placeholder="MÃ QUẬN" onChange={handle_changed_receiverDistrictCode} value = {receiverDistrictCode}/>  
                  <Form.Control className="mt-2" placeholder="MÃ PHƯỜNG XÃ" onChange={handle_changed_receiverCommuneCode} value = {receiverCommuneCode}/>  
                  <Form.Control className="mt-2" placeholder="SỐ ĐIỆN THOẠI" onChange={handle_changed_receiverPhone} value = {receiverPhone}/>  
                  <Form.Control className="mt-2" placeholder="EMAIL" onChange={handle_changed_receiverEmail} value = {receiverEmail}/>
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