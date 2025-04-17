// MainPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Import Link for routing
import './MainPage.css';  // Import any custom styles

const MainPage = () => {
  const [contentList, setContentList] = useState([
    { "name": "Thông tin sản phẩm", "url": "https://drive.google.com/file/d/1zDx1xMOzmJlT1nvU5GhVEGyvMAdh4T7W/preview", "type": "pdf" },
    { "name": "Video giới thiệu MerapLion", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video" },
    { "name": "Thông tin bệnh học", "url": "https://drive.google.com/file/d/1zDx1xMOzmJlT1nvU5GhVEGyvMAdh4T7Y/preview", "type": "pdf" }
  ]);

  return (
    <Container>
      {/* Header Section with Top Badge Image */}
      <Row className="header-section">
        <Col>
          <h5 className="greeting">Xin chào Văn Quang Duy</h5>
        </Col>
        <Col className="text-right">
          <Link to="/lich-su-diem" className="history-link">Lịch sử điểm</Link>
        </Col>
      </Row>

      {/* Top Badge Image */}
      <Row>
        <Col>
          <img src="/assets/top-image.png" alt="Top Badge" className="top-banner-img" />
          <div className="badge-text">
            <h6 className="badge-name">TÂN BÌNH</h6>
            <span className="badge-star">★</span>
          </div>
        </Col>
      </Row>

      {/* Points Section */}
      <Row className="points-section">
        <Col className="text-center">
          <h1 className="points">0 Điểm</h1>
          <p className="points-description">Điểm tổng hợp từ việc xem tài liệu, video và mức độ tích cực của bạn mỗi ngày</p>
        </Col>
      </Row>

      {/* List Section */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ul className="points-list">
                {contentList.map((content) => (
                  <li key={content.name}>
                    {content.type === 'pdf' ? (
                      <Link to={`/view-pdf?pdf=${encodeURIComponent(content.url)}`}>
                        {content.name}
                      </Link>
                    ) : content.type === 'video' ? (
                      <Link to={`/view-video?video=${encodeURIComponent(content.url)}`}>
                        {content.name}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};


export default MainPage;
