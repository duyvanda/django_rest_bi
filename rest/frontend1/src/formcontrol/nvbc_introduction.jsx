/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom"; // React Router v5
// import { Container, Row, Col, Button } from 'react-bootstrap';
import './IntroductionPage.css';
// import topBanner from '../images/georgie-cobbs-bKjHgo_Lbpo-unsplash.jpg';
// import iconInfo from '../images/digital-campaign.png';
// import iconLightning from '../images/digital-campaign.png';
import ReactMarkdown from "react-markdown";
// import remarkBreaks from 'remark-breaks';

import {
  Button,
  Col,
  Row,
  Container,
  // Dropdown,
  // Form,
  // Spinner,
  // InputGroup,
  // Stack,
  // FloatingLabel,
  // Table,
  // Modal,
  Card,

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

  const [showContent, setShowContent] = useState(false); // State to control visibility


  const [rewardData, setRewardData] = useState([
  // {
  //   time: "Tháng",
  //   condition: "Top 100 Thành viên có điểm tích lũy cao nhất của tháng được chọn 1 món quà sau:",
  //   name: "Ô dù gấp gọn kèm hộp đựng chống sốc",
  //   link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20200k%20-%20%C3%94%20c%E1%BA%A7m%20tay.jpg"
  // },
  {
    time: "Tháng",
    condition: "t1",
    name: "Túi đựng mỹ phẩm, đồ du lịch da PU thoáng khí",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20200k%20-%20T%C3%BAi%20%C4%91%E1%BB%B1ng%20m%E1%BB%B9%20ph%E1%BA%A9m%20du%20l%E1%BB%8Bch.jpg"
  },
  {
    time: "Tháng",
    condition: "t1",
    name: "Túi cói kèm charm đáng yêu",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20300k%20-%20T%C3%BAi%20c%C3%B3i%20k%C3%A8m%20charm.jpg"
  },
  {
    time: "Quý",
    condition: "t2",
    name: "Ba lô thời trang Sakos Dahlia (SBV169CR)",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/BaloSakos-demo.jpg"
  },
  {
    time: "Quý",
    condition: "t2",
    name: "Máy xây sinh tố cầm tay Bear SB –MX04X",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20500k%20-%20M%C3%A1y%20xay%20sinh%20t%E1%BB%91%20c%E1%BA%A7m%20tay%20Bear.jpg"
  },
  // {
  //   time: "Quý",
  //   condition: "t3",
  //   name: "Đồng hồ tích hợp đèn ngủ có điều khiển từ xa và điều chỉnh độ sáng vô cấp",
  //   link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20300k%20-%20%C4%90%E1%BB%93ng%20h%E1%BB%93%20ki%C3%AAm%20%C4%91%C3%A8n%20ng%E1%BB%A7.jpg"
  // },
  {
    time: "Quý",
    condition: "t3",
    name: "Máy sấy tóc Philips HP8108 1000W",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20200k%20-%20M%C3%A1y%20s%E1%BA%A5y%20t%C3%B3c%20Philips.jpg"
  },
  {
    time: "Quý",
    condition: "t3",
    name: "Quạt cầm tay tốc độ cao Shimono SM-HF18(W)",
    link: "https://bi.meraplion.com/DMS/thuong_nvcb/Qu%C3%A0%20t%E1%BA%B7ng%20-%20Quat_cam_tay.jpg"
  }
]);


const filterBy = (type, description) =>
  rewardData.filter((item) => item.time === type && item.condition === description);

const renderCards = (items) => (
  <Row className="mt-3">
    {items.map((item, index) => (
      <Col key={index} xs={12} className="mb-4"> {/* Full width on small screens */}
        <Card
          className="shadow-sm"
          style={{
            height: "auto", // Let height expand naturally
            overflow: "hidden",
          }}
        >
          <Card.Img
            variant="top"
            src={item.link}
            style={{
              width: "100%",
              height: "250px",        // ⬅️ Make image taller for mobile
              objectFit: "cover",     // Fills area nicely (can use 'contain' if needed)
            }}
          />

          <Card.Body style={{ padding: "10px" }}>
            <Card.Title
              style={{
                fontSize: "14px",
                fontWeight: "600",
                lineHeight: "1.3",
                maxHeight: "2.6em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);


  const markdownContent = `
  `;
  
    // Replace newlines with <br /> tags
    const contentWithBreaks = markdownContent.replace(/\n/g, '  \n'); // Add two spaces before the newline for markdown to recognize the break

    const markdownContent_2 = `
#### Công thức tính điểm trên 1 lượt truy cập:

**Điểm** = Tỷ lệ thời gian * Hệ số chủ đề

**- Tỷ lệ thời gian**:
Thời gian tra cứu thư viện được quy đổi theo tỷ lệ sau:
- **Dưới 30 giây** = 0%
- **Từ 30 giây trở lên** = 100%

**- Hệ số chủ đề**:
Mỗi chủ đề có một hệ số riêng (có thể thay đổi theo thông báo từng quý)

**Điểm số 5 chủ đề từ ngày 01/07/2025 đến 30/09/2025 như sau:**
1. **Thông tin về MerapLion**: + 2 điểm/Video
2. **Thông tin sản phẩm**:
  - Tờ giới thiệu sản phẩm: +2 điểm/SKU
  - Clip giới thiệu sản phẩm: +2 điểm/Video
  - Hướng dẫn sử dụng sản phẩm: +2 điểm/Video
3. **Thông tin bệnh học**: +2 điểm/Video
4. **Sổ tay người thầy thuốc**: +2 điểm/Chuyên đề
5. **Tư vấn cùng chuyên gia**: +2 điểm/Video

**- Điểm xét thưởng**:
- Quà Tháng: Điểm tối thiểu từ 1.000 điểm trở lên.
- Quà Quý: Điểm tối thiểu từ 3.000 điểm trở lên.
`;
      // Replace newlines with <br /> tags
      const contentWithBreaks_2 = markdownContent_2.replace(/\n/g, '  \n'); // Add two spaces before the newline for markdown to recognize the break

const markdownContent_xin_chao = `
Cám ơn Quý Dược sĩ đã tham gia chương trình **M.Ambassador** của **MerapLion**.
Với mong muốn xây dựng mối quan hệ bền vững và đồng hành lâu dài cùng Quý Dược sĩ trên hành trình chăm sóc sức khỏe gia đình Việt, **MerapLion** thấu hiểu rằng kiến thức chuyên môn chính là hành trang quan trọng giúp Quý Dược sĩ tư vấn hiệu quả và mang lại giá trị thiết thực cho bệnh nhân.  
Chính vì vậy, chúng tôi không ngừng nỗ lực chia sẻ, hỗ trợ và lan tỏa kiến thức thông qua các hoạt động thực tiễn. Trên hành trình đó, **MerapLion** luôn gìn giữ và theo đuổi những giá trị cốt lõi **“Tận tâm – Trách nhiệm – Đồng hành”**, như lời cam kết bền chặt dành cho cộng đồng Dược sĩ Việt Nam.  
Chương trình **M.Ambassador** không chỉ là nơi cung cấp những thông tin chuyên môn hữu ích, mà còn mang đến nhiều trải nghiệm giá trị.  
Quý Dược sĩ hãy tích cực tra cứu, cập nhật kiến thức và tham gia tương tác để nâng cao chuyên môn, tận hưởng trải nghiệm ý nghĩa và nhận nhiều phần quà hấp dẫn bên dưới nhé.
    `;
// Replace newlines with <br /> tags
const markdownContent_xin_chao_br = markdownContent_xin_chao.replace(/\n/g, '  \n'); // Add two spaces before the newline for markdown to recognize the break
  return (
    <Row className="justify-content-center py-4">
      <Col md={4}>
        <div className="intro-wrapper">
          {/* Top Banner */}
          {!showContent && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              maxHeight: "300px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://storage.googleapis.com/django_media_biteam/nvbc/icon-MAmbassador-29052025-Final-convert.png"
              alt="Top Banner"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              className="img-fluid"
            />
          </div>
          )}

          {showContent && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              maxHeight: "300px",
              overflow: "hidden",
            }}
          >
            <img
              src="https://bi.meraplion.com/DMS/thuong_nvcb/introduction_top_banner.jpg"
              alt="Top Banner"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              className="img-fluid"
            />
          </div>
          )}

          {/* Greeting */}
          
          {!showContent && (
          
          <div className="greeting-box text-justify mt-4">
            <h5>Xin chào Quý Dược sĩ {userName}!</h5>
            <ReactMarkdown>{markdownContent_xin_chao_br}</ReactMarkdown>
          </div>
          )
          }

          {/* Info Section */}

    <div className="info-section mt-4">
      {/* Show contentWithBreaks if showContent is false */}
      {!showContent && (
        <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'justify' }}>
          <ReactMarkdown>{contentWithBreaks}</ReactMarkdown>

          <div className="mt-4">
          <h5 className="text-info">🎁 Thành viên tích cực nhất tháng:</h5>
          <p>Tiêu chí hàng tháng: Top 100 Thành viên có mức điểm tích lũy cao nhất trong tháng (điểm tối thiểu là 1.000 điểm/tháng), được chọn 1 món quà sau:</p>
          {renderCards(filterBy("Tháng", "t1"))}
        </div>

        <div className="mt-5">
          <h5 className="text-info">🎁 Chuyên gia sản phẩm:</h5>
          <p>Tiêu chí hàng quý: Top 50 Thành viên có điểm tích lũy cao nhất trong quý (điểm tối thiểu là 3.000 điểm/quý), được chọn 1 món quà sau:</p>
          {renderCards(filterBy("Quý", "t2"))}
        </div>

        <div className="mt-5">
          <h5 className="text-info">🎁 Đọc giả chăm chỉ:</h5>
          <p>Tiêu chí hàng quý: Top 50 Thành viên có số ngày tham gia tra cứu thư viện chuyên cần nhất (điểm tối thiểu là 3.000 điểm/quý), được chọn 1 món quà sau:</p>
          {renderCards(filterBy("Quý", "t3"))}
        </div>
        </div>
      )}

      {/* Show contentWithBreaks_2 and "BẮT ĐẦU" button when showContent is true */}
      {showContent && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'justify' }}>
            <ReactMarkdown>{contentWithBreaks_2}</ReactMarkdown>
          </div>

          <Container className="text-center mt-4">
            <Link to="/formcontrol/nvbc_mainpage">
              <Button className="start-button text-white" variant="info">
                BẮT ĐẦU
              </Button>
            </Link>
          </Container>
        </div>
      )}

      {/* Show "TIẾP TỤC" button only when showContent is false */}
      {!showContent && (
        <Container className="text-center mt-4">
          <Button
            className="start-button text-white"
            variant="info"
            onClick={() => setShowContent(true)} // Inline handler
          >
            TIẾP TỤC
          </Button>
        </Container>
      )}
    </div>
          
        </div>
      </Col>
    </Row>
  );
};

export default Nvbc_introduction;


{/* <div className="info-section mt-4">
            <div className="vertical-line" />

            <div className="info-box">
              
                <div style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'justify' }} >
                    <ReactMarkdown>
                    {contentWithBreaks}
                    </ReactMarkdown>
                </div>

                <div style={{ fontSize: '14px' }}>
                  <ReactMarkdown>
                  {contentWithBreaks_2}
                  </ReactMarkdown>
                </div>

            </div>
          </div>

          <Container className="text-center mt-4">
              <Button className="start-button text-white" variant="info">
                TIẾP TỤC
              </Button>
          </Container>

          <Container className="text-center mt-4">
            <Link to="/formcontrol/nvbc_mainpage">
              <Button className="start-button text-white" variant="info">
                BẮT ĐẦU
              </Button>
            </Link>
          </Container> */}