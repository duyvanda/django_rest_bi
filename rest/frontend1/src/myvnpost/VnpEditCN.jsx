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


function VnpEditCN() {

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
    post_data_cn_update,
  } = useContext(MYVNPContext);

  const [ma_search, set_ma_search] = useState("");
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
  const [disalbe, set_disalbe] = useState(true);

  const handle_nhap_ma = (e) => {
    const data = e.target.value;
    console.log(data)
    set_ma_search(data);
  };
  
  const handle_tim_ma = async () => {
    SetLoading(true)
    const api_string = `${URL}/get_cn/?madonvi=${ma_search}`
    // console.log(api_string)
    const response = await fetch(api_string);
    const data = await response.json();
    const data_arr = data.data
    // console.log(data)
    if (response.ok && data_arr.length > 0 ) {
    console.log(data_arr[0]);
    set_stt(data_arr[0].stt);
    set_customerCode(data_arr[0].customerCode);
    set_mataikhoan(data_arr[0].mataikhoan);
    set_chinhanh(data_arr[0].chinhanh);
    set_phaply(data_arr[0].phaply);
    set_user(data_arr[0].user);
    set_pass(data_arr[0].pass);
    set_senderName(data_arr[0].senderName);
    set_senderMail(data_arr[0].senderMail);
    set_senderPhone(data_arr[0].senderPhone);
    set_senderAddress(data_arr[0].senderAddress);
    set_senderProvinceCode(data_arr[0].senderProvinceCode);
    set_senderDistrictCode(data_arr[0].senderDistrictCode);
    set_senderCommuneCode(data_arr[0].senderCommuneCode);
    set_Status(data_arr[0].Status);
    set_note(data_arr[0].note);
    set_token(data_arr[0].token);
    set_type(data_arr[0].type);
    set_contractCode(data_arr[0].contractCode);
    set_serviceCode(data_arr[0].serviceCode);
    set_contentNote(data_arr[0].contentNote);
    set_sendType(data_arr[0].sendType);
    set_isBroken(data_arr[0].isBroken);
    set_deliveryTime(data_arr[0].deliveryTime);
    set_deliveryRequire(data_arr[0].deliveryRequire);
    set_deliveryInstruction(data_arr[0].deliveryInstruction);
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
    console.log("data", data)

    post_data_cn_update(data);
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
    set_disalbe(true);
  }; 

  return (
    <Container className="bg-teal-100 h-100" fluid>
      <Row className="justify-content-center">
        <Col md={6} >
          <InputGroup>
            <Button variant="warning" className="font-weight-bold" size="sm" onClick={ () => navigate.push("/myvnpost") }>QUAY LẠI</Button>
              <h1 className="mt-2 ml-2">CHỈNH SỬA MÃ CN</h1>
            </InputGroup>
          <InputGroup className='mt-2'>
            <Form.Control placeholder="NHẬP VÀO MÃ" onChange={handle_nhap_ma} value = {ma_search}/>
            <Button style={{fontWeight: "bold"}} variant="warning" onClick={handle_tim_ma} >Tìm Mã</Button>
          </InputGroup>

          {loading &&
            <div>
              <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
              <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
              </Spinner>
            </div>
          }

            <div>
                <Form onSubmit={handle_submit}>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">STT</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_stt(e.target.value) } value = {stt}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ ĐƠN VỊ</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_customerCode(e.target.value) } value = {customerCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ TÀI KHOẢN</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_mataikhoan(e.target.value) } value = {mataikhoan}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">CHI NHÁNH</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_chinhanh(e.target.value) } value = {chinhanh}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">PHÁP LÝ</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_phaply(e.target.value) } value = {phaply}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">USER</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_user(e.target.value) } value = {user}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">PASS</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_pass(e.target.value) } value = {pass}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">TÊN</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderName(e.target.value) } value = {senderName}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">EMAIL</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderMail(e.target.value) } value = {senderMail}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">SĐT</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderPhone(e.target.value) } value = {senderPhone}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">ĐỊA CHỈ</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderAddress(e.target.value) } value = {senderAddress}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ TỈNH</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderProvinceCode(e.target.value) } value = {senderProvinceCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ QUẬN</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderDistrictCode(e.target.value) } value = {senderDistrictCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ PX</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_senderCommuneCode(e.target.value) } value = {senderCommuneCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">TRẠNG THÁI</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_Status(e.target.value) } value = {Status}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">NOTE</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_note(e.target.value) } value = {note}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">TOKEN</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_token(e.target.value) } value = {token}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">TYPE</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_type(e.target.value) } value = {type}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ HỢP ĐỒNG</InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_contractCode(e.target.value) } value = {contractCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">MÃ DỊCH VỤ</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_serviceCode(e.target.value) } value = {serviceCode}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">NỘI DỤNG HÀNG</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_contentNote(e.target.value) } value = {contentNote}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">LOẠI GỬI (1|2)</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_sendType(e.target.value) } value = {sendType}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">PHẢI HÀNG DỄ VỠ (1|0)</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_isBroken(e.target.value) } value = {isBroken}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">SÁNG | CHIỀU | CẢ NGÀY (S|C|N)</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_deliveryTime(e.target.value) } value = {deliveryTime}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">CHO XEM HÀNG (1|2)</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_deliveryRequire(e.target.value) } value = {deliveryRequire}/></InputGroup>
                  <InputGroup className="mt-2"> <InputGroup.Text className="w250px bg-secondary text-white">CHỈ DẪN PHÁT</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_deliveryInstruction(e.target.value) } value = {deliveryInstruction}/></InputGroup>
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

export default VnpEditCN

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