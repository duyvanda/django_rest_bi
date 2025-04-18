import React from 'react';
// import { Container, Row, Col, Button } from 'react-bootstrap';
import './IntroductionPage.css';
import topBanner from '../images/georgie-cobbs-bKjHgo_Lbpo-unsplash.jpg';
import iconInfo from '../images/digital-campaign.png';
import iconLightning from '../images/digital-campaign.png';

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

const Nvbc_introduction = () => {
  return (
  <Row className="justify-content-center">
  <Col md={4}>
    <div className="intro-wrapper">
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'center', maxHeight: '300px', overflow: 'hidden' }}>
        <img
          src="https://storage.googleapis.com/django_media_biteam/nvbc/Gio%CC%9B%CC%81i%20thie%CC%A3%CC%82u-2x.png"
          alt="Top Banner"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Greeting Text Section */}
      <div className="greeting-box text-center">
        <h5>Xin chào, Phạm Thị Hương!</h5>
        <p>
          Tham gia và Hoạt động thường xuyên để tăng điểm và nhận được những phần quà giá trị mỗi quý từ MerapLion.
        </p>
      </div>

      {/* Vertical Line and Info Section */}
      <div className="info-section">
        <div className="vertical-line" />

        <div className="info-box">
          <div className="icon-text">
            <img src={iconInfo} alt="Info Icon" />
            <p>
              Thực hiện các hoạt động xem thông tin sản phẩm, thông tin về MerapLion, thông tin bệnh học, sổ tay người thầy thuốc, tư vấn cùng chuyên gia...
            </p>
          </div>
          <div className="icon-text">
            <img src={iconLightning} alt="Lightning Icon" />
            <p>
              Hoàn thành các hoạt động trên sẽ tăng điểm ngay lập tức
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <Container className="text-center mt-3">
        <Button className="start-button">BẮT ĐẦU</Button>
      </Container>
    </div>
  </Col>
</Row>
  );
};

export default Nvbc_introduction;