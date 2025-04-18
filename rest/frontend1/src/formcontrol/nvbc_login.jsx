import React from 'react';
// import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import {
  Button,
  Col,
  Row,
  Container,
  Dropdown,
  Form,
  Spinner,
  InputGroup,
  Stack,
  FloatingLabel,
  Table,
  Card,
  Modal
} from "react-bootstrap";

const Nvbc_login = () => {
  return (
    <Row className="justify-content-center">
    <Col md={4} >
    <div className="login-wrapper">
      {/* Top Image with Text */}
      <div className="top-image-section">
        <img 
        src="https://storage.googleapis.com/django_media_biteam/nvbc/%C4%90a%CC%86ng%20nha%CC%A3%CC%82p-2x.png" 
        // width="350px" 
        // height="500px" 
        style={{  width: '80%', height: 'auto' }} 
        alt="Top Banner" 
        className="" 
        />
      </div>

      {/* Login Form */}
      <Container className="form-container text-center">
        {/* <img
          src="https://www.kindpng.com/picc/m/361-3615292_internet-icon-hd-png-download.png"
          alt="Logo"
          className="logo"
        /> */}
        <Form>
          <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="text"
              placeholder="*Vui lòng nhập SDT cho lần đăng nhập đầu tiên"
            />
          </Form.Group>
          <Link to="/introduction">
          <Button variant="info" className="login-button w-100 mb-3" type="button">
          ĐĂNG NHẬP
          </Button>
          </Link>
        </Form>
        <a href="/lien-he-cskh" className="text-info">Liên hệ CSKH</a>
      </Container>
    </div>
    </Col>
      </Row>
  );
};

export default Nvbc_login;
