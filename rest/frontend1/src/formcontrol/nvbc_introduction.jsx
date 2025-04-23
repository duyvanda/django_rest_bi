/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom"; // React Router v5
// import { Container, Row, Col, Button } from 'react-bootstrap';
import './IntroductionPage.css';
// import topBanner from '../images/georgie-cobbs-bKjHgo_Lbpo-unsplash.jpg';
import iconInfo from '../images/digital-campaign.png';
import iconLightning from '../images/digital-campaign.png';
import ReactMarkdown from "react-markdown";
// import remarkBreaks from 'remark-breaks';

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
  const [userName, setUserName] = useState("");
  const history = useHistory();

  useEffect(() => {
    const userData = localStorage.getItem("nvbc_user");
    if (!userData) {
      history.push("/formcontrol/nvbc_login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.name || "Người dùng");
    }
  }, [history]);


  const markdownContent = `
  ### Công thức tính điểm trên 1 lượt truy cập:
  **Điểm = Hệ số chủ đề x Hệ số thời gian**
  
  - **Hệ số chủ đề:** Mỗi chủ đề có một hệ số riêng (có thể thay đổi theo thời gian).
  - **Hệ số thời gian:** Quy đổi thời gian đọc sang điểm, cụ thể:
    - Dưới 30 giây = 0.5 điểm
    - Từ 30 giây - Dưới 1 phút = 1 điểm
    - Từ 1 phút trở lên = 2 điểm
  
  **Lưu ý:** Hệ số thời gian có thể thay đổi theo từng tình huống.
  Chú ý về các thay đổi trong hệ số.
  `;
  
    // Replace newlines with <br /> tags
    const contentWithBreaks = markdownContent.replace(/\n/g, '  \n'); // Add two spaces before the newline for markdown to recognize the break

    const markdownContent_2 = `
1. **Thông tin về MerapLion:** + 2 điểm/Video  
2. **Thông tin sản phẩm:**
   - Tờ giới thiệu sản phẩm: +2 điểm/SKU nhấn mạnh & 1 điểm/SKU còn lại (SKU nhấn mạnh thay đổi theo tháng)
   - Clip giới thiệu sản phẩm: +2 điểm/video
   - Hướng dẫn sử dụng sản phẩm: +2 điểm/video  
3. **Thông tin bệnh học:** +1 điểm/video  
4. **Sổ tay người thầy thuốc:** +1 điểm/chuyên đề  
5. **Tư vấn cùng chuyên gia:** +1 điểm/video
    `;
      // Replace newlines with <br /> tags
      const contentWithBreaks_2 = markdownContent_2.replace(/\n/g, '  \n'); // Add two spaces before the newline for markdown to recognize the break

  return (
    <Row className="justify-content-center py-4">
      <Col md={4}>
        <div className="intro-wrapper">
          {/* Top Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              maxHeight: "300px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://storage.googleapis.com/django_media_biteam/nvbc/Gio%CC%9B%CC%81i%20thie%CC%A3%CC%82u-2x.png"
              alt="Top Banner"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              className="img-fluid"
            />
          </div>

          {/* Greeting */}
          <div className="greeting-box text-center mt-4">
            <h5>Xin chào, {userName}!</h5>
            <p>
              Tham gia và Hoạt động thường xuyên để tăng điểm và nhận được những phần quà giá trị mỗi quý từ MerapLion.
            </p>
          </div>

          {/* Info Section */}
          <div className="info-section mt-4">
            <div className="vertical-line" />

            <div className="info-box">
              {/* <div className="icon-text d-flex mb-3"> */}
                {/* <img src={iconInfo} alt="Info Icon" className="me-3" /> */}
                  <div style={{ fontSize: '14px' }}>
                    <ReactMarkdown>
                    {contentWithBreaks}
                    </ReactMarkdown>
                  {/* </div> */}
                </div>
              {/* <div className="icon-text d-flex"> */}
                {/* <img src={iconLightning} alt="Lightning Icon" className="me-3" /> */}
                <div style={{ fontSize: '14px' }}>
                    <ReactMarkdown>
                    {contentWithBreaks_2}
                    </ReactMarkdown>
                  {/* </div> */}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Container className="text-center mt-4">
          <Link to="/formcontrol/nvbc_mainpage">
            <Button className="start-button" variant="info">
              BẮT ĐẦU
            </Button>
          </Link>
          </Container>
        </div>
      </Col>
    </Row>
  );
};

export default Nvbc_introduction;