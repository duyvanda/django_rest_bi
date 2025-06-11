import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
    Button,
    ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Card,
    ListGroup,
    Modal,
    FloatingLabel,
    Stack,
    Dropdown
} from "react-bootstrap";

const Qr_scan_quan_ly_tai_san = () => {
    const qrRegionId = "html5qr-code-full-region";
    const html5QrCodeRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState("");
    const [device_info, set_device_info] = useState(null); // new state for backend response

    
    const [selectedFile, setSelectedFile] = useState([]);

    const choose_images = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile([...selectedFile, ...e.target.files]);
        }

    const clear_data = () => {
    setSelectedFile([]);
    }

    const handle_click_xoa_file = (fileName) => {
    setSelectedFile((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileName)
      );
};

const startScanner = async () => {
  set_device_info(null);
  const devices = await Html5Qrcode.getCameras();
  const backCamera = devices.find(d => d.label.toLowerCase().includes("back")) || devices[0];

  html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
  setScanning(true);

  const config = {
    fps: 10,
    qrbox: { width: 300, height: 300 }, // Good size for aligning small QR codes
    aspectRatio: 1.333,                 // 4:3 camera ratio
    disableFlip: true,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  };

  const cameraConfig = backCamera
    ? { deviceId: { exact: backCamera.id } }
    : { facingMode: "environment" };

  html5QrCodeRef.current.start(
    cameraConfig,
    config,
    async (decodedText) => {
      alert(`✅ Scanned: ${decodedText}`);
      setScanResult(decodedText);
      await sendToBackend(decodedText);
      stopScanner();
    },
    (errorMessage) => {
      console.warn("Scan error:", errorMessage);
    }
  );
};

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        setScanning(false);
      });
    }
  };

  const sendToBackend = async (data) => {
  try {
    const response = await fetch(`https://bi.meraplion.com/local/get_data/get_qr_scan_quan_ly_tai_san/?ma_tai_san=${data}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ qrData: data }),
    });
    if (response.ok) {
    const result = await response.json();
    set_device_info(result);
    console.log("✅ Data sent to backend:", result);
    }

    else {
      throw new Error("Failed to send data");
    }

  } catch (error) {
    console.error("❌ Error sending to backend:", error);
  }
};

  useEffect(() => {
    return () => stopScanner(); // cleanup on unmount
  }, []);

return (
  <Row className="justify-content-center py-4">
    <Col md={4}>
      <h2>QR Scanner</h2>

      {!scanning && (
        <button onClick={startScanner} className="btn btn-primary mb-3">
          📷 Start Scan (Back Camera v2)
        </button>
      )}

      <div
        id={qrRegionId}
        style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}
      />

      <p>{'Mã QLTS: ' + scanResult}</p>

      {device_info && (
        <Form className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>📛 Name</Form.Label>
            <Form.Control type="text" value={device_info.name || ""} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>📍 Location</Form.Label>
            <Form.Control type="text" value={device_info.location || ""} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>👤 Owner</Form.Label>
            <Form.Control type="text" value={device_info.owner || ""} readOnly />
          </Form.Group>
        </Form>
      )}

    <>
        <Card className="mt-2 border-success" style={{ borderWidth: "0.1rem" }}>
    <Card.Title >Upload 01 Hình Ảnh</Card.Title>
    <Form.Control id='customFileInputCapture' type="file" accept="image/*" capture="environment" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
    <Button style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInputCapture").click()}>
        CHỤP HÌNH
    </Button>
    
    <Form.Control id='customFileInput' type="file" accept="image/*" style={{width: "115px", fontWeight: "bold", display: "none" }} multiple={true} onChange={ (e) => choose_images(e) } ></Form.Control>
    <Button className="mt-2" style={{ width: '10rem' }} size="sm" variant="secondary" onClick={() => document.getElementById("customFileInput").click()}>
        UP HÌNH TỪ MÁY
    </Button>

    <h5 className="ml-1 mt-1 text-wrap">{Array.from(selectedFile).length} hình đã up</h5>
    
    {Array.from(selectedFile)
    .map( (file, index) =>
        <ListGroup horizontal key={index}>
        <ListGroup.Item className="text-wrap">{file.name}</ListGroup.Item>
        <ListGroup.Item>
        <Button className="" size="sm" variant="danger" onClick={ () => handle_click_xoa_file(file.name) }> Xóa </Button>
        </ListGroup.Item>
        </ListGroup>                            
    )
    }
    </Card>
    </>
    </Col>
  </Row>
);
};

export default Qr_scan_quan_ly_tai_san;
