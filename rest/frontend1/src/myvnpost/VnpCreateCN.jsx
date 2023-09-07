import { useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup';
import MYVNPContext from "../context/MYVNPContext";

function VnpCreateCN() {

  const navigate = useHistory();

  const {
    loading,
    alert,
    alertType,
    alertText,
    post_data,
  } = useContext(MYVNPContext);


  const [ma_kh_dms, set_ma_kh_dms] = useState("");
  const [receiverName, set_receiverName] = useState("");
  const [receiverAddress, set_receiverAddress] = useState("");
  const [receiverProvinceCode, set_receiverProvinceCode] = useState("");
  const [receiverDistrictCode, set_receiverDistrictCode] = useState("");
  const [receiverCommuneCode, set_receiverCommuneCode] = useState("");
  const [receiverPhone, set_receiverPhone] = useState("");
  const [receiverEmail, set_receiverEmail] = useState("");

  const handle_submit = (e) => {
    e.preventDefault()
    const data = {
      "makhdms": ma_kh_dms.trimEnd().trimStart(),
      "receiverName": receiverName.trimEnd().trimStart(),
      "receiverAddress": receiverAddress.trimEnd().trimStart(),
      "receiverProvinceCode": receiverProvinceCode.trimEnd().trimStart(),
      "receiverDistrictCode": receiverDistrictCode.trimEnd().trimStart(),
      "receiverCommuneCode": receiverCommuneCode.trimEnd().trimStart(),
      "receiverPhone": receiverPhone.trimEnd().trimStart(),
      "receiverEmail": receiverEmail.trimEnd().trimStart()
    }
    console.log("data", data)

    post_data(data)

    set_ma_kh_dms("");
    set_receiverName("");
    set_receiverAddress("");
    set_receiverProvinceCode("");
    set_receiverDistrictCode("");
    set_receiverCommuneCode("");
    set_receiverPhone("");
    set_receiverEmail("");
  }; 

  return (
    <Container className="bg-teal-100 h-100" fluid>
      <Row className="justify-content-center">
        <Col md={6} >
              <div>
                <Form onSubmit={handle_submit}>
                  <InputGroup>
                    <Button variant="warning" className="font-weight-bold" size="sm" onClick={ () => navigate.push("/myvnpost") }>QUAY LẠI</Button>
                    <h1 className="mt-2 ml-2">THÊM MỚI CHI NHÁNH</h1>
                  </InputGroup>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ KH" onChange={ (e) => set_ma_kh_dms(e.target.value) } value = {ma_kh_dms}/>
                  <Form.Control required type="text" className="mt-2" placeholder="TÊN KH" onChange={ (e) => set_receiverName(e.target.value) } value = {receiverName}/>
                  <Form.Control required type="text" className="mt-2" placeholder="ĐỊA CHỈ" onChange={ (e) => set_receiverAddress(e.target.value) } value = {receiverAddress}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ TỈNH" onChange={ (e) => set_receiverProvinceCode(e.target.value) } value = {receiverProvinceCode}/>  
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ QUẬN" onChange={ (e) => set_receiverDistrictCode(e.target.value) } value = {receiverDistrictCode}/>  
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ PHƯỜNG XÃ" onChange={ (e) => set_receiverCommuneCode(e.target.value) } value = {receiverCommuneCode}/>  
                  <Form.Control required type="text" className="mt-2" placeholder="SỐ ĐIỆN THOẠI" onChange={ (e) => set_receiverPhone(e.target.value) } value = {receiverPhone}/>  
                  <Form.Control required type="text" className="mt-2" placeholder="EMAIL" onChange={ (e) => set_receiverEmail(e.target.value) } value = {receiverEmail}/>
                  <Button className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Form>

                {loading && 
                  <div>
                    <h1>Khởi Tạo Chi Nhánh</h1>
                    <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                    <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                }

                {alert &&
                  <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                    </button>
                    <span><strong>Cảnh Báo  </strong>{alertText}</span>
                  </div>
                }

              </div>
        </Col>
      </Row>
    </Container>
  )
}

export default VnpCreateCN

// https://getbootstrap.com/docs/5.0/customize/color/
// https://materialui.co/colors/indigo/100
