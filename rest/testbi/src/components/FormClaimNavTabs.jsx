// src/components/FormClaimNavTabs.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const FormClaimNavTabs = () => {
    const location = useLocation();

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return isActive ? "bg-merap-active text-white" : "bg-white shadow-sm border";
    };

    return (
        <Nav variant="pills" fill className="bg-light p-2 rounded gap-2 fw-bold">
            <Nav.Item>
                <Nav.Link as={Link} to="/crmhome" className={getNavLinkClass("/crmhome") + " text-success"}>
                    HOME
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/formcontrol/form_claim_chi_phi" className={getNavLinkClass("/formcontrol/form_claim_chi_phi") + " text-primary"}>
                    ĐỀ XUẤT
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/formcontrol/form_claim_chi_phi_crm" className={getNavLinkClass("/formcontrol/form_claim_chi_phi_crm") + " text-info"}>
                    QL
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/formcontrol/form_claim_chi_phi_claimed" className={getNavLinkClass("/formcontrol/form_claim_chi_phi_claimed") + " text-success"}>
                    CLAIM
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to="/formcontrol/form_claim_chi_phi_ctp" className={getNavLinkClass("/formcontrol/form_claim_chi_phi_ctp") + " text-success"}>
                    CTP
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default FormClaimNavTabs;