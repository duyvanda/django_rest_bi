/* eslint-disable */
import { useContext, useEffect, useState, useRef } from "react";
import Select from "react-select";
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
    
    const { Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    // const fetch_initial_data = async (manv) => {
    //     SetLoading(true)
    //     const response = await fetch(`https://bi.meraplion.com/local/form_data_log/?manv=${manv}&dropper=0`)
    //     if (!response.ok) {
    //         SetLoading(false)
    //     }
    //     else {
    //     const data = await response.json()
    //     SetLoading(false);
    //     }
    // }
        const f = new Intl.NumberFormat();
        // const utteranceRef = useRef(null); 
        // const [availableVoices, setAvailableVoices] = useState([]); 
        // const [isSpeaking, setIsSpeaking] = useState(false);
        // const [ty_le, set_ty_le] = useState('5:5');

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {        
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Cong_tac_phi', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);

        } else {
            history.push('/login?redirect=/formcontrol/cong_tac_phi');
        };
    }, []);
    const [manv, set_manv] = useState("");


    const [input_data, set_input_data] = useState({
          thang: '',
          tu_ngay: '',
          den_ngay: '',
          tinh: '',
          ve_xe: '',
          ky_hieu_ve_xe: '',
          so_hoa_don_ve_xe: '',
          ngay_hoa_don_ve_xe: '',
          chi_phi_khach_san: '',
          ky_hieu_khach_san: '',
          so_hoa_don_khach_san: '',
          ngay_hoa_don_khach_san: '',
          phu_cap_di_lai: '',
          inserted_at: Inserted_at(),
    });

    const clear_data = () => {
            set_input_data({
                thang: '',
                tu_ngay: '',
                den_ngay: '',
                tinh: '',
                ve_xe: '',
                ky_hieu_ve_xe: '',
                so_hoa_don_ve_xe: '',
                ngay_hoa_don_ve_xe: '',
                chi_phi_khach_san: '',
                ky_hieu_khach_san: '',
                so_hoa_don_khach_san: '',
                ngay_hoa_don_khach_san: '',
                phu_cap_di_lai: '',
                inserted_at: '',
            });
        };

  // Not a recommended way read notes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedRecord = { ...input_data }
    if (name === "phu_cap_di_lai" || name === "chi_phi_khach_san" || name === "ve_xe") {
      updatedRecord[name] = value.replace(/\D/g, '');
    }
    else {
      updatedRecord[name] = value;
    }
    set_input_data(updatedRecord)
  };


    const post_form_data = async (data) => {
        SetLoading(true);
        console.log(input_data);
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_cong_tac_phi/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

    if (!response.ok) {
        SetLoading(false);
        const data = await response.json();
        console.log(data);
        SetALert(true);
        SetALertType("alert-danger");
        SetALertText("CHƯA TẠO ĐƯỢC");
        setTimeout(() => SetALert(false), 3000);
    } else {
        SetLoading(false);
        const data = await response.json();
        console.log(data);
        SetALert(true);
        SetALertType("alert-success");
        SetALertText("ĐÃ TẠO THÀNH CÔNG");
        setTimeout(() => SetALert(false), 3000);
        clear_data();
        // setCount(count+1);
    }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "manv":manv,
            ...input_data
        }
        console.log([data]);
        post_form_data([data])
    }

    // if (data_table.length >= 1) {
    if (true) {
    return (
        <Container className="bg-teal-100 h-100" fluid>
            <ClaimNavTabs />
            <Row className="justify-content-center">
                <Col md={5} >
                    <div>
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm" /> Đang tải...</Button>
                        </Modal>

                        {alert &&
                            <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlert(false)}>
                                </button>
                                <span><strong>Cảnh Báo: </strong>{alertText}</span>
                            </div>
                        }

                        <Form onSubmit={handle_submit}>
                            <div className="text-center">

                                <FloatingLabel label="Tháng" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="thang"
                                        value={input_data?.thang || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Từ ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="tu_ngay"
                                        value={input_data?.tu_ngay || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Đến ngày (dd-mm-yyyy)" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="date"
                                        name="den_ngay"
                                        value={input_data?.den_ngay || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <FloatingLabel label="Tỉnh" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="tinh"
                                        value={input_data?.tinh || ''}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                                <Select
                                    required
                                    className="mt-2"
                                    options={[
                                    { value: 'hcm', label: 'hcm' },
                                    { value: 'bd', label: 'bd' },
                                    { value: 'dn', label: 'dn' }
                                    ]}
                                    value={{ value: input_data.tinh, label: input_data.tinh }}
                                    onChange={(d) => handleInputChange(
                                      {"target": {"name":"tinh","value":d.value}}
                                    )}
                                    placeholder="Chọn tỉnh"
                                    isSearchable
                                    styles={{
                                    placeholder: (base) => ({ ...base, color: "#212529" })
                                    }}
                                />

                                <div className="border border-secondary rounded p-3 mt-3">
                                    <h5 className="mb-3">Thông tin Vé xe</h5>
                                    <FloatingLabel label="Vé xe" className="border rounded mt-2">
                                        <Form.Control
                                            required
                                            className=""
                                            placeholder=""
                                            type="text"
                                            name="ve_xe"
                                            value={ f.format(input_data?.ve_xe || '') }
                                            onChange={handleInputChange}
                                        ></Form.Control>
                                    </FloatingLabel>

                                    <Row className="mt-2">
                                        <Col xs={4}>
                                            <FloatingLabel label="Ký hiệu" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="text"
                                                    name="ky_hieu_ve_xe"
                                                    value={input_data?.ky_hieu_ve_xe || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={4}>
                                            <FloatingLabel label="Số hóa đơn" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="text"
                                                    name="so_hoa_don_ve_xe"
                                                    value={input_data?.so_hoa_don_ve_xe || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={4}>
                                            <FloatingLabel label="Ngày hóa đơn" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="date"
                                                    name="ngay_hoa_don_ve_xe"
                                                    value={input_data?.ngay_hoa_don_ve_xe || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="border border-secondary rounded p-3 mt-3">
                                    <h5 className="mb-3">Thông tin Chi phí khách sạn</h5>
                                    <FloatingLabel label="Chi phí khách sạn" className="border rounded mt-2">
                                        <Form.Control
                                            required
                                            className=""
                                            placeholder=""
                                            type="text"
                                            name="chi_phi_khach_san"
                                            value={ f.format(input_data?.chi_phi_khach_san || '') }
                                            onChange={handleInputChange}
                                        ></Form.Control>
                                    </FloatingLabel>

                                    <Row className="mt-2">
                                        <Col xs={4}>
                                            <FloatingLabel label="Ký hiệu" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="text"
                                                    name="ky_hieu_khach_san"
                                                    value={input_data?.ky_hieu_khach_san || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={4}>
                                            <FloatingLabel label="Số hóa đơn" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="text"
                                                    name="so_hoa_don_khach_san"
                                                    value={input_data?.so_hoa_don_khach_san || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={4}>
                                            <FloatingLabel label="Ngày hóa đơn" className="border rounded">
                                                <Form.Control
                                                    className=""
                                                    placeholder=""
                                                    type="date"
                                                    name="ngay_hoa_don_khach_san"
                                                    value={input_data?.ngay_hoa_don_khach_san || ''}
                                                    onChange={handleInputChange}
                                                ></Form.Control>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>

                                <FloatingLabel label="Phụ cấp đi lại" className="border rounded mt-2">
                                    <Form.Control
                                        required
                                        className=""
                                        placeholder=""
                                        type="text"
                                        name="phu_cap_di_lai"
                                        value={f.format(input_data?.phu_cap_di_lai || '')}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                </FloatingLabel>

                            </div>

                            <Button
                                disabled={loading}
                                className='mt-2'
                                variant="warning"
                                type="submit"
                                style={{ width: "100%", fontWeight: "bold" }}
                            >
                                LƯU THÔNG TIN
                            </Button>
                            <p>version 1.3(18/06/2025)</p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );

    }
    else {}

}

export default Cong_tac_phi


    // useEffect(() => {
    //     const handleSpeakEnd = () => setIsSpeaking(false);
    //     const handleVoicesChanged = () => {
    //         setAvailableVoices(speechSynthesis.getVoices());
    //         const voices = speechSynthesis.getVoices();
    //         voices.forEach(voice => console.log(`  Name: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}`));
    //     };

    //     if (utteranceRef.current) {
    //         utteranceRef.current.onend = handleSpeakEnd;
    //         utteranceRef.current.onerror = (event) => {
    //             console.error('SpeechSynthesisUtterance.onerror', event);
    //             setIsSpeaking(false);
    //         };
    //     }
    //     if (speechSynthesis) {
    //         speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    //         if (speechSynthesis.getVoices().length > 0) {
    //             setAvailableVoices(speechSynthesis.getVoices());
    //         }
    //     }

    //     return () => {
    //         if (utteranceRef.current) {
    //             utteranceRef.current.onend = null;
    //             utteranceRef.current.onerror = null;
    //         }
    //         if (speechSynthesis) {
    //             speechSynthesis.cancel();
    //             speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    //         }
    //     };
    // }, []);


// const convertWebMToWav = async (webmBlob) => {
//     const arrayBuffer = await webmBlob.arrayBuffer();
//     const audioCtx = new AudioContext();
//     const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
//     return encodeWAV(audioBuffer);
//   };
  

//   const encodeWAV = (audioBuffer) => {
//     const numOfChannels = audioBuffer.numberOfChannels;
//     const sampleRate = audioBuffer.sampleRate;
//     const length = audioBuffer.length * numOfChannels * 2 + 44;
//     const buffer = new ArrayBuffer(length);
//     const view = new DataView(buffer);
    
//     writeString(view, 0, "RIFF");
//     view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
//     writeString(view, 8, "WAVE");
//     writeString(view, 12, "fmt ");
//     view.setUint32(16, 16, true);
//     view.setUint16(20, 1, true);
//     view.setUint16(22, numOfChannels, true);
//     view.setUint32(24, sampleRate, true);
//     view.setUint32(28, sampleRate * numOfChannels * 2, true);
//     view.setUint16(32, numOfChannels * 2, true);
//     view.setUint16(34, 16, true);
//     writeString(view, 36, "data");
//     view.setUint32(40, audioBuffer.length * numOfChannels * 2, true);
    
//     const interleaved = interleave(audioBuffer);
//     const data = new DataView(buffer, 44);
//     for (let i = 0, offset = 0; i < interleaved.length; i++, offset += 2) {
//       data.setInt16(offset, interleaved[i] * 0x7FFF, true);
//     }
  
//     return new Blob([buffer], { type: "audio/wav" });
//   };
  
//   const interleave = (audioBuffer) => {
//     const numOfChannels = audioBuffer.numberOfChannels;
//     const length = audioBuffer.length * numOfChannels;
//     const interleaved = new Float32Array(length);
//     for (let channel = 0; channel < numOfChannels; channel++) {
//       const channelData = audioBuffer.getChannelData(channel);
//       for (let i = 0; i < channelData.length; i++) {
//         interleaved[i * numOfChannels + channel] = channelData[i];
//       }
//     }
//     return interleaved;
//   };
  
//   const writeString = (view, offset, string) => {
//     for (let i = 0; i < string.length; i++) {
//       view.setUint8(offset + i, string.charCodeAt(i));
//     }
//   };


    // const [text_3, set_text_3] = useState('');
    // AUDIO
    // const [showModal, setShowModal] = useState(false);
    // const [recording, setRecording] = useState(false);
    // const [audioBlob, setAudioBlob] = useState(null);
    // const [startTime, setStartTime] = useState(null);
    // const [endTime, setEndTime] = useState(null);
    // const [countdown, setCountdown] = useState(30);
    // const mediaRecorderRef = useRef(null);
    // const audioChunksRef = useRef([]);
    // const countdownRef = useRef(null);

    // const post_audio_data = async () => {
    //     SetLoading(true);
    //     const wavBlob = await convertWebMToWav(audioBlob);
    //     const formData = new FormData();
    //     formData.append("audio", wavBlob, "recording.wav");
    //     const response = await fetch(`https://bi.meraplion.com/local/file_upload_cong_tac_phi/`, {
    //         method: "POST",
    //         headers: {},
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         const data = await response.json();
    //         console.log(data);
    //         SetALert(true);
    //         SetALertType("alert-danger");
    //         SetALertText("CHƯA TẠO ĐƯỢC");
    //         setTimeout(() => SetLoading(false), 1000);
    //         setTimeout(() => SetALert(false), 1000);
    //     } else {
    //         const data = await response.json();
    //         set_text_3(data['message']);
    //         set_input_data(data['input_data']);
    //         console.log(data);
    //         SetALert(true);
    //         SetALertType("alert-success");
    //         SetALertText("ĐÃ TẠO THÀNH CÔNG");
    //         setTimeout(() => SetLoading(false), 1000);
    //         setTimeout(() => SetALert(false), 1000);
    //         clear_data();
    //         removeAudio();

    //     }
    // }


    // const synthesizeSpeech = async (text) => {
    //     if (!('speechSynthesis' in window)) {
    //         addMessage('AI', "Your browser does not support speech synthesis.");
    //         return;
    //     }
    //     setIsSpeaking(true);
    //     const utterance = new SpeechSynthesisUtterance(text);
    //     utteranceRef.current = utterance;

    //     utterance.lang = 'vi-VN';

    //     const vietnameseVoices = availableVoices.filter(voice => 
    //         voice.lang === 'vi-VN' || voice.lang === 'vi_VN'
    //     );
    //     let selectedVoice = null;

    //     selectedVoice = vietnameseVoices.find(voice =>
    //         voice.name.toLowerCase().includes('female') ||
    //         voice.name.toLowerCase().includes('girl') ||
    //         voice.name.toLowerCase().includes('nữ')
    //     );

    //     if (!selectedVoice && vietnameseVoices.length > 0) {
    //         selectedVoice = vietnameseVoices[0];
    //     }

    //     if (selectedVoice) {
    //         utterance.voice = selectedVoice;
    //         console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    //     } else {
    //         console.warn('No specific Vietnamese voice found, using default browser voice for Vietnamese.');
    //     }

    //     utterance.onend = () => {
    //         setIsSpeaking(false);
    //     };
    //     utterance.onerror = (event) => {
    //         console.error('SpeechSynthesisUtterance.onerror', event);
    //         setIsSpeaking(false);
    //     };
    //     speechSynthesis.speak(utterance);
    // };

    // const startRecording = async () => {
    //     setAudioBlob(null);
    //     set_text_3("");
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //       mediaRecorderRef.current = new MediaRecorder(stream);
    //       audioChunksRef.current = [];
      
    //       mediaRecorderRef.current.ondataavailable = (event) => {
    //         if (event.data.size > 0) audioChunksRef.current.push(event.data);
    //       };
      
    //       mediaRecorderRef.current.onstop = () => {
    //         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" } );
    //         setAudioBlob(audioBlob);
    //         console.log("Recorded Audio Blob:", audioBlob);
    //       };
      
    //       mediaRecorderRef.current.start();
    //       setRecording(true);
    //       setShowModal(true);
      
    //       const now = new Date();
    //       setStartTime(now);
    //       setEndTime(new Date(now.getTime() + 30000));
      
    //       setCountdown(30);
    //       countdownRef.current = setInterval(() => {
    //         setCountdown((prev) => {
    //           if (prev <= 1) clearInterval(countdownRef.current);
    //           return prev - 1;
    //         });
    //       }, 1000);
      
    //       setTimeout(() => {
    //         if (mediaRecorderRef.current.state === "recording") {
    //           console.log("Time out - Stopping recording");
    //           stopRecording();
    //         }
    //       }, 30000);
    //     } catch (error) {
    //       console.error("Error starting recording:", error);
    //     }
    //   };
      
    //   const stopRecording = () => {
    //     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
    //       mediaRecorderRef.current.stop();
    //       setRecording(false);
    //       clearInterval(countdownRef.current);
    //     }
    //   };
      
    //   const removeAudio = () => {
    //     setAudioBlob(null);
    //     setStartTime(null);
    //     setEndTime(null);
    //     setCountdown(30);
    //   };

{/* Modal for Recording Status */}
{/* <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{recording ? "Đang Ghi Âm..." : "Bản Ghi Âm"}</Modal.Title>
    </Modal.Header>

    <Modal.Body>
        <div className="mt-3">
            <p><strong>Hãy nói:</strong></p>
            <p className="text-primary">
                Thanh toán công tác phí tháng <strong>...</strong> <br />
                Từ ngày <strong>...</strong> <br />
                Đến ngày <strong>...</strong> <br />
                Ở tỉnh <strong>...</strong> <br />
                Vé xe: <strong>...</strong> nghìn, Ký hiệu <strong>...</strong>, số hóa đơn <strong>...</strong>, ngày hóa đơn <strong>...</strong> <br />
                Chi phí khách sạn: <strong>...</strong> nghìn, Ký hiệu <strong>...</strong>, số hóa đơn <strong>...</strong>, ngày hóa đơn <strong>...</strong> <br />
                Phụ cấp đi lại: <strong>...</strong> nghìn <br />
            </p>
            <p>Thời gian còn lại: {countdown}s</p>
        </div>

        {audioBlob && (
            <div className="mt-3">
                <p><strong>File Audio:</strong></p>
                <div className="mb-2">
                    <audio controls className="w-100">
                        <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
                <button onClick={post_audio_data} className="btn btn-success">
                    GỬI FILE GHI ÂM
                </button>
            </div>
        )}
    </Modal.Body>

    <Modal.Footer>
        <button onClick={stopRecording} className="btn btn-warning" disabled={!recording}>
            Dừng Ghi Âm
        </button>
        <button onClick={() => { stopRecording(); setShowModal(false); }} className="btn btn-danger">
            Đóng
        </button>
    </Modal.Footer>
</Modal> */}

// NOTES:
// Issues with the updatedRecord Approach
// The code you provided—let updatedRecord = { ...input_data } followed by set_input_data(updatedRecord)—has two main problems:

// Stale Closures: React state updates are asynchronous and often batched. If a user types quickly, multiple handleInputChange calls might run before set_input_data is finished updating the state. Each of these calls would be working with a "stale" input_data value from the time the function was first called, potentially causing some updates to be lost or overwritten.

// Verbosity and Immutability: While it correctly creates a new object to maintain immutability, it's more verbose than the functional update approach. The original code handles this concisely within the set_input_data call itself, which is the preferred way to handle state updates that depend on the previous state.

// Why the Original Code is Better
// The original code—set_input_data((prevItem) => ({ ...prevItem, [name]: value }))—is better for several reasons:

// Guaranteed Latest State: By using a functional update, you get the latest state value (prevItem) directly from React. This prevents the stale closure problem and ensures your update is always based on the most current data, regardless of how quickly the component re-renders.

// Conciseness: It's a more compact and expressive way to handle a common React pattern. The single line of code clearly communicates that you're updating a portion of the state based on its previous value.

// Immutability: Both approaches correctly create a new object, but the functional update is the standard, safe pattern for doing so within React.

// In summary, while your code might seem to work for simple cases, the original approach is the robust and recommended method for updating state in React, especially for complex forms or frequent updates.

// Original, Concise Code:

// JavaScript

// set_input_data((prevItem) => ({ ...prevItem, [name]: value }));
// Here, the parentheses () around the object {...} tell JavaScript to implicitly return the object. This is a common and efficient pattern in React development.