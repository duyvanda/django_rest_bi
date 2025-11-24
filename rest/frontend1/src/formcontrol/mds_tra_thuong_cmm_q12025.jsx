/* eslint-disable */
import { useState } from "react";
import { Nav, Container, Row, Col } from "react-bootstrap";
import { MdsTraThuongCmmQ12025L1 } from "./mds_tra_thuong_cmm_q12025_l1";
import { MdsTraThuongCmmQ12025L2 } from "./mds_tra_thuong_cmm_q12025_l2";

function Mds_tra_thuong_cmm_q12025() {
    const [activeTab, setActiveTab] = useState('l1');

    return (
        <Container fluid className="bg-teal-100 h-100">
            <Row className="justify-content-center">
                <Col>
                    <div className="bg-light p-2 rounded gap-2 fw-bold">
                        <Nav variant="pills" fill defaultActiveKey="l1" onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                            <Nav.Item>
                                <Nav.Link eventKey="l1" className={activeTab === 'l1' ? 'bg-merap-active' : 'bg-white shadow-sm border'}>L1</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="l2" className={activeTab === 'l2' ? 'bg-merap-active' : 'bg-white shadow-sm border'}>L2</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="mt-2">
                        {activeTab === 'l1' && <MdsTraThuongCmmQ12025L1 />}
                        {activeTab === 'l2' && <MdsTraThuongCmmQ12025L2 />}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Mds_tra_thuong_cmm_q12025;