import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import MYVNPContext from "../context/MYVNPContext";
import { Link } from 'react-router-dom'

function VnpHome({history}) {

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
    <Container className="bg-teal-100" style={{height:"100vh"}} fluid>
      <Row className="justify-content-center">
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          <Link to={'/reportscreen/1'} target="_blank" className="btn btn-dark">Danh Sách Khách Hàng</Link>
          <Link to={'/myvnpost/createkh'} className="btn btn-dark">Tạo Khách Hàng</Link>
          <Link to={'/myvnpost/editkh'} className="btn btn-dark">Chỉnh Sửa Khách Hàng</Link>
          </ButtonGroup>
        </Col>
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          <Link to={'/reportscreen/1'} target="_blank" className="btn btn-dark">Danh Sách Chi Nhánh</Link>
          <Link to={'/myvnpost/createkh'} className="btn btn-dark">Tạo Chi Nhánh</Link>
          <Link to={'/myvnpost/editkh'} className="btn btn-dark">Chỉnh Sửa Chi Nhánh</Link>
          </ButtonGroup>
        </Col>
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          <Link to={'/reportscreen/1'} target="_blank" className="btn btn-dark">Danh Sách Đơn Hàng Đã Tạo</Link>
          <Link to={'/myvnpost/createkh'} className="btn btn-dark">Tạo Đơn Hàng</Link>
          <Link to={'/myvnpost/editkh'} className="btn btn-dark">Xóa Đơn Hàng</Link>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default VnpHome

