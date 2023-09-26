import { useContext, useEffect, useState } from "react";
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
} from "react-bootstrap";

function Template({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'template', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
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

    const URL = EDITMODE ? 'ABC' : 'XYZ'

    const handle_id_enter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            fetch_id_data(e.target.value);
            set_text(e.target.value);
        }
    }

    const fetch_id_data = async (select_id) => {
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
                                    .filter( el => el.id.includes(dd_search1))
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
