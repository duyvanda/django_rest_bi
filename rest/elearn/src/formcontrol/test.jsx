import { Card, Container, Row, Col } from 'react-bootstrap';
import {
  FaUserMd,
  FaPlusCircle,
  FaGift,
  FaCogs
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const NavigationCards = () => {
  const history = useHistory(); // ✅ React Router v5 dùng useHistory

  // Danh sách các mục điều hướng có thêm icon
  const items = [
    {
      stt: 1,
      title: 'Danh sách HCP',
      description: 'Đây là danh sách HCP.',
      path: '/danh-sach-hcp',
      icon: <FaUserMd size={28} color="#007bff" />
    },
    {
      stt: 2,
      title: 'Tạo mới HCP/PCL',
      description: 'Phân tích dữ liệu theo từng khu vực.',
      path: '/phan-tich-khu-vuc',
      icon: <FaPlusCircle size={28} color="#28a745" />
    },
    {
      stt: 3,
      title: 'Booking chi phí quà tặng HCP',
      description: 'Xem báo cáo doanh thu theo quý.',
      path: '/bao-cao-doanh-thu',
      icon: <FaGift size={28} color="#ffc107" />
    },
    {
      stt: 4,
      title: 'Booking chi phí Gimmick HCP',
      description: 'Phân tích dữ liệu theo từng khu vực.',
      path: '/phan-tich-khu-vuc',
      icon: <FaCogs size={28} color="#6c757d" />
    }
  ];

  const sortedList = [...items].sort((a, b) => a.stt - b.stt);

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h5 className="mb-4 fw-bold">Điều hướng</h5>
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

export default NavigationCards;