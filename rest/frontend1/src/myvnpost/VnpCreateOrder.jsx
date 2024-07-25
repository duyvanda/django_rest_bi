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


function VnpCreateOrder({history}) {

  const fetch_customerCode = async () => {
    SetLoading(true)
    const response = await fetch(`https://bi.meraplion.com/myvnp/get_all_cn/`)
    const data = await response.json()
    const data_arr = data.data
    set_list_customerCode(data_arr);
    SetLoading(false);
    set_disable(false)
  }

  useEffect(() => {
		if (localStorage.getItem("userInfo")) {
      fetch_customerCode();

		} else {
            history.push('/login');
        };
  // eslint-disable-next-line
	}, []);

  const navigate = useHistory();

  const {
    SetLoading,
    loading,
    alert,
    alertType,
    alertText,
    handleSaveForm
  } = useContext(MYVNPContext);


  const [list_customerCode, set_list_customerCode] = useState([]);
  const [select_customerCode, set_select_customerCode] = useState("");
  const [disable, set_disable] = useState(true);
  const [makhdms, set_makhdms] = useState("");
  const [cn_bbnh, set_cn_bbnh] = useState("");
  const [kien, set_kien] = useState(1);
  const [checkbox, set_checkbox] = useState(true);

  const handleBBNH = (e) => {
    const data = e.target.value
      .split(" ")
      .join("")
      .split("-")
      .join("")
      .toUpperCase();
      set_cn_bbnh(data);
  };

  const handle_submit = (e) => {
    e.preventDefault();
    const data = {
      "customerCode":select_customerCode.trimEnd().trimStart(),
      "makhdms":makhdms.trimEnd().trimStart(),
      "cn_bbnh":cn_bbnh.trimEnd().trimStart(),
      "kien":kien.toString(),
      "checkbox":checkbox
    }
    console.log(data);
    handleSaveForm(data);
  };

  return (
    <Container className="bg-teal-100 h-100" fluid>
      <Row className="justify-content-center">
        <Col md={6} >
              <div>
                <Form onSubmit={handle_submit}>
                  <InputGroup>
                    <Button variant="warning" className="font-weight-bold" size="sm" onClick={ () => navigate.push("/myvnpost") }>QUAY LẠI</Button>
                    <h1 className="mt-2 ml-2">TẠO ĐƠN HÀNG</h1>
                  </InputGroup>
                  {/* FORM */}

                  <Form.Select disabled={disable} className="mt-2" required style={{fontStyle: "bold"}} onChange={ (e) => set_select_customerCode(e.target.value) } value={select_customerCode} size='sm'>
                      <option>Vui Lòng Chọn Chi Nhánh</option>
                        {list_customerCode
                        .map(el =><option key={el.customerCode} value={el.customerCode}> {el.customerCode + " " + el.chinhanh+ " " + el.phaply} </option>
                        )}
                  </Form.Select>

                  <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w100px bg-secondary text-white">MÃ KH DMS</InputGroup.Text> <Form.Control required type="text" onChange={ (e) => set_makhdms(e.target.value) } value = {makhdms}/></InputGroup>
                  <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w100px bg-secondary text-white">CN + BBNH</InputGroup.Text> <Form.Control required type="text" onChange={ handleBBNH } value = {cn_bbnh}/></InputGroup>
                  <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w100px bg-secondary text-white">SỐ KIỆN</InputGroup.Text> <Form.Control required type="number" onChange={ (e) => set_kien(e.target.value) } value = {kien}/></InputGroup>
                  
                    
                    <Form.Check className="mt-2 font-weight-bold" label="CÓ TẠO NHIỀU ĐƠN NẾU NHIỀU KIỆN" size="lg" required type="switch" checked={checkbox}  onChange={ (e) => set_checkbox(e.target.checked) } /> 

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

export default VnpCreateOrder

// https://getbootstrap.com/docs/5.0/customize/color/
// https://materialui.co/colors/indigo/100
