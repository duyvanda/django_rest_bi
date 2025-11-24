/* eslint-disable */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FeedbackContext from '../context/FeedbackContext'
import {Navbar, Container, NavDropdown} from 'react-bootstrap';

function Navbar1() {
  const { userInfo, logoutUser, FilterReports, rpScreen } = useContext(FeedbackContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    console.log('User logged out');
  };

  return (
    <Navbar expand="md" style={{ backgroundColor: "#00A79D" }} className="navbar-dark shadow-sm">
      <Container className="d-flex justify-content-between">
        {/* Left Section - BACK button + Report Name */}
        <div className="d-flex align-items-center">
          {rpScreen ? (
            <>
              <Link to="/" className="btn btn-warning btn-sm fw-bold">⬅ BACK  </Link>
              <></>
              {FilterReports && (
                <span className="text-white ms-2 fw-bold">{FilterReports.tenreport} ({userInfo.manv}) </span>
              )}
            </>
          ) : (
            <div className="d-flex align-items-center">
              <Link to="/" className="navbar-brand fw-bold text-white">📊 BI PORTAL</Link>
              {userInfo && (
                <NavDropdown title={userInfo.manv} className="ms-2 text-white" menuVariant="dark">
                  <NavDropdown.Item onClick={() => navigate('/reports')}>
                    📑 <strong>REPORTS</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/crmhome')}>
                    💼 <strong>CRM HOME</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/workflow')}>
                    🔁 <strong>WORKFLOW</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 <strong>LOGOUT</strong>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Navbar1;