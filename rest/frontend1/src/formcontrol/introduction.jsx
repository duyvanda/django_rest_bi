import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './IntroductionPage.css';
import topBanner from '../images/georgie-cobbs-bKjHgo_Lbpo-unsplash.jpg';
import iconInfo from '../images/digital-campaign.png';
import iconLightning from '../images/digital-campaign.png';

const Introduction = () => {
  return (
    <div className="intro-wrapper">
      {/* Top Banner */}
      <img src={topBanner} alt="Top Banner" className="top-banner" />

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
  );
};

export default Introduction;