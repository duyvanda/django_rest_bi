import React, { useEffect, useRef, useState, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import FeedbackContext from '../context/FeedbackContext'

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

const Qr_scan_quan_ly_tai_san = ( {history} ) => {
// const { get_id, Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)


const { get_id, Inserted_at, loading, SetLoading  } = useContext(FeedbackContext)

// THIS IS WHERE YOU ADD IT:
    console.log("Component re-rendered"); 

    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, [count]);


    const qrRegionId = "html5qr-code-full-region";
    const html5QrCodeRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState("");
    const [device_info, set_device_info] = useState(null); // new state for backend response
    const [manv, set_manv] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);

    const [alert, SetALert] = useState(false);
    const [alertText, SetALertText] = useState('');
    const [alertType, SetALertType] = useState('');

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
    setScanResult(""); // Clear previous scan result

    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        console.log("Scanner already running. Not restarting.");
        return; // Prevent starting if already scanning
    }

    // If an instance exists but is not scanning, clear it first
    if (html5QrCodeRef.current) {
        console.log("Existing scanner instance found, clearing it.");
        await html5QrCodeRef.current.clear().catch(e => console.error("Error clearing existing scanner:", e));
    }

    try {
        const devices = await Html5Qrcode.getCameras();
        if (devices.length === 0) {
            SetALertText("No camera found to scan QR codes.");
            SetALertType('danger');
            SetALert(true);
            console.warn("No camera found.");
            return;
        }
        const backCamera = devices.find(d => d.label.toLowerCase().includes("back")) || devices[0];

        html5QrCodeRef.current = new Html5Qrcode(qrRegionId); // Create new instance here

        const config = {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.333,
            disableFlip: true,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            }
        };

        const cameraConfig = backCamera
            ? { deviceId: { exact: backCamera.id } }
            : { facingMode: "environment" };

        await html5QrCodeRef.current.start(
            cameraConfig,
            config,
            async (decodedText) => {
                SetALertText(`✅ Scanned: ${decodedText}`); // Set alert text first
                SetALertType('success');
                SetALert(true); // Show alert
                setScanResult(decodedText);
                await sendToBackend(decodedText);
                await stopScanner(); // Stop scanner after successful scan and backend call
            },
            (errorMessage) => {
                console.warn("Scan error:", errorMessage);
                if (!scanning) return; // Prevent showing error if scanner was already stopped
                SetALertText(`Scan error: ${errorMessage}`);
                SetALertType('warning');
                SetALert(true);
            }
        );
        setScanning(true); // Only set scanning to true after successful start
        console.log("Scanner started successfully.");
    } catch (error) {
        console.error("❌ Error starting scanner:", error);
        SetALertText(`Failed to start camera: ${error.message}`);
        SetALertType('danger');
        SetALert(true);
        setScanning(false); // Ensure scanning state is false on error
        if (html5QrCodeRef.current) {
              html5QrCodeRef.current.clear().catch(e => console.error("Error clearing on start fail:", e));
              html5QrCodeRef.current = null;
        }
    }
};

// const startScanner = async () => {
//   set_device_info(null);
//   const devices = await Html5Qrcode.getCameras();
//   const backCamera = devices.find(d => d.label.toLowerCase().includes("back")) || devices[0];

//   html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
//   setScanning(true);

//   const config = {
//     fps: 10,
//     qrbox: { width: 300, height: 300 }, // Good size for aligning small QR codes
//     aspectRatio: 1.333,                 // 4:3 camera ratio
//     disableFlip: true,
//     experimentalFeatures: {
//       useBarCodeDetectorIfSupported: true
//     }
//   };

//   const cameraConfig = backCamera
//     ? { deviceId: { exact: backCamera.id } }
//     : { facingMode: "environment" };

