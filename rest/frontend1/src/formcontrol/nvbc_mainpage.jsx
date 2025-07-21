/* eslint-disable */
import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { FaPlus, FaMinus } from 'react-icons/fa'; // Import plus and minus icons
import { BiStar, BiTrophy } from "react-icons/bi";
import { FaStar, FaFire } from "react-icons/fa";
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


const Nvbc_mainpage = ({history}) => {

    const list_chon = [
        // { id: 1, value: "6 điểm : Ổn", color: "#d1d1d1", icon: <BiStar /> },
        // { id: 2, value: "7 điểm : Hay", color: "#a0e6a0", icon: <FaStar /> },
        // { id: 3, value: "8 điểm : Khá Hay", color: "#6ad06a", icon: <FaStar style={{ color: "gold" }} /> },
        { id: 4, value: "Túi đựng mỹ phẩm, đồ du lịch da PU thoáng khí", color: "#42c1f5", icon: <FaFire style={{ color: "red" }} /> },
        { id: 5, value: "Túi cói kèm charm đáng yêu", color: "#ffbf47", icon: <BiTrophy style={{ color: "gold" }} /> }
    ];

  useEffect(() => {
    const storedUser = localStorage.getItem("nvbc_user");
    if (!storedUser) {
      history.push("/formcontrol/nvbc_login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUserName(parsedUser.name || "Người dùng");
    setUserPhone(parsedUser.phone);

    // Fetch user's current point
    fetch(`https://bi.meraplion.com/local/nvbc_get_point/?phone=${parsedUser.phone}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch points");
        return res.json();
      })
      .then((data) => {
        setUserPoint(data.point || 0);
        setContentList(data.contentlist);
        setModalData(data.lich_su_diem)
      })
      .catch((err) => {
        console.error("Error fetching user points:", err);
      });
  }, [history]);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPoint, setUserPoint] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [show_chon_qua_thang, set_show_chon_qua_thang] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState("");

  const [contentList, setContentList] = useState([]);

  // State for tracking the open/close status of categories and subcategories
  const [openCategories, setOpenCategories] = useState({
    "VIDEO GIỚI THIỆU MERAPLION": false,
    "THÔNG TIN SẢN PHẨM": false,
    "THÔNG TIN BỆNH HỌC": false,
    "SỔ TAY NGƯỜI THẦY THUỐC": false,
    "TƯ VẤN CÙNG CHUYÊN GIA": false
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

    // Handle opening modal and setting multiple data
    const handleShowModal = () => {
      setShowModal(true); // Open the modal
    };
  
    // Handle closing the modal
    const handleCloseModal = () => {
      setShowModal(false);
    };

  const handleClose = () => set_show_chon_qua_thang(false);
  // const handleShow = () => setShow(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa", // light gray background
        color: "#212529", // dark text
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>

          <Modal show={show_chon_qua_thang} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                Chúc mừng bạn đã là <br></br>
                Thành viên tích cực nhất tháng 07/202525!!! <br></br>
                Vui lòng chọn 1 trong 2 món quà bên dưới:
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
          {list_chon.map((item) => (
          <label 
          key={item.id} 
          style={{ 
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px", margin: "5px 0", borderRadius: "8px",
              backgroundColor: selectedValue2 === item.value ? item.color : "#fff",
              border: `2px solid ${item.color}`,
              transition: "0.3s",
              cursor: "pointer",
              boxShadow: selectedValue2 === item.value ? "0px 0px 10px rgba(0,0,0,0.2)" : "none"
          }}
          >
          <span style={{ fontSize: "22px", width: "25px", textAlign: "center", display: "flex", alignItems: "center" }}>
              {item.icon}
          </span>
          <Form.Check
              type="radio"
              name="diem_chon"
              id={`option-${item.id}`}
              label={item.value}
              value={item.value}
              checked={selectedValue2 === item.value}
              onChange={(e) => setSelectedValue2(e.target.value)}
              style={{ display: "flex", alignItems: "center", flex: 1 }}
          />
          </label>
          ))}

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Lưu quà
              </Button>
            </Modal.Footer>
          </Modal>

            {/* Header Section */}
            <Row className="align-items-center mb-3 px-2">
              <Col>
                <h5 className="mb-0 text-primary fw-bold">{userName}</h5>
              </Col>
              <Col className="text-end">
              <Button
              variant="link"
              className="text-decoration-none text-info fw-semibold"
              onClick={handleShowModal} // Open Modal on Click
              >
              Lịch sử điểm
              </Button>
              </Col>
            </Row>

            {/* Banner Image */}
            <div className="text-center mb-4">
              <img
                src="https://storage.googleapis.com/django_media_biteam/nvbc/Ta%CC%82n%20binh-2x.png"
                alt="Top Banner"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
            </div>

            {/* Points Section */}
            <Card className="text-center mb-4 shadow-sm border-0">
              <Card.Body>
                <h1 className="text-success fw-bold display-5">
                {userPoint} Điểm
                </h1>
                <p className="text-muted mb-0">
                  Điểm tổng hợp từ việc xem tài liệu, video
                </p>
              </Card.Body>
            </Card>

            {/* Content List */}
            <Card className="shadow-sm">
              <Card.Body>
                <ul className="list-unstyled">
                  {contentList.map((content, index) => (
                    <li key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{content.category}</strong>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => toggleCategory(content.category)}
                        >
                          {openCategories[content.category] ? <FaMinus /> : <FaPlus />}
                        </Button>
                      </div>

                      {/* Expanded Category Content */}
                      {openCategories[content.category] && (
                        <ul className="mt-2 ps-3 list-unstyled">
                          {content.category === "THÔNG TIN SẢN PHẦM" ? (
                            Object.entries(groupSubcategories(content.subcategories)).map(
                              ([subCategoryName, subList], subIndex) => (
                                <li key={subIndex} className="mb-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <strong>{subCategoryName}</strong>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={() =>
                                        toggleSubCategory(content.category, subCategoryName)
                                      }
                                    >
                                      {openSubCategory[`${content.category}-${subCategoryName}`] ? (
                                        <FaMinus />
                                      ) : (
                                        <FaPlus />
                                      )}
                                    </Button>
                                    {/* <p1>abc</p1> */}
                                  </div>

                                  {/* Documents inside Subcategory */}
                                  {openSubCategory[
                                    `${content.category}-${subCategoryName}`
                                  ] && (
                                    <ul className="mt-1 ps-3 list-unstyled">
                                      {subList.map((sub, i) => (
                                        <li key={i}>
                                          {sub.type === "pdf" && (
                                            <>
                                            <Link
                                              to={`/formcontrol/nvbc_view_pdf?pdf=${encodeURIComponent(sub.url)}&document_id=${sub.document_id}`}
                                              className="text-decoration-none"
                                            >
                                              📄 {sub.document_name}
                                            </Link>
                                            </>
                                          )}
                                          {sub.type === "video" && (
                                            <Link
                                              to={`/formcontrol/nvbc_view_video?video=${encodeURIComponent(sub.url)}&document_id=${sub.document_id}`}
                                              className="text-decoration-none"
                                            >
                                              🎥 {sub.document_name}
                                            </Link>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              )
                            )
                            )
                          // khác thông tin sản phẩm
                          : (
                                content.subcategories.map((sub, subIndex) => (
                                  <li key={subIndex}>
                                    {sub.type === "pdf" && (
                                      <Link
                                        to={`/formcontrol/nvbc_view_pdf?pdf=${encodeURIComponent(sub.url)}&document_id=${sub.document_id}`}
                                        className="text-decoration-none"
                                      >
                                        📄 {sub.document_name}
                                      </Link>
                                    )}
                                    {sub.type === "video" && (
                                      <Link
                                        to={`/formcontrol/nvbc_view_video?video=${encodeURIComponent(sub.url)}&document_id=${sub.document_id}`}
                                        className="text-decoration-none"
                                      >
                                        🎥 {sub.document_name}
                                      </Link>
                                    )}
                                  </li>
                                ))
                            )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for Lịch sử điểm */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Lịch sử điểm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Loop through all items in lich_su_diem */}
          {modalData.map((item, index) => (
            <div key={index}>
              <p><strong>Tên tài liệu:</strong> {item.document_name}</p>
              <p><strong>Điểm:</strong> {item.point}</p>
              <p><strong>Giờ xem:</strong> {item.inserted_at}</p>
              <hr />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Nvbc_mainpage;



// [
//   {
//     "category": "SỔ TAY NGƯỜI THẦY THUỐC",
//     "subcategories": [
//       {
//         "sub_category": "",
//         "url": "https://drive.google.com/file/d/1-D3TngxodUL-oHccdCvu7zGUuHhexBbA/preview",
//         "type": "pdf",
//         "document_name": "MIMS - BỆNH LÝ KHÔ MẮT",
//         "document_id": 69,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://drive.google.com/file/d/1_mdPjQXL-xQCjN8dhThI6FQwOwOT6myd/preview",
//         "type": "pdf",
//         "document_name": "MIMS - BỆNH LÝ TRÀO NGƯỢC DẠ DÀY THỰC QUẢN & TIÊU CHẢY",
//         "document_id": 70,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://drive.google.com/file/d/1KsjXB11nYEIQcLTfdX67MYOU-hY1ouXY/preview",
//         "type": "pdf",
//         "document_name": "MIMS - CÁC BỆNH LÝ TAI MŨI HỌNG THƯỜNG GẶP",
//         "document_id": 71,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://drive.google.com/file/d/1z4vR6lV4-Tp1_GBXtQhWEBCGNbsiEiG8/preview",
//         "type": "pdf",
//         "document_name": "MIMS - VỆ SINH PHỤ NỮ",
//         "document_id": 72,
//         "point": 1
//       }
//     ]
//   },
//   {
//     "category": "THÔNG TIN BỆNH HỌC",
//     "subcategories": [
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/kHinHZY7JMo?si=01iVctGHYdCKhtmm",
//         "type": "video",
//         "document_name": "Trào ngược dạ dày thực quản (GERD) - Phối hợp thuốc trong điều trị",
//         "document_id": 61,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/ux-13nEaatg?si=XjjdMkUBMgpVCqOk",
//         "type": "video",
//         "document_name": "Trào ngược dạ dày thực quản (GERD) - Triệu chứng, chẩn đoán, điều trị",
//         "document_id": 62,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/GELg9tVUqzo?si=3D0GbNVhmwcF0iQX",
//         "type": "video",
//         "document_name": "Trào ngược dạ dày thực quản (GERD) - Yếu tố nguy cơ và nguyên nhân gây bệnh",
//         "document_id": 63,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/EtgNyaL6xTY?si=O-is5PwwXSZsRrgJ",
//         "type": "video",
//         "document_name": "Viêm họng - Cơ chế thuốc súc họng",
//         "document_id": 64,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/G5KslRuhWiw?si=jK93jFDl13qCb5Sg",
//         "type": "video",
//         "document_name": "Viêm họng - Phân loại và phương pháp điều trị",
//         "document_id": 65,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/C2YyrG9yKbE?si=B3GLJ-qrmK1oQr_l",
//         "type": "video",
//         "document_name": "Viêm họng - Triệu chứng và đường lây truyền",
//         "document_id": 66,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/DiQ-Pt2fUR4?si=0i0fOLxRMNm3AT0m",
//         "type": "video",
//         "document_name": "Viêm mũi dị ứng - Phương pháp điều trị",
//         "document_id": 67,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Viêm mũi dị ứng - Tổng quan bệnh lý",
//         "document_id": 68,
//         "point": 2
//       }
//     ]
//   },
//   {
//     "category": "THÔNG TIN SẢN PHẦM",
//     "subcategories": [
//       {
//         "sub_category": "TỜ GIỚI THIỆU SẢN PHẨM",
//         "url": "https://drive.google.com/file/d/1bO9g6M0ZsiRj7L-Z_fhRR4xFFljrHcXO/preview",
//         "type": "pdf",
//         "document_name": "ADACAST - Thuốc xịt mũi steroid viêm mũi dị ứng, viêm mũi xoang",
//         "document_id": 4,
//         "point": 1
//       },
//       {
//         "sub_category": "TỜ GIỚI THIỆU SẢN PHẨM",
//         "url": "https://drive.google.com/file/d/1Z9F_h5zgGd1gWn5H_AZbxgIjrPPCYfZB/preview",
//         "type": "pdf",
//         "document_name": "AMFORTGEL - Thuốc trung hòa acid dạ dày",
//         "document_id": 5,
//         "point": 1
//       },
//       {
//         "sub_category": "CLIP THÔNG TIN SẢN PHẦM",
//         "url": "https://www.youtube.com/embed/OnEkMka21Tc?si=Q3GcMH6b6TVpyuZj",
//         "type": "video",
//         "document_name": "EBYSTA - Thuốc trào ngược dạ dày thực quản",
//         "document_id": 52,
//         "point": 2
//       },
//       {
//         "sub_category": "CLIP THÔNG TIN SẢN PHẦM",
//         "url": "https://www.youtube.com/embed/rDmOvgpTyXE?si=E6L6vieF5ufHRFIn",
//         "type": "video",
//         "document_name": "MEDORAL - Súc miệng họng sát khuẩn",
//         "document_id": 53,
//         "point": 2
//       },
//       {
//         "sub_category": "CLIP THÔNG TIN SẢN PHẦM",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "MEPATYL - Thuốc nhỏ tai",
//         "document_id": 54,
//         "point": 2
//       }
//     ]
//   },
//   {
//     "category": "THÔNG TIN VỀ MERAPLION",
//     "subcategories": [
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/UbbY72EqDm8?si=Kd6N3N5-E_Etpf01",
//         "type": "video",
//         "document_name": "MerapLion",
//         "document_id": 1,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/eXEZjKgndh4?si=Y6jQzGAhkMK4Rogh",
//         "type": "video",
//         "document_name": "MerapLion 25 năm",
//         "document_id": 2,
//         "point": 2
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/ZPsps0oRXYA?si=VThKvGzLJh_Triq",
//         "type": "video",
//         "document_name": "MerapLion - Online, XP",
//         "document_id": 3,
//         "point": 2
//       }
//     ]
//   },
//   {
//     "category": "TƯ VẤN CÙNG CHUYÊN GIA",
//     "subcategories": [
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Trào ngược dạ dày thực quản (GERD) - Giải đáp phần 2",
//         "document_id": 73,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Trào ngược dạ dày thực quản (GERD) - Giải đáp phần 3",
//         "document_id": 74,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Viêm họng - Giải đáp phần 1",
//         "document_id": 75,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Viêm họng - Giải đáp phần 2",
//         "document_id": 76,
//         "point": 1
//       },
//       {
//         "sub_category": "",
//         "url": "https://www.youtube.com/embed/5O--4IeeffY?si=MT_O1kRlDn6buPzd",
//         "type": "video",
//         "document_name": "Viêm mũi dị ứng - Giải đáp phần 2",
//         "document_id": 77,
//         "point": 1
//       }
//     ]
//   }
// ]