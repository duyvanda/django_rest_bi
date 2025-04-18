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

const Nvbc_view_video = () => {
    const history = useHistory();
    const [videoUrl, setvideoUrl] = useState(null);
    const location = useLocation();

  useEffect(() => {
    // Extract the 'pdf' query parameter from the URL
    window.scrollTo(0, 0);
    const queryParams = new URLSearchParams(location.search);
    const videoUrlp = queryParams.get('video');
    if (videoUrlp) {
      setvideoUrl(videoUrlp);
    }
  }, [location]);

  // Function to handle back navigation
  const handleGoBack = () => {
    history.goBack();  // Go back to the previous page
  };
  // const videoUrl = "https://www.youtube.com/embed/OnEkMka21Tc?si=Q3GcMH6b6TVpyuZj";
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
      {/* Go Back Button */}
      <div style={{ textAlign: 'center' }}>
        <Button variant="success" size="sm" onClick={handleGoBack}>
          Quay lại
        </Button>
      </div>

      {/* <h1 style={{ textAlign: 'center', margin: '20px 0', fontSize: '24px' }}>View Video</h1> */}

      {/* Video iframe with a max-width like Google Drive */}
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          padding: 0,
          margin: 0,
          backgroundColor: '#fff',  // Ensure iframe background is white
        }}
      >
        {/* Container to maintain 16:9 aspect ratio, take up full screen */}
        <div
          style={{
            position: 'relative',
            width: '100%',  // Set width to 100% of the viewport width
            height: '0',
            paddingBottom: '56.25%',  // 16:9 aspect ratio
            overflow: 'hidden',
            backgroundColor: '#fff',  // Optional: white background around the video
          }}
        >
          <iframe
            src={videoUrl}
            frameBorder="0"  // No borders around the iframe
            title="Video Viewer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen  // Ensure full screen functionality is enabled
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',  // Ensure the iframe takes the full width
              height: '75%',  // Ensure the iframe takes the full height
              border: 'none',  // Remove any border around the iframe
            }}
          ></iframe>

      {/* Media Query for Mobile: Make the video fill 100% width and height on small screens */}
      <style>
        {`
          /* Responsive adjustments for mobile */
          @media (max-width: 768px) {
            div[style*="position: relative"] {
              width: 100%;  /* Make the video fill the entire width on mobile */
              height: 100vh;  /* Set height to 100% of the viewport height on small screens */
              padding-bottom: 56.25%;  /* 16:9 aspect ratio */
            }

            h1 {
              font-size: 20px;  /* Reduce title font size for mobile */
            }
          }
        `}
      </style>
        </div>
      </div>
    </div>
  );
};

export default Nvbc_view_video;
