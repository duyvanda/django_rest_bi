/* eslint-disable */
import { useContext, useState, useEffect } from "react";
import './myvnp.css';
import { useHistory } from 'react-router-dom'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import InputGroup from "react-bootstrap/InputGroup";
import MYVNPContext from "../context/MYVNPContext";


function VnpEditKH() {

  useEffect(() => {

	}, []);
  const URL = "https://bi.meraplion.com/myvnp"
  const navigate = useHistory();

  const {
    SetLoading,
    loading,
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
  const [receiverRealName, set_receiverRealName] = useState("");
  const [receiverEmail, set_receiverEmail] = useState("");
  const [disalbe, set_disalbe] = useState(true);

  const handle_nhap_ma = (e) => {
    const data = e.target.value;
    console.log(data)
    set_ma_kh_search(data);
  };
  
  const handle_tim_ma = async () => {
    SetLoading(true)
    const api_string = `${URL}/get_kh/?makhdms=${ma_kh_search}`
    // console.log(api_string)
    const response = await fetch(api_string);
    const data = await response.json();
    const data_arr = data.data
    // console.log(data)
    if (response.ok && data_arr.length > 0 ) {
    console.log(data_arr[0]);
    set_ma_kh_dms(data_arr[0].makhdms);
    set_receiverName(data_arr[0].receiverName);
    set_receiverAddress(data_arr[0].receiverAddress);
    set_receiverProvinceCode(data_arr[0].receiverProvinceCode);
    set_receiverDistrictCode(data_arr[0].receiverDistrictCode);
    set_receiverCommuneCode(data_arr[0].receiverCommuneCode);
    set_receiverPhone(data_arr[0].receiverPhone);
    set_receiverRealName(data_arr[0].receiverRealName);
    set_receiverEmail(data_arr[0].receiverEmail);
    SetLoading(false)
    set_disalbe(false)
    }

    else {
      // const data = {
      //   "makhdms": "KHONG TIM THAY MA KH",
      //   "receiverName": "",
      //   "receiverAddress": "",
      //   "receiverProvinceCode": "",
      //   "receiverDistrictCode": "",
      //   "receiverCommuneCode": "",
      //   "receiverPhone": "",
      //   "receiverEmail": ""
      // };
      SetLoading(false)
    }
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
      "receiverRealName": receiverRealName.trimEnd().trimStart(),
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
    set_receiverRealName("");
    set_receiverEmail("");
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
            <Form.Control placeholder="NHẬP VÀO MÃ" onChange={handle_nhap_ma} value = {ma_kh_search}/>
            <Button style={{fontWeight: "bold"}} variant="warning" onClick={handle_tim_ma} >Tìm Mã</Button>
          </InputGroup>
            <div>
                <Form onSubmit={handle_submit}>
                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> MÃ KH </InputGroup.Text>
                  <Form.Control readOnly value = {ma_kh_dms}/>
                </InputGroup>

                <InputGroup className="mt-2 ">
                  <InputGroup.Text className="w200px bg-secondary text-white"> TÊN KH </InputGroup.Text>
                  <Form.Control  required type="text" onChange={ (e) => set_receiverName(e.target.value) } value = {receiverName} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> ĐỊA CHỈ KH </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverAddress(e.target.value) } value = {receiverAddress} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> MÃ TỈNH </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverProvinceCode(e.target.value) } value = {receiverProvinceCode} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> MÃ QUẬN </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverDistrictCode(e.target.value) } value = {receiverDistrictCode} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> MÃ PX </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverCommuneCode(e.target.value) } value = {receiverCommuneCode} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> PHONE </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverPhone(e.target.value) } value = {receiverPhone} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> TÊN NGƯỜI NHẬN </InputGroup.Text>
                  <Form.Control type="text" onChange={ (e) => set_receiverRealName(e.target.value) } value = {receiverRealName} />
                </InputGroup>

                <InputGroup className="mt-2">
                  <InputGroup.Text className="w200px bg-secondary text-white"> EMAIL </InputGroup.Text>
                  <Form.Control required type="text" onChange={ (e) => set_receiverEmail(e.target.value) } value = {receiverEmail} />
                </InputGroup>

                  <Button className='mt-2' disabled={disalbe} variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Form>
              </div>           
              {loading &&
                <div>
                  <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                  <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                  </Spinner>
                </div>
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

// { (edit === false && loading === false ) &&
//   <Button className='mt-2' style={{fontWeight: "bold"}} variant="warning" onClick={handle_edit_ma}>EDIT MÃ</Button>
//   }

// edit === false ?
// <div>
//   <Form>
//     <Form.Control className="mt-2" readOnly value = {khvnp.makhdms}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverName}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverAddress}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverProvinceCode}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverDistrictCode}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverCommuneCode}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverPhone}/>
//     <Form.Control className="mt-2" readOnly value = {khvnp.receiverEmail}/>
//   </Form>
// </div>
// edit === true
// :