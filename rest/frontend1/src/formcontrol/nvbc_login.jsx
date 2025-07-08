/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // React Router v5
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

const Nvbc_login = ({history, location}) => {

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  // const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("nvbc_user");
    if (user) {
      history.push("/formcontrol/nvbc_introduction");
    }
  }, [history]);

  const handleLogin = async () => {
    if (!phone.trim()) {
      window.alert("Vui lòng nhập số điện thoại!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("https://bi.meraplion.com/local/nvbc_login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });
  
      if (!response.ok) {
        window.alert("Vui lòng kiểm tra số điện thoại, hệ thống chỉ dành cho KH đã kết nối ZaloOA của MerapLion. Vui lòng liên hệ CSKH hoặc hotline Meraplion 0888 333 489 để được hướng dẫn chi tiết!");
        return;  // Exit early if the response is not OK
      }
  
      const userData = await response.json();
  
      // Only store user data if the response is successful
      localStorage.setItem("nvbc_user", JSON.stringify(userData));
  
      history.push("/formcontrol/nvbc_introduction");
    } catch (error) {
      console.error("Login failed:", error);
      window.alert("Vui lòng kiểm tra số điện thoại, hệ thống chỉ dành cho nhân viên bán chính. Liên hệ CSKH để được hướng dẫn thêm!");
    } finally {
      setLoading(false);
    }
  };

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
        style={{  width: '100%', height: 'auto' }} 
        alt="Top Banner" 
        className="" 
        />
      </div>

      {/* Login Form */}
      <Container className="form-container text-center">
        <Form>
        <Form.Group className="mb-3" controlId="formPhoneNumber">
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="text"
              placeholder="*Vui lòng nhập SDT cho lần đăng nhập đầu tiên"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <Link to="/formcontrol/nvbc_introduction">
          <Button
                variant="info"
                className="login-button w-100 mb-3"
                type="button"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </Button>
          </Link>
        </Form>
        <a href="https://oa.zalo.me/3074930777790996566" target="_blank" rel="noopener noreferrer" className="text-info">Liên hệ CSKH</a>
      </Container>
    </div>
    </Col>
    </Row>
  );
};

export default Nvbc_login;