//   html5QrCodeRef.current.start(
//     cameraConfig,
//     config,
//     async (decodedText) => {
//       alert(`✅ Scanned: ${decodedText}`);
//       setScanResult(decodedText);
//       await sendToBackend(decodedText);
//       stopScanner();
//     },
//     (errorMessage) => {
//       console.warn("Scan error:", errorMessage);
//     }
//   );
// };

  // const stopScanner = () => {
  //   if (html5QrCodeRef.current) {
  //     html5QrCodeRef.current.stop().then(() => {
  //       html5QrCodeRef.current.clear();
  //       setScanning(false);
  //     });
  //   }
  // };

  const stopScanner = async () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
          try {
              await html5QrCodeRef.current.stop();
              console.log("Scanner stopped.");
          } catch (error) {
              console.error("Error stopping scanner:", error);
              // Even if stop fails, try to clear and reset state
          } finally {
              await html5QrCodeRef.current.clear().catch(e => console.error("Error clearing scanner after stop/error:", e));
              html5QrCodeRef.current = null; // Crucially, nullify the ref after stopping and clearing
              setScanning(false);
          }
      } else if (html5QrCodeRef.current) {
          // If it exists but wasn't scanning (e.g., failed to start properly)
          console.log("Scanner instance found but not scanning, just clearing.");
          await html5QrCodeRef.current.clear().catch(e => console.error("Error clearing non-scanning scanner:", e));
          html5QrCodeRef.current = null;
          setScanning(false);
      } else {
          console.log("No active scanner instance to stop.");
          setScanning(false);
      }
  };


  const sendToBackend = async (data) => {
  try {
    const response = await fetch(`https://bi.meraplion.com/local/get_data/get_d_dm_tai_san/?ma_qlts=${data}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ qrData: data }),
    });
    if (response.ok) {
    const result = await response.json();
    set_device_info(result.data[0]);
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
  

const post_form_data = async (data) => {
      SetLoading(true);

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      for (let i of selectedFile) {
          formData.append('images', i)
      }
      const response = await fetch(`https://bi.meraplion.com/local/omcs_data/?query=chat`, {
          method: "POST",
          body: formData
      });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText(data.error_message);
            setTimeout(() => {
            SetALert(false);
            SetLoading(false);
            setScanning(false);
            }, 2000);
        } else {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText( data.success_message );
            setTimeout(() => {
            SetALert(false);
            SetLoading(false);
            setScanning(false);
            }, 2000);
            clear_data();
            // setCount(count+1);

        }
    }


      const handle_submit = (e) => {
          // e.preventDefault();
          // const current_date = formatDate(Date());
  
          // let iso_time = new Date()
          // iso_time.setHours(iso_time.getHours() + 7)
          // iso_time = iso_time.toISOString()
          // iso_time = iso_time.replace("T", " ")
          // iso_time = iso_time.replace("Z", " ")
          // console.log(iso_time)
  

          let save_to_folder = "d_dm_tai_san"
          const data = {
            "id":get_id(),
            "ma_qlts_con":scanResult,
            "img_0":`https://bi.meraplion.com/DMS/${save_to_folder}/0_${scanResult}.jpeg`,
            "img_1":`https://bi.meraplion.com/DMS/${save_to_folder}/1_${scanResult}.jpeg`,
            "img_2":`https://bi.meraplion.com/DMS/${save_to_folder}/2_${scanResult}.jpeg`,
            "img_3":`https://bi.meraplion.com/DMS/${save_to_folder}/3_${scanResult}.jpeg`,
            "img_4":`https://bi.meraplion.com/DMS/${save_to_folder}/4_${scanResult}.jpeg`,
            "inserted_at": Inserted_at()
          }
          console.log(data);
          post_form_data([data]);
      }

return (
  <Row className="justify-content-center py-4">
    <Col md={4}>

      {/* ALERT COMPONENT */}
      <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
          <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

      {alert &&
      <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
          </button>
          <span><strong>Cảnh Báo:  </strong>{alertText}</span>
      </div>
      }
      </Modal>

      <h2>QR Scanner</h2>

      {!scanning && (
        <button onClick={startScanner} className="btn btn-primary mb-3">
          📷 Start Scan (Back Camera v 1.8)
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
            <Form.Control type="text" value={device_info.ten_ts_qlts || ""} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>📍 Location</Form.Label>
            <Form.Control type="text" value={device_info.phong_vitri || ""} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>👤 Owner</Form.Label>
            <Form.Control type="text" value={device_info.ten_phu_trach || ""} readOnly />
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
    <Button
    onClick={(e) => handle_submit(e)}
    className='mt-2'  variant="primary" type="reset" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN 
    </Button>
    </Col>



  </Row>
);
};

export default Qr_scan_quan_ly_tai_san;
