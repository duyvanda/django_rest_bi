/* eslint-disable */
import { useContext, useState } from "react";
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
    post_data_cn,
  } = useContext(MYVNPContext);


  const [stt, set_stt]= useState("");
  const [customerCode, set_customerCode]= useState("");
  const [mataikhoan, set_mataikhoan]= useState("");
  const [chinhanh, set_chinhanh]= useState("");
  const [phaply, set_phaply]= useState("");
  const [user, set_user]= useState("");
  const [pass, set_pass]= useState("");
  const [senderName, set_senderName]= useState("");
  const [senderMail, set_senderMail]= useState("");
  const [senderPhone, set_senderPhone]= useState("");
  const [senderAddress, set_senderAddress]= useState("");
  const [senderProvinceCode, set_senderProvinceCode]= useState("");
  const [senderDistrictCode, set_senderDistrictCode]= useState("");
  const [senderCommuneCode, set_senderCommuneCode]= useState("");
  const [Status, set_Status]= useState("");
  const [note, set_note]= useState("");
  const [token, set_token]= useState("");
  const [type, set_type]= useState("");
  const [contractCode, set_contractCode]= useState("");
  const [serviceCode, set_serviceCode]= useState("");
  const [contentNote, set_contentNote]= useState("Phát đồng kiểm và thu hồi biên bản");
  const [sendType, set_sendType]= useState("1");
  const [isBroken, set_isBroken]= useState("0");
  const [deliveryTime, set_deliveryTime]= useState("N");
  const [deliveryRequire, set_deliveryRequire]= useState("2");
  const [deliveryInstruction, set_deliveryInstruction]= useState("Phát đồng kiểm và thu hồi biên bản");  

  const handle_submit = (e) => {
    e.preventDefault()
    const data = {
      "stt":stt.trimEnd().trimStart(),
      "customerCode":customerCode.trimEnd().trimStart(),
      "mataikhoan":mataikhoan.trimEnd().trimStart(),
      "chinhanh":chinhanh.trimEnd().trimStart(),
      "phaply":phaply.trimEnd().trimStart(),
      "user":user.trimEnd().trimStart(),
      "pass":pass.trimEnd().trimStart(),
      "senderName":senderName.trimEnd().trimStart(),
      "senderMail":senderMail.trimEnd().trimStart(),
      "senderPhone":senderPhone.trimEnd().trimStart(),
      "senderAddress":senderAddress.trimEnd().trimStart(),
      "senderProvinceCode":senderProvinceCode.trimEnd().trimStart(),
      "senderDistrictCode":senderDistrictCode.trimEnd().trimStart(),
      "senderCommuneCode":senderCommuneCode.trimEnd().trimStart(),
      "Status":Status.trimEnd().trimStart(),
      "note":note.trimEnd().trimStart(),
      "token":token.trimEnd().trimStart(),
      "type":type.trimEnd().trimStart(),
      "contractCode":contractCode.trimEnd().trimStart(),
      "serviceCode":serviceCode.trimEnd().trimStart(),
      "contentNote":contentNote.trimEnd().trimStart(),
      "sendType":sendType.trimEnd().trimStart(),
      "isBroken":isBroken.trimEnd().trimStart(),
      "deliveryTime":deliveryTime.trimEnd().trimStart(),
      "deliveryRequire":deliveryRequire.trimEnd().trimStart(),
      "deliveryInstruction":deliveryInstruction.trimEnd().trimStart(),
    }
    console.log("data", data);

    post_data_cn(data);

    set_stt("");
    set_customerCode("");
    set_mataikhoan("");
    set_chinhanh("");
    set_phaply("");
    set_user("");
    set_pass("");
    set_senderName("");
    set_senderMail("");
    set_senderPhone("");
    set_senderAddress("");
    set_senderProvinceCode("");
    set_senderDistrictCode("");
    set_senderCommuneCode("");
    set_Status("");
    set_note("");
    set_token("");
    set_type("");
    set_contractCode("");
    set_serviceCode("");
    set_contentNote("Phát đồng kiểm và thu hồi biên bản");
    set_sendType("1");
    set_isBroken("0");
    set_deliveryTime("N");
    set_deliveryRequire("2");
    set_deliveryInstruction("Phát đồng kiểm và thu hồi biên bản");
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
                  <Form.Control required type="text" className="mt-2" placeholder="STT" onChange={ (e) => set_stt(e.target.value) } value = {stt}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ ĐƠN VỊ" onChange={ (e) => set_customerCode(e.target.value) } value = {customerCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ TÀI KHOẢN" onChange={ (e) => set_mataikhoan(e.target.value) } value = {mataikhoan}/>
                  <Form.Control required type="text" className="mt-2" placeholder="CHI NHÁNH" onChange={ (e) => set_chinhanh(e.target.value) } value = {chinhanh}/>
                  <Form.Control required type="text" className="mt-2" placeholder="PHÁP LÝ" onChange={ (e) => set_phaply(e.target.value) } value = {phaply}/>
                  <Form.Control required type="text" className="mt-2" placeholder="USER" onChange={ (e) => set_user(e.target.value) } value = {user}/>
                  <Form.Control required type="text" className="mt-2" placeholder="PASS" onChange={ (e) => set_pass(e.target.value) } value = {pass}/>
                  <Form.Control required type="text" className="mt-2" placeholder="TÊN" onChange={ (e) => set_senderName(e.target.value) } value = {senderName}/>
                  <Form.Control required type="text" className="mt-2" placeholder="EMAIL" onChange={ (e) => set_senderMail(e.target.value) } value = {senderMail}/>
                  <Form.Control required type="text" className="mt-2" placeholder="SĐT" onChange={ (e) => set_senderPhone(e.target.value) } value = {senderPhone}/>
                  <Form.Control required type="text" className="mt-2" placeholder="ĐỊA CHỈ" onChange={ (e) => set_senderAddress(e.target.value) } value = {senderAddress}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ TỈNH" onChange={ (e) => set_senderProvinceCode(e.target.value) } value = {senderProvinceCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ QUẬN" onChange={ (e) => set_senderDistrictCode(e.target.value) } value = {senderDistrictCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ PX" onChange={ (e) => set_senderCommuneCode(e.target.value) } value = {senderCommuneCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="TRẠNG THÁI" onChange={ (e) => set_Status(e.target.value) } value = {Status}/>
                  <Form.Control required type="text" className="mt-2" placeholder="NOTE" onChange={ (e) => set_note(e.target.value) } value = {note}/>
                  <Form.Control required type="text" className="mt-2" placeholder="TOKEN" onChange={ (e) => set_token(e.target.value) } value = {token}/>
                  <Form.Control required type="text" className="mt-2" placeholder="TYPE" onChange={ (e) => set_type(e.target.value) } value = {type}/>
                  <Form.Control type="text" className="mt-2" placeholder="MÃ HỢP ĐỒNG" onChange={ (e) => set_contractCode(e.target.value) } value = {contractCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="MÃ DỊCH VỤ" onChange={ (e) => set_serviceCode(e.target.value) } value = {serviceCode}/>
                  <Form.Control required type="text" className="mt-2" placeholder="NỘI DỤNG HÀNG" onChange={ (e) => set_contentNote(e.target.value) } value = {contentNote}/>
                  <Form.Control required type="text" className="mt-2" placeholder="LOẠI GỬI (1|2)" onChange={ (e) => set_sendType(e.target.value) } value = {sendType}/>
                  <Form.Control required type="text" className="mt-2" placeholder="PHẢI HÀNG DỄ VỠ (1|0)" onChange={ (e) => set_isBroken(e.target.value) } value = {isBroken}/>
                  <Form.Control required type="text" className="mt-2" placeholder="SÁNG | CHIỀU | CẢ NGÀY (S|C|N)" onChange={ (e) => set_deliveryTime(e.target.value) } value = {deliveryTime}/>
                  <Form.Control required type="text" className="mt-2" placeholder="CHO XEM HÀNG (1|2)" onChange={ (e) => set_deliveryRequire(e.target.value) } value = {deliveryRequire}/>
                  <Form.Control required type="text" className="mt-2" placeholder="CHỈ DẪN PHÁT" onChange={ (e) => set_deliveryInstruction(e.target.value) } value = {deliveryInstruction}/>
                  <Button className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Form>

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
