// src/components/ClaimNavTabs.jsx
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const ClaimNavTabs = () => {
  const location = useLocation();

  return (
    <Row className="justify-content-center mb-1 mt-1">
      <Col xs={3}>
        <Link to="/formcontrol/form_claim_chi_phi">
          <Button
            variant={location.pathname === "/formcontrol/form_claim_chi_phi" ? "primary" : "outline-primary"}
            className="w-100"
          >
            ĐỀ XUẤT
          </Button>
        </Link>
      </Col>
      <Col xs={3}>
        <Link to="/formcontrol/form_claim_chi_phi_ql_duyet">
          <Button
            variant={location.pathname === "/formcontrol/form_claim_chi_phi_ql_duyet" ? "secondary" : "outline-secondary"}
            className="w-100"
          >
            QL DUYỆT
          </Button>
        </Link>
      </Col>
      <Col xs={3}>
        <Link to="/formcontrol/form_claim_chi_phi_final">
          <Button
            variant={location.pathname === "/formcontrol/form_claim_chi_phi_final" ? "success" : "outline-success"}
            className="w-100"
          >
            CLAIM CHI PHÍ
          </Button>
        </Link>
      </Col>
      <Col xs={3}>
        <Link to="/formcontrol/cong_tac_phi">
          <Button
            variant={location.pathname === "/formcontrol/cong_tac_phi" ? "success" : "outline-success"}
            className="w-100"
          >
            CÔNG TÁC PHÍ
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

export default ClaimNavTabs;