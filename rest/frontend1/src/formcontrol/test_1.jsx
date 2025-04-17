import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-wrapper">
      {/* Top Image with Text */}
      <div className="top-image-section">
      <img 
      src="https://www.freeiconspng.com/uploads/banner-png-picture-9.png" 
      width="350" 
      height="120" 
      alt="Top Banner" 
      className="top-banner" 
      />
        {/* <div className="overlay-text">
          <h2>meraplion</h2>
          <p>Tận tâm vì sức khỏe<br />mỗi gia đình</p>
        </div> */}
      </div>

      {/* Login Form */}
      <Container className="form-container text-center">
        <img
          src="https://www.kindpng.com/picc/m/361-3615292_internet-icon-hd-png-download.png"
          alt="Logo"
          className="logo"
        />
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
  );
};

export default LoginPage;
