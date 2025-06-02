/* eslint-disable */
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
    const storedUser = localStorage.getItem("nvbc_user");
    if (!storedUser) {
      history.push("/formcontrol/nvbc_login");
      return;
    }
    const user = JSON.parse(storedUser);
    const phone = user?.phone;
    // Extract the 'pdf' query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const pdf = queryParams.get('pdf');
    const documentId = queryParams.get("document_id");
    if (pdf) {
      setPdfUrl(pdf);
    }

    const timer = setTimeout(() => {
      const data = {
        phone: phone,
        document_id: documentId
      }
      console.log(data)
      if (phone && documentId) {
        // console.log()
        fetch("https://bi.meraplion.com/local/nvbc_track_view/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to track view");
            return res.json();
          })
          .then((data) => {
            console.log("Tracked successfully:", data);
          })
          .catch((error) => {
            console.error("Tracking error:", error);
          });
      }
    }, 30000); // 10 seconds delay
    return () => clearTimeout(timer); // cleanup
  }, [location, history]);

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
