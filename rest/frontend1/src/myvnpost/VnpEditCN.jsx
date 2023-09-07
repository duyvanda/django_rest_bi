import { useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import MYVNPContext from "../context/MYVNPContext";

function VnpEditKH() {

  const navigate = useHistory();

  const {
    loading,
    fetchKHVNP,
    khvnp,
    alert,
    alertType,
    alertText,
    post_data_update,
  } = useContext(MYVNPContext);

  const [ma_kh_search, set_ma_kh_search] = useState("");
  const [ma_kh_dms, set_ma_kh_dms] = useState("");
  const [receiverName, set_receiverName] = useState("");
  const [receiverAddress, set_receiverAddress] = useState("");
  const [receiverProvinceCode, set_receiverProvinceCode] = useState("");
  const [receiverDistrictCode, set_receiverDistrictCode] = useState("");
  const [receiverCommuneCode, set_receiverCommuneCode] = useState("");
  const [receiverPhone, set_receiverPhone] = useState("");
  const [receiverEmail, set_receiverEmail] = useState("");
  const [edit, set_edit] = useState(true);
  const [disalbe, set_disalbe] = useState(true);

  const handle_changed = (e) => {
    const data = e.target.value;
    console.log(data)
    set_ma_kh_search(data);

  };
  
  const handle_click = () => {
    fetchKHVNP(ma_kh_search)
    set_edit(false)
  };

  const handle_edit_ma = () => {
    set_ma_kh_dms(khvnp.makhdms);
    set_receiverName(khvnp.receiverName);
    set_receiverAddress(khvnp.receiverAddress);
    set_receiverProvinceCode(khvnp.receiverProvinceCode);
    set_receiverDistrictCode(khvnp.receiverDistrictCode);
    set_receiverCommuneCode(khvnp.receiverCommuneCode);
    set_receiverPhone(khvnp.receiverPhone);
    set_receiverEmail(khvnp.receiverEmail);
    set_edit(true);
    set_disalbe(false);
  };

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

    post_data_update(data)

    set_ma_kh_search("");
    set_ma_kh_dms("");
    set_receiverName("");
    set_receiverAddress("");
    set_receiverProvinceCode("");
    set_receiverDistrictCode("");
    set_receiverCommuneCode("");
    set_receiverPhone("");
    set_receiverEmail("");
    set_edit(true);
    set_disalbe(true);
  }; 

  return (
    <Container className="bg-teal-100 h-100" fluid>
      <Row className="justify-content-center">
        <Col md={6} >
          <InputGroup>
            <Button variant="warning" className="font-weight-bold" size="sm" onClick={ () => navigate.push("/myvnpost") }>QUAY LẠI</Button>
              <h1 className="mt-2 ml-2">CHỈNH SỬA MÃ KH</h1>
            </InputGroup>
          <InputGroup className='mt-2'>
            <Form.Control placeholder="NHẬP VÀO MÃ" onChange={handle_changed} value = {ma_kh_search}/>
            <Button style={{fontWeight: "bold"}} variant="warning" onClick={handle_click} >Tìm Mã</Button>
          </InputGroup>
          {loading === false ?
          (
            edit === false ?
              <div>
                <Form>
                  <Form.Control className="mt-2" readOnly value = {khvnp.makhdms}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverName}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverAddress}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverProvinceCode}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverDistrictCode}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverCommuneCode}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverPhone}/>
                  <Form.Control className="mt-2" readOnly value = {khvnp.receiverEmail}/>
                </Form>
              </div>
            // edit === true
            :
              <div>
                <Form onSubmit={handle_submit}>
                <InputGroup className="mt-2">
                  <InputGroup.Text id="basic-addon1">ABC</InputGroup.Text>
                  <Form.Control aria-describedby="basic-addon1" readOnly value = {ma_kh_dms}/>
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text id="basic-addon1">ABC</InputGroup.Text>
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverName(e.target.value) } value = {receiverName} />
                </InputGroup>
                
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverAddress(e.target.value) } value = {receiverAddress} />
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverProvinceCode(e.target.value) } value = {receiverProvinceCode} />  
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverDistrictCode(e.target.value) } value = {receiverDistrictCode} />  
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverCommuneCode(e.target.value) } value = {receiverCommuneCode} />  
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverPhone(e.target.value) } value = {receiverPhone} />  
                  <Form.Control required type="text" className="mt-2" onChange={ (e) => set_receiverEmail(e.target.value) } value = {receiverEmail} />
                  <Button className='mt-2' disabled={disalbe} variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Form>
              </div>              
          )
          :
          <h1>Loading data</h1>
          }

          { (edit === false && loading === false ) &&
          <Button className='mt-2' style={{fontWeight: "bold"}} variant="warning" onClick={handle_edit_ma}>EDIT MÃ</Button>
          }

          {alert &&
          <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
            <span><strong>Cảnh Báo </strong>{alertText}</span>
          </div>
          }
        </Col>
      </Row>
    </Container>
  )
}

export default VnpEditKH