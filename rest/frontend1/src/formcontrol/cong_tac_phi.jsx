/* eslint-disable */
import { useContext, useEffect, useState, useRef } from "react";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
// import { Link } from "react-router-dom";
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
    Table,
    // Stack,
    // Dropdown
} from "react-bootstrap";
import ClaimNavTabs from '../components/FormClaimNavTabs'; // adjust the path as needed

// import { Trash } from "react-bootstrap-icons";

function Cong_tac_phi({history}) {
    
    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=${manv}&dropper=0`)
        // const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=MR3055`)
        
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        // set_data_table(data['danhsach']);
        // set_data_table_short(data['data_table_short']);
        // set_so_kien_hang(data['so_kien_hang']);
        // console.log(data);
        SetLoading(false);

        }
    }


    useEffect(() => {
        if (localStorage.getItem("userInfo")) {        
        // navigator.geolocation.getCurrentPosition(position => {
        //     const { latitude, longitude } = position.coords;
        //     setInitialPosition([latitude, longitude]);
        //     console.log("current loc", [latitude, longitude])
        // });
        
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Form_log_checkin_nhan_hang', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);

        } else {
            history.push('/login?redirect=/formcontrol/form_ghi_nhan_hang_log');
        };
    }, []);
    const [manv, set_manv] = useState("");
    // const [selectedFile, setSelectedFile] = useState([]);
    const [text_1, set_text_1] = useState('A1- Ăn uống');
    const [text_2, set_text_2] = useState('Phạm Thị Quỳnh');
    const [text_3, set_text_3] = useState('');

    // AUDIO
    const [showModal, setShowModal] = useState(false);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [countdown, setCountdown] = useState(30); // 30 seconds max
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const countdownRef = useRef(null);

    const [extracted_data, set_extracted_data] = useState({});


    const clear_data = () => {
        // set_text_1("");
        // set_text_2("");
    }

    const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];
      
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunksRef.current.push(event.data);
          };
      
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" } );
            setAudioBlob(audioBlob);
            console.log("Recorded Audio Blob:", audioBlob);
          };
      
          mediaRecorderRef.current.start();
          setRecording(true);
          setShowModal(true);
      
          // Set start and end time
          const now = new Date();
          setStartTime(now);
          setEndTime(new Date(now.getTime() + 30000));
      
          // Countdown timer
          setCountdown(30);
          countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) clearInterval(countdownRef.current);
              return prev - 1;
            });
          }, 1000);
      
          // Stop recording after 30 seconds
          setTimeout(() => {
            if (mediaRecorderRef.current.state === "recording") {
              console.log("Time out - Stopping recording");
              stopRecording();
            }
          }, 30000);
        } catch (error) {
          console.error("Error starting recording:", error);
        }
      };
      
      const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
          setShowModal(false);
          clearInterval(countdownRef.current);
        }
      };
      
      const removeAudio = () => {
        setAudioBlob(null);
        setStartTime(null);
        setEndTime(null);
        setCountdown(30);
      };
      

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedItem((prevItem) => ({
          ...prevItem,
          [name]: value,
        }));
      };

    const post_form_data = async (data) => {
        SetLoading(true);
        const wavBlob = await convertWebMToWav(audioBlob);
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append("audio", wavBlob, "recording.wav");
        const response = await fetch(`https://bi.meraplion.com/local/file_upload_cong_tac_phi/`, {
            method: "POST",
            headers: {
            // "Content-Type": "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
        } else {
            const data = await response.json();
            set_text_3(data['message']);
            set_extracted_data(data['extracted_data']);
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetLoading(false), 1000);
            setTimeout(() => SetALert(false), 1000);
            clear_data();
            removeAudio();

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "manv":manv,
            "uuid":uuid(),
            "text_1":(text_1),
            "text_2":(text_2)
        }
        console.log(data);
        post_form_data(data);
    }

    // if (data_table.length >= 1) {
    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
        {/* Responsive Full-Width Buttons */}
        <ClaimNavTabs />
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>
        

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

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}
                        
                        {/* <h3>FORM GHI NHẬN HÀNG CHI PHÍ PKH</h3> */}

                            <div className="text-center">
                            <Button onClick={startRecording} disabled={recording} variant="primary">
                                Ghi Âm
                            </Button>
                            {/* <Button onClick={removeAudio} variant="secondary">
                                Xóa File
                            </Button> */}

                            {audioBlob && (
                                <div className="mt-3">
                                    <p><strong>File Audio:</strong></p>
                                    <audio controls>
                                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                                    Your browser does not support the audio element.
                                    </audio>
                                </div>
                                )}

                                {/* <Button 
                                onClick={stopRecording} 
                                variant="danger" 
                                disabled={!recording} // Only enable when recording
                                >
                                Dừng Ghi Âm
                                </Button> */}
                                
                                <FloatingLabel label="Tháng" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="thang"
                                value={extracted_data?.thang || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Từ ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="tu_ngay"
                                value={extracted_data?.tu_ngay || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Đến ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="den_ngay"
                                value={extracted_data?.den_ngay || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Tỉnh" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="tinh"
                                value={extracted_data?.tinh || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Vé xe" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="ve_xe"
                                value={extracted_data?.ve_xe || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Chi phí khách sạn" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="chi_phi_khach_san"
                                value={extracted_data?.chi_phi_khach_san || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Phụ cấp đi lại" className="border rounded mt-2">
                                <Form.Control
                                className=""
                                placeholder=""
                                type="text"
                                name="phu_cap_di_lai"
                                value={extracted_data?.phu_cap_di_lai || ''}
                                onChange={handleInputChange}
                                ></Form.Control>
                                </FloatingLabel>

                                {/* <FloatingLabel>Từ ngày (dd-mm-yyyy)</FloatingLabel>
                                <Form.Control
                                type="text"
                                name="tu_ngay"
                                value={extracted_data?.tu_ngay || ''}
                                onChange={handleInputChange}
                                ></Form.Control>


                                <FloatingLabel>Đến ngày (dd-mm-yyyy)</FloatingLabel>
                                <Form.Control
                                type="text"
                                name="den_ngay"
                                value={extracted_data?.den_ngay || ''}
                                onChange={handleInputChange}
                                ></Form.Control>

                                <FloatingLabel>Tỉnh</FloatingLabel>
                                <Form.Control
                                as="text"
                                name="tinh"
                                value={extracted_data?.tinh || ''}
                                onChange={handleInputChange}
                                ></Form.Control>

                                <FloatingLabel>Vé xe</FloatingLabel>
                                <Form.Control
                                as="text"
                                name="ve_xe"
                                value={extracted_data?.ve_xe || ''}
                                onChange={handleInputChange}
                                />
                                </Form.Group> */}

                            {/* Modal for Recording Status */}

                            <Modal show={recording}>
                            <Modal.Header>
                                <Modal.Title>{recording ? "Đang Ghi Âm..." : "Bản Ghi Âm"}</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                            {recording && mediaRecorderRef.current?.state === "recording" && (
                            <div className="mt-3">
                              <p><strong>Hãy nói:</strong></p>
                              <p className="text-primary">
                                Thanh toán công tác phí tháng <strong>...</strong> <br />
                                Từ ngày <strong>...</strong> <br />
                                Đến ngày <strong>...</strong> <br />
                                Ở tỉnh <strong>...</strong> <br />
                                Vé xe: <strong>...</strong> nghìn <br />
                                Chi phí khách sạn: <strong>...</strong> nghìn <br />
                                Phụ cấp đi lại: <strong>...</strong> nghìn <br />
                              </p>
                              <p>Thời gian còn lại: {countdown}s</p>
                            </div>
                          )}


                            </Modal.Body>

                            <Modal.Footer>
                                <button onClick={stopRecording} className="btn btn-warning">
                                    Dừng Ghi Âm
                                </button>
                            </Modal.Footer>
                            </Modal>





                            </div>

                        <FloatingLabel label="Khoản mục" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text_1(e.target.value) } value = {text_1}/> </FloatingLabel>
                        <FloatingLabel label="Người nhận tiền" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text_2(e.target.value) } value = {text_2}/> </FloatingLabel>
                        <p>{text_3}</p>

                        <Button disabled={
                            audioBlob===null
                            } className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        <p>version 1.2(07/03/2025)
                        </p>
                        
                        </Form>
                        {/* END FORM BODY */}

                    </div>
                </Col>
            </Row>
        </Container>
        )
    }
    else {
        // return (
    
        //     <div>
        //         <h1 className="text-danger text-center">Anh / Chị không có mã chứng từ nào để xác nhận</h1>
        //         {/* <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        //         </Spinner> */}
        //     </div>
            
        // )
    }

}

// Function to convert WebM to WAV
const convertWebMToWav = async (webmBlob) => {
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return encodeWAV(audioBuffer);
  };
  
  // Function to encode WAV file
  const encodeWAV = (audioBuffer) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChannels * 2, true);
    view.setUint16(32, numOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);
    
    const interleaved = interleave(audioBuffer);
    const data = new DataView(buffer, 44);
    for (let i = 0, offset = 0; i < interleaved.length; i++, offset += 2) {
      data.setInt16(offset, interleaved[i] * 0x7FFF, true);
    }
  
    return new Blob([buffer], { type: "audio/wav" });
  };
  
  const interleave = (audioBuffer) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numOfChannels;
    const interleaved = new Float32Array(length);
    for (let channel = 0; channel < numOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < channelData.length; i++) {
        interleaved[i * numOfChannels + channel] = channelData[i];
      }
    }
    return interleaved;
  };
  
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

export default Cong_tac_phi