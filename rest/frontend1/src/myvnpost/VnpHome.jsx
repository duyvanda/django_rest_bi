import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Link } from 'react-router-dom'

function VnpHome() {

  return (
    <Container className="bg-teal-100" style={{height:"100vh"}} fluid>
      <Row className="justify-content-center">
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          {/* <Link to={'/reportscreen/1'} target="_blank" className="btn btn-dark">Danh Sách Khách Hàng</Link> */}
          <Link to={'/myvnpost/createkh'} className="btn btn-dark">Tạo Khách Hàng</Link>
          <Link to={'/myvnpost/editkh'} className="btn btn-dark">Chỉnh Sửa Khách Hàng</Link>
          </ButtonGroup>
        </Col>
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          {/* <Link to={'/reportscreen/1'} target="_blank" className="btn btn-dark">Danh Sách Chi Nhánh</Link> */}
          <Link to={'/myvnpost/createcn'} className="btn btn-dark">Tạo Chi Nhánh</Link>
          <Link to={'/myvnpost/editcn'} className="btn btn-dark">Chỉnh Sửa Chi Nhánh</Link>
          </ButtonGroup>
        </Col>
        <Col xs={2} className="mt-3 ">
          <ButtonGroup vertical >
          <Link to={{pathname: "https://lookerstudio.google.com/u/0/reporting/1725e864-00f6-4872-855b-4641a1c3ccbd/page/O46cD"}} target="_blank" className="btn btn-dark">Danh Sách Đơn Hàng Đã Tạo</Link>
          <Link to={'/myvnpost/createorder'} className="btn btn-dark">Tạo Đơn Hàng</Link>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default VnpHome

