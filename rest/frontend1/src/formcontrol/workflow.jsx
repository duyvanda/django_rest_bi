import { Card, Container, Row, Col } from 'react-bootstrap';
import {
  FaUserMd,
  FaPlusCircle,
  FaGift,
  FaCogs,
  FaFileInvoiceDollar 
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const Workflow = () => {
  const history = useHistory(); // ✅ React Router v5 dùng useHistory

  // Danh sách các mục điều hướng có thêm icon
  const items = [
    {
      stt: 1,
      title: 'Upload thu hồi GPP',
      description: 'Upload file excel chứa thông tin KH bị thu hồi GPP để đồng bộ dữ liệu với DMS. Thông tin Số giấy chứng nhận ĐĐKKDD và Ngày cấp (dd/mm/yyyy) là bắt buộc',
      path: '/formcontrol/excel_kh_bi_thu_hoi_gpp',
      icon: <FaUserMd size={28} color="#007bff" />
    }
  ];

  const sortedList = [...items].sort((a, b) => a.stt - b.stt);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h5 className="mb-4 fw-bold">Chọn thao tác</h5>
      <Row xs={1} md={2} lg={2} className="g-4">
        {sortedList.map((item, index) => (
          <Col key={index}>
            <Card
              className="shadow-sm"
              onClick={() => history.push(item.path)} // ✅ Đúng cú pháp React Router v5
              style={{ cursor: 'pointer' }}
            >
            <Card.Body>
              <div className="mb-2">{item.icon}</div>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
            </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Workflow;