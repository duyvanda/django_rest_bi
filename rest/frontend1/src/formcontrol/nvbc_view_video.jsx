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
  Modal,
  Ratio
} from "react-bootstrap";

const Nvbc_view_video = () => {
    const history = useHistory();
    const [videoUrl, setvideoUrl] = useState(null);
    const location = useLocation();

  useEffect(() => {

    const storedUser = localStorage.getItem("nvbc_user");
    if (!storedUser) {
      history.push("/formcontrol/nvbc_login");
      return;
    }
    const user = JSON.parse(storedUser);
    const phone = user?.phone;
    window.scrollTo(0, 0);
    const queryParams = new URLSearchParams(location.search);
    const videoUrlp = queryParams.get('video');
    const documentId = queryParams.get("document_id");
    if (videoUrlp) {
      setvideoUrl(videoUrlp);
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
    }, 10000); // 10 seconds delay
    return () => clearTimeout(timer); // cleanup
  }, [location, history]);

  // Function to handle back navigation
  const handleGoBack = () => {
    history.goBack();  // Go back to the previous page
  };
  // const videoUrl = "https://www.youtube.com/embed/OnEkMka21Tc?si=Q3GcMH6b6TVpyuZj";
  return (
    <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff", // White background
      color: "#000", // Black text
    }}
  > 
    <Container className="my-auto"
    >
      <Row className="justify-content-center">
        <Col md={8}>
          {/* Back Button */}
          <div style={{ textAlign: 'center'}}>
          <Button variant="success" size="sm" onClick={handleGoBack}>
          Quay lại
          </Button>
          </div>
          <Ratio aspectRatio="16x9">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              // src={`${pdfUrl}`}
              src={`${videoUrl}`}
              title="YouTube video"
              allowFullScreen
            />
          </Ratio>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Nvbc_view_video;
