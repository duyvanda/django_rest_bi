/* eslint-disable */
import { useContext, useEffect, useState,useRef  } from "react";
import { v4 as uuid } from 'uuid';
import './myvnp.css';
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
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
    Pagination
} from "react-bootstrap";

function Template({history}) {
    
    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'template', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login?redirect=/formcontrol/template');
        };
    }, []);

    const [EDITMODE, SET_EDITMODE] = useState(false);
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [id, set_id] = useState("");
    const [text, set_text] = useState("");
    const [number, set_number] = useState("");
    const [onDate, setDate] = useState(current_date);
    const [sp_id, set_sp_id] = useState("");
    const [sp_sl, set_sp_sl] = useState("");
    const [sp_ghi_chu, set_sp_ghi_chu] = useState("");
    const [dd_search1, set_dd_search1] = useState("");
    const [dd_select1, set_dd_select1] = useState("");
    const [lst_dd1, set_lst_dd1] = useState([{"uuid":"4733060b-b70b-4f8c-ab49-267d865cccc3","id":"Eh110","name": 10, checked:true},{"uuid":"d0b3f98f-948b-4037-af7a-3d97a86d8db1","id":"Eh111","name": 20, checked:true}]);
    const [lst_item, set_lst_item] = useState([{"uuid":"4733060b-b70b-4f8c-ab49-267d865cccc3","id":"Eh110","name": 10, "ghi_chu":"note1","active":true, checked:true},{"uuid":"d0b3f98f-948b-4037-af7a-3d97a86d8db1","id":"Eh111","name": 20, "ghi_chu":"note2","active":true, checked:true}]);
    const [item_uuid, set_item_uuid] = useState("");
    const [item_search1, set_item_search1] = useState("");
    const [edit_sp, set_edit_sp] = useState(false);
    const [edit_sp1, set_edit_sp1] = useState(false);
    const [selectedFile, setSelectedFile] = useState();

    // const URL = EDITMODE ? 'ABC' : 'XYZ'
    const [page, set_page] = useState(1);
    const data_table = [
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu, SL:02 (5.000.000 VND)"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"},
        {"id":1,"name":"Nguyen Thuy Kieu HCPXXXXXXXX BV Tan Phu SG", "class":"Ho Thi Hong Gam (MR0673)", "QuaTang":"Chai nuoc tuong ChinSu"}
    ]

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [countdown, setCountdown] = useState(30); // 30 seconds max
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const countdownRef = useRef(null);

    const items = [1,2,3,4,5]

    const handle_id_enter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            fetch_initial_data(e.target.value);
            set_text(e.target.value);
        }
    }

    const fetch_initial_data = async (select_id) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/?id=${select_id}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        set_text(data.id)
        console.log(data)
        SetLoading(false)

        }
    }

    const handeClick = (e) => {
        const lst = [];
        for (const [index, element] of lst_dd1.entries()) {
            if(element.id === e.target.id) {
                element.checked = e.target.checked;
                lst.push(element);
            }
            else {
                lst.push(element);
            }
        }
        set_lst_dd1(lst);
        console.log("lst", lst_dd1);
    }  

    const handleClear = () => {
        const lst = [];
        for (const i of lst_dd1) {
            i.checked = false
            lst.push(i);
            };
            set_lst_dd1(lst)
        }

    const on_click_them_san_pham = (e) => {
        const arr2 = [...lst_item];
        const data = {
            "uuid": item_uuid ==="" ? uuid() : item_uuid,
            "id":sp_id,
            "active":true,
            "name":Number(sp_sl),
            "ghi_chu":sp_ghi_chu
        }
        
        arr2.push(data);
        console.log("on_click_them_san_pham", arr2)
        set_lst_item(arr2);
        set_item_uuid("");
        set_sp_id("");
        set_sp_sl(0);
        set_sp_ghi_chu("");
        set_edit_sp(false)
    }


    const on_click_xoa_san_pham = (data, _) => {
        const arr2 = []
        for (const [_, element] of lst_item.entries()) {
            if(element.sp_id === data.sp_id) {
                element.active = false
                arr2.push(element);
            }
            else {
                arr2.push(element);
            }
        }
        console.log("on_click_xoa_san_pham", arr2)
        set_lst_item(arr2);
    }

    const on_click_edit_san_pham = (el, _) => {
        document.getElementById("IDSP").focus();
        set_item_uuid(el.uuid);
        set_sp_id(el.id);
        set_sp_sl(el.name);
        set_sp_ghi_chu(el.ghi_chu);
        set_edit_sp(!edit_sp)
        on_click_xoa_san_pham(el);

    }

    const hand_upload_files = async () => {

        const formData = new FormData();

        let data = {
            "test":1,
            "status":0
        }

        JSON.stringify(data)

        formData.append('data', JSON.stringify(data));

        for (let i of selectedFile) {
            console.log(i)
            
            formData.append('images', i)
        }

        const response = await fetch(`https://bi.meraplion.com/local/file_upload/`, {
            method: "POST",
            headers: {
            },
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const data = await response.json();
            console.log(data);
        }

    }

    const clear_data = () => {
        // setSelectedFile([]);
        // setSelectedFile_2([]);
        // set_chon_ma_kh("");
    }

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
    
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
    
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          setAudioBlob(audioBlob);
        };
    
        // Set start and end time
        const now = new Date();
        setStartTime(now);
        setEndTime(new Date(now.getTime() + 30000)); // 30 seconds later
    
        mediaRecorderRef.current.start();
        setRecording(true);
    
        // Start countdown timer
        setCountdown(30);
        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
            }
            return prev - 1;
          });
        }, 1000);
    
        // Stop recording after 30 seconds
        setTimeout(() => {
          if (mediaRecorderRef.current.state === "recording") {
            stopRecording();
          }
        }, 30000);
      };
    
      const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
          clearInterval(countdownRef.current);
        }
      };

      const removeAudio = () => {
        setAudioBlob(null);
        setStartTime(null);
        setEndTime(null);
        setCountdown(30);
      };

    //   const uploadAudio = async () => {
    //     if (!audioBlob) return alert("No audio recorded!");
    
    //     const formData = new FormData();
    //     formData.append("audio", audioBlob, "recorded_audio.wav");
    
    //     try {
    //       const response = await fetch("http://127.0.0.1:8000/upload-audio/", {
    //         method: "POST",
    //         body: formData,
    //       });
    
    //       if (response.ok) {
    //         alert("Audio uploaded successfully!");
    //       } else {
    //         alert("Failed to upload audio.");
    //       }
    //     } catch (error) {
    //       console.error("Upload error:", error);
    //       alert("Error uploading audio.");
    //     }
    //   };

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/template/`, {
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
        } else {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-warning");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            clear_data();

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const lst_value_dd1 = []
        for (const i of lst_dd1) {
            if (i.checked === true) {lst_value_dd1.push(i.id)}
        };
        
        console.log("lst_value_dd1", lst_value_dd1);
        const data = {
            "manv":manv,
            "current_date":current_date,
            "text":text,
            "list_item": lst_item,
            "lst_value_dd1": lst_value_dd1
        }
        console.log(data);
        post_form_data(data);
        set_text("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >
                    <Button size="sm" variant="light" onClick={e => SET_EDITMODE(!EDITMODE) } active={!EDITMODE}> CHỈNH SỬA ? </Button>

                    {EDITMODE &&
                    <Form.Control className="mt-2 text-truncate" type="text" onKeyDown={ handle_id_enter } onChange={ (e) => set_id(e.target.value) } value = {id} placeholder="Tìm Số ID" />
                    }

                    <div>
                        <h3>{  EDITMODE ? 'FORM EDIT' : 'FORM CREATE' }</h3>

                        {/* ALERT COMPONENT */}
                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }

                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}
                        
                        {/* ID */}
                        <FloatingLabel label="ID" className="border rounded" > <Form.Control disabled={EDITMODE} required type="text" placeholder="" className="" onChange={ (e) => set_id(e.target.value) } value = {id}/> </FloatingLabel>
                                                
                        {/* TEXT */}
                        <FloatingLabel label="TEXT" className="border rounded mt-2" > <Form.Control required type="text" className="" placeholder="" onChange={ (e) => set_text(e.target.value) } value = {text}/> </FloatingLabel>
                        
                        {/* NUMBER */}
                        <FloatingLabel label="NUMBER" className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_number(e.target.value) } value = {number} /> </FloatingLabel>
                        {/* <InputGroup className="mt-2 "> <InputGroup.Text className="w150px bg-secondary text-white  text-truncate"> NUMBER </InputGroup.Text> <Form.Control required type="number" className="" placeholder="NUMBER" onChange={ (e) => set_number(e.target.value) } value = {number}/> </InputGroup> */}
                        
                        {/* DATE */}
                        <FloatingLabel label="DATE" className="border rounded mt-2" > <Form.Control required type="date" className="" placeholder="" onChange={(e) => setDate(e.target.value)} value={onDate} /> </FloatingLabel>
                        
                        <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => console.log(e.target.value) }>
                            <option value="">Some Invalid Option</option>
                            <option value="cash">cash</option>
                            <option value="online">online</option>
                        </Form.Select>
                        
                        
                        {/* SELECT WITH SEARCH */}
                        <InputGroup className="mt-2 d-flex" style={{height:"60px"}}>
                            <InputGroup.Text className=" w150px bg-secondary text-white text-wrap text-left">SELECT</InputGroup.Text>                       
                            <Dropdown className="d-inline mt-2 w150px" autoClose="true" block="true" onSelect = {e =>set_dd_select1(e)}>
                                <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1"> 
                                {dd_select1 ==="" ? "Bấm Để Chọn": dd_select1}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm Giá Trị" onChange={ (e) => set_dd_search1(e.target.value) } value = {dd_search1} />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    lst_dd1
                                    .filter( el => removeAccents(el.id).toLowerCase().includes(dd_search1) )
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.id}> {el.id} </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </InputGroup>

                        {/* MULTISELECT WITH SEARCH */}
                        <InputGroup className="mt-2 d-flex" style={{height:"60px"}}> 
                        <InputGroup.Text className=" w150px bg-secondary text-white text-wrap text-left ">SELECT MULTI</InputGroup.Text> 
                        <Dropdown className="d-inline mx-2 w150px" autoClose="true" required block="true">
                            <Dropdown.Toggle className="text-dark text-left bg-white flex-grow-1 border-0">
                            Bấm Để Chọn
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}}>
                            <Button variant="warning" size="sm" style={{width:"200px"}} onClick={handleClear}>Clear All</Button>
                            <Form.Control className="mt-2" type="text" onChange={ e => set_dd_search1(e.target.value) } placeholder="Tìm Giá Trị" />
                            {lst_dd1
                                .filter( el => el.id.includes(dd_search1))
                                .slice(0, 100)
                                .map( (el, index) => 
                                <Form.Check key={index} className="text-nowrap" type="switch" checked={el.checked} onChange={handeClick} id={el.id} label={el.id}/>)
                            }
                            </Dropdown.Menu>
                        </Dropdown>
                        </InputGroup>
                        
                        {/* ADD MULTIPLE ITEMS WITH THE SAME ID */}

                        <div className="mt-3 p-1 border border-2 border-success rounded">
                        <FloatingLabel label="MA SP" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="MÃ SP" onChange={ (e) => set_sp_id(e.target.value) } value = {sp_id}/> </FloatingLabel>
                        <FloatingLabel label="SO LUONG" className="border rounded mt-2" > <Form.Control id="IDSP" type="number" className="" placeholder="SỐ LƯỢNG" onChange={ (e) => set_sp_sl(e.target.value) } value = {sp_sl}/> </FloatingLabel>
                        <FloatingLabel label="GHI CHU" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="GHI CHÚ" onChange={ (e) => set_sp_ghi_chu(e.target.value) } value = {sp_ghi_chu}/> </FloatingLabel>
                        
                        {!edit_sp ? (
                            <>
                            <Button size="sm" variant="success" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            + SP
                            </Button>
                            <Form.Control className="w150px" type="text" onChange={ e => set_item_search1(e.target.value) } placeholder="Tìm Giá Trị" />
                            </>
                        )
                        :(    
                            <Button size="sm" variant="danger" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            UPDATE
                            </Button>
                        )
                        }

                        {!edit_sp && (
                        
                            lst_item
                            .filter( el => el.active === true)
                            .filter( el => el.id.includes(item_search1))
                            .map( (el, index) =>                                
                                <InputGroup key={index} className="ml-1">
                                    <Button  className="font-weight-bold w75px" variant="outline-danger" onClick={ () => on_click_xoa_san_pham(el, index) } > Xóa </Button>
                                    <Button  className="font-weight-bold w75px" variant="outline-success" onClick={ () => on_click_edit_san_pham(el, index) } > Edit </Button> 
                                    <Form.Control readOnly type="text" className="" placeholder="ID SP"  value = {el.id}/>
                                    <Form.Control readOnly type="number" className="" placeholder="SL SP"  value = {el.name}/>
                                    <Form.Control readOnly type="text" className="" placeholder="GHI CHU"  value = {el.ghi_chu}/>
                                </InputGroup>
                            )
                        )
                        }

                        </div >
                        
                        <Button disabled={edit_sp | edit_sp1 | dd_select1===""} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        
                        <Table  className="w-auto text-wrap mb-0" striped bordered size="sm" variant="light">
                        <colgroup>
                        <col span="1" style={{width: "1%"}}/>
                        <col span="1" style={{width: "25%"}}/>
                        <col span="1" style={{width: "25%"}}/>
                        <col span="1" style={{width: "25%"}}/>
                        <col span="1" style={{width: "1%"}}/>
                        </colgroup>
                        <thead >
                        <tr>
                        <th>#</th>
                        <th>id</th>
                        <th>name</th>
                        <th>class</th>
                        <th>approve</th>
                        </tr>
                        </thead>
                            <tbody >
                            {data_table
                            .filter( el => el.id === page )
                            .map( (el) =>
                            <tr>
                                <td className="align-middle">{el.id}</td>
                                <td>{el.name}</td>
                                <td>{el.class}</td>
                                <td>{el.QuaTang}</td>
                                <td className="align-middle"><Form.Check className="mb-3" type="switch" onChange={console.log("first")} defaultChecked={true}/> </td>
                            </tr>
                            )
                            }
                        <tr >
                        <td colSpan={5}>
                        <Pagination className="mb-0">
                        {items.map( (el) =>  <Pagination.Item onClick={ (e)=> set_page(Number(e.target.text)) } key={el} active = {el === page}> {el}</Pagination.Item>
                        )
                        }
                        </Pagination>
                        </td>
                        </tr>


                            </tbody>
                        </Table>

                        <label className="form-label" style={{fontWeight: "bold"}}>Upload Hình Ảnh CCCD *</label>
                        <Form.Control required type="file" multiple={true} accept="image/*"  disabled={false} onChange={e => setSelectedFile(e.target.files)}></Form.Control>

                        <Button className="mt-2 mb-2 border-0"  type="button" onClick ={ (e) => hand_upload_files() } style={{width: "100%", backgroundColor:"#00A79D"}}>Upload files</Button>

                        <div className="text-center">
                        <Button onClick={startRecording} disabled={recording} variant="primary">
                            Start Recording
                        </Button>
                        <Button onClick={stopRecording} disabled={!recording} variant="danger" className="mx-2">
                            Stop Recording
                        </Button>
                        <Button 
                        // onClick={uploadAudio} 
                        disabled={!audioBlob} variant="success">
                            Upload Audio
                        </Button>

                    {recording && (
                            <div className="mt-3">
                            <p><strong>Recording...</strong></p>
                            <p>Start Time: {startTime ? startTime.toLocaleTimeString() : "--:--:--"}</p>
                            <p>End Time: {endTime ? endTime.toLocaleTimeString() : "--:--:--"}</p>
                            <p>Time Remaining: {countdown}s</p>
                            </div>
                        )}

                        {audioBlob && (
                            <div className="mt-3">
                            <p><strong>Recorded Audio:</strong></p>
                            <audio controls>
                                <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                                Your browser does not support the audio element.
                            </audio>
                            </div>
                        )}
                        </div>

                        <div className="d-flex justify-content-center mt-2">
                        <Button onClick={removeAudio} variant="secondary">
                        Remove Audio
                        </Button>
                        </div>

                        
                        </Form>
                        {/* END FORM BODY */}

                    </div>
                </Col>
            </Row>
        </Container>
        )
    }
    else {
        return (
    
            <div>
                <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner>
            </div>
            
        )
    }

}

export default Template

// https://www.geeksforgeeks.org/how-to-stretch-flexbox-to-fill-the-entire-container-in-bootstrap/

// const on_click_them_san_pham = (e) => {
// const arr2 = [...lst_item];
// const data = {
// "id":sp_id,
// "name":sp_sl,
// }
// arr2.push(data);
// set_lst_item(arr2);
// }

// const on_click_xoa_san_pham = (idx) => {
// console.log(idx);
// const arr2 = lst_item.filter( (_, index) => index !== idx)
// set_lst_item(arr2);
// }

// const on_click_xoa_san_pham = (idx) => {
//     console.log(idx);
//     const arr2 = lst_item.filter( (_, index) => index !== idx)
//     set_lst_item(arr2);
// }
