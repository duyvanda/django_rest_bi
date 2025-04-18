// MainPage.jsx
import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Import Link for routing
import './MainPage.css';  // Import any custom styles
import { FaPlus, FaMinus } from 'react-icons/fa'; // Import plus and minus icons
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


const Nvbc_mainpage = () => {
  const [contentList, setContentList] = useState([
    {
      "category": "Thông tin sản phẩm",
      "subcategories": [
        { 
          "sub_category": "TỜ GIỚI THIỆU SẢN PHẨM", 
          "url": "https://drive.google.com/file/d/1bO9g6M0ZsiRj7L-Z_fhRR4xFFljrHcXO/preview", 
          "type": "pdf", 
          "document_name": "ADACAST - Thuốc xịt mũi steroid viêm mũi dị ứng, viêm mũi xoang" 
        },
        { 
          "sub_category": "TỜ GIỚI THIỆU SẢN PHẨM", 
          "url": "https://drive.google.com/file/d/1zDx1xMOzmJlT1nvU5GhVEGyvMAdh4T7W/preview", 
          "type": "pdf", 
          "document_name": "ADACAST - Thuốc xịt mũi steroid viêm mũi dị ứng, viêm mũi xoang" 
        },
        { 
          "sub_category": "CLIP THIỆU SẢN PHẨM", 
          "url": "https://www.youtube.com/embed/OnEkMka21Tc?si=Q3GcMH6b6TVpyuZj", 
          "type": "video", 
          "document_name": "Video giới thiệu ADACAST" 
        }
      ]
    },
    {
      "category": "Video giới thiệu MerapLion",
      "subcategories": [
        { 
          "sub_category": "", 
          "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
          "type": "video", 
          "document_name": "ADACAST - Thuốc xịt mũi steroid viêm mũi dị ứng, viêm mũi xoang" 
        }
      ]
    },
    {
      "category": "Thông tin bệnh học",
      "subcategories": [
        { 
          "sub_category": "", 
          "url": "https://drive.google.com/file/d/1zDx1xMOzmJlT1nvU5GhVEGyvMAdh4T7Y/preview", 
          "type": "pdf", 
          "document_name": "ADACAST - Thuốc xịt mũi steroid viêm mũi dị ứng, viêm mũi xoang" 
        }
      ]
    }
  ]);

  // State for tracking the open/close status of categories and subcategories
  const [openCategories, setOpenCategories] = useState({
    "Thông tin sản phẩm": false,
    "Video giới thiệu MerapLion": false,
    "Thông tin bệnh học": false
  });
  
  // State for tracking which subcategory is clicked to show documents
  const [openSubCategory, setOpenSubCategory] = useState({});

  // Toggle visibility of main category
  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle visibility of subcategory and its documents
  const toggleSubCategory = (category, subcategory) => {
    setOpenSubCategory((prev) => ({
      ...prev,
      [`${category}-${subcategory}`]: !prev[`${category}-${subcategory}`],
    }));
  };

  // Function to group subcategories by name (to avoid duplicates)
  const groupSubcategories = (subcategories) => {
    const grouped = subcategories.reduce((acc, sub) => {
      if (!acc[sub.sub_category]) {
        acc[sub.sub_category] = [];
      }
      acc[sub.sub_category].push(sub);
      return acc;
    }, {});
    return grouped;
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={4}>
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
          <div style={{ display: 'flex', justifyContent: 'center', maxHeight: '200px', overflow: 'hidden' }}>
            <img
              src="https://storage.googleapis.com/django_media_biteam/nvbc/Ta%CC%82n%20binh-2x.png"
              alt="Top Banner"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>

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
                    {contentList.map((content, index) => (
                      <li key={index}>
                        <div>
                          {/* Main Category */}
                          <strong>{content.category}</strong>

                          {/* Show plus or minus button for categories */}
                          <Button
                            variant="link"
                            onClick={() => toggleCategory(content.category)}
                            aria-expanded={openCategories[content.category] ? "true" : "false"}
                          >
                            {openCategories[content.category] ? <FaMinus /> : <FaPlus />}
                          </Button>

                          {/* Show subcategories if the category is open */}
                          {content.category === "Thông tin sản phẩm" && openCategories[content.category] && (
                            <ul>
                              {Object.entries(groupSubcategories(content.subcategories)).map(([subCategoryName, subList], subIndex) => (
                                <li key={subIndex}>
                                  <div>
                                    <strong>{subCategoryName}</strong>
                                    <Button
                                      variant="link"
                                      onClick={() => toggleSubCategory(content.category, subCategoryName)}
                                      aria-expanded={openSubCategory[`${content.category}-${subCategoryName}`] ? "true" : "false"}
                                    >
                                      {openSubCategory[`${content.category}-${subCategoryName}`] ? <FaMinus /> : <FaPlus />}
                                    </Button>
                                  </div>

                                  {/* Show documents if subcategory is open */}
                                  {openSubCategory[`${content.category}-${subCategoryName}`] && (
                                    <ul>
                                      {subList.map((sub, subDocIndex) => (
                                        <li key={subDocIndex}>
                                          {sub.type === 'pdf' && (
                                            <Link to={`/formcontrol/nvbc_view_pdf?pdf=${encodeURIComponent(sub.url)}`}>
                                              {sub.document_name}
                                            </Link>
                                          )}
                                          {sub.type === 'video' && (
                                            <Link to={`/formcontrol/nvbc_view_video?video=${encodeURIComponent(sub.url)}`}>
                                              {sub.document_name}
                                            </Link>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                                
                              ))}
                            </ul>
                          )}

                          {content.category !== "Thông tin sản phẩm" && openCategories[content.category] && (
                            <ul>
                              {content.subcategories.map((sub, subIndex) => (
                                <li key={subIndex}>
                                  {sub.type === 'pdf' && (
                                    <Link to={`/formcontrol/nvbc_view_pdf?pdf=${encodeURIComponent(sub.url)}`}>
                                      {sub.document_name}
                                    </Link>
                                  )}
                                  {sub.type === 'video' && (
                                    <Link to={`/formcontrol/nvbc_nvbc_view_video?video=${encodeURIComponent(sub.url)}`}>
                                      {sub.document_name}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )
                          }

                          {/* {content.category === "Thông tin bệnh học" && openCategories[content.category] && (
                            <ul>
                              {content.subcategories.map((sub, subIndex) => (
                                <li key={subIndex}>
                                  {sub.type === 'pdf' && (
                                    <Link to={`/view-pdf?pdf=${encodeURIComponent(sub.url)}`}>
                                      {sub.document_name}
                                    </Link>
                                  )}
                                  {sub.type === 'video' && (
                                    <Link to={`/view-video?video=${encodeURIComponent(sub.url)}`}>
                                      {sub.document_name}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )
                          } */}

                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Nvbc_mainpage;

{/* For categories without subcategories, show the documents when clicked */}



