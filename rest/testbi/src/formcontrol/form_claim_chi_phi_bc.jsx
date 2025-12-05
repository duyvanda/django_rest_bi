import React from 'react';
import { Container } from 'react-bootstrap';
import FormClaimNavTabs from '../components/FormClaimNavTabs';

const Form_claim_chi_phi_bc = () => {
    return (
        <Container fluid className="bg-teal-100 h-100 p-2">
            <FormClaimNavTabs />
            <div className="bg-white border rounded shadow-lg p-3 mt-2">
                <h5 className="mb-3">📊 DASHBOARD CLAIM CHI PHÍ SALES</h5>
                <iframe
                    title="Báo Cáo Chi Phí"
                    width="100%"
                    height="800"
                    src="https://lookerstudio.google.com/embed/reporting/17326a7f-b84b-4bf1-a776-5b481058ae0e"
                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                    allowFullScreen
                ></iframe>
            </div>
        </Container>
    );
};

export default Form_claim_chi_phi_bc;
