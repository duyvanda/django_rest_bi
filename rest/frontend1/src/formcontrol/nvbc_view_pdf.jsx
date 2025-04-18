import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
// import {  } from 'react-router-dom';

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

const Nvbc_view_pdf = () => {
    const history = useHistory();
    const [pdfUrl, setPdfUrl] = useState(null);
    const location = useLocation();

  // Function to handle back navigation
  const handleGoBack = () => {
    history.goBack();  // Go back to the previous page
  };

  useEffect(() => {
    // Extract the 'pdf' query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const pdf = queryParams.get('pdf');
    if (pdf) {
      setPdfUrl(pdf);
    }
  }, [location]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',  // Set white background for the whole page
        color: '#000',  // Make text black for contrast
      }}
    >
      {/* Back Button */}
      <div style={{ textAlign: 'center'}}>
        <Button variant="success" size="sm" onClick={handleGoBack}>
          Quay lại
        </Button>
      </div>
      {/* PDF iframe with a max-width like Google Drive */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          padding: 0,
          margin: 0,
          backgroundColor: '#fff',  // Ensure iframe background is white
        }}
      >
        <iframe
          src={`${pdfUrl}`}
          frameBorder="0"  // No borders around the iframe
          title="PDF Viewer"
          style={{
            maxWidth: '1000px',  // Set max-width similar to Google Drive's embedded viewer
            width: '100%',  // Ensures responsiveness (takes up full width of the container)
            height: '600px',  // Makes the iframe take up most of the screen height
            border: 'none',  // Remove any border around the iframe
            padding: '0',  // No padding
            margin: '0',  // No margin
            boxSizing: 'border-box',  // Ensures padding and borders are included in the total width
            backgroundColor: '#fff',  // Set iframe background to white
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default Nvbc_view_pdf;
