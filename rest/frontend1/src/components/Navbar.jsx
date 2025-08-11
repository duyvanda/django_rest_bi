/* eslint-disable */
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Container, NavDropdown, Button } from 'react-bootstrap';
import FeedbackContext from '../context/FeedbackContext';

function Navbar1() {
  const { userInfo, logoutUser, FilterReports, rpScreen } = useContext(FeedbackContext);
  const history = useHistory(); // React Router v5

  const handleLogout = () => {
    logoutUser();
    history.push('/login');
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
                  <NavDropdown.Item onClick={() => history.push('/reports')}>
                    📑 <strong>REPORTS</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => history.push('/crmhome')}>
                    💼 <strong>CRM HOME</strong>
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