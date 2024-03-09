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
    Card,
    ListGroup
} from "react-bootstrap";

function Chuong_trinh_dau_tu_hcp_test({history}) {

    const { Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, []);

    const f = new Intl.NumberFormat()
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [arr_program, set_arr_program] = useState([
        {"id":'Quà Giáng Sinh', "type":1, "choice":"GS1-2.000.000vnd,GS2-2.000.000vnd,GS3-2.000.000vnd"},    
        {"id":'Gimmick Giao Tiếp', "type":1, "choice":"GM1,GM2,GM3"},
        {"id":'Chi Phí Giao Tiếp', "type":0}
    ]);
    const [program, set_program]= useState("");
    const [choices, set_choices] = useState(['GS1-2.000.000vnd','GS2-2.000.000vnd','GS3-2.000.000vnd']);
    const [arr_hcp, set_arr_hcp] = useState([
        {"contract_code":"HCP00021277-H", "contract_name":"Phạm Thị Tú Linh (1.333.333 / 2.000.000)", "public_name":"BV TÂN PHÚ - SG", "id":"1", "check":false},
        {"contract_code":"HCP00021276-H", "contract_name":"NGUYỄN THÚY KIỀU", "public_name":"BV TÂN PHÚ - SG", "id":"2", "check":false},
        {"contract_code":"HCP00021383-H", "contract_name":"NGUYỄN VĂN THÌNH", "public_name":"BV TÂN PHÚ - SG", "id":"3", "check":false},
        {"contract_code":"HCP00021434-H", "contract_name":"NGUYỄN QUỐC LÂM", "public_name":"BV TÂN PHÚ - SG", "id":"4", "check":false},
        {"contract_code":"HCP00021440-H", "contract_name":"TRẦN THỊ DIỄM", "public_name":"BV TÂN PHÚ - SG", "id":"5", "check":false},
        {"contract_code":"HCP00021441-H", "contract_name":"TRẦN THỊ DIỄM", "public_name":"BV TÂN PHÚ - SG", "id":"6", "check":false}
    ]);
    const [hcp, set_hcp]= useState("");
    const [search, set_search] = useState('');

    const [text, set_text] = useState("");
    const [soluong, set_soluong] = useState("");
    const [disable_btn, set_disable_btn]= useState(false);
    const [onDate, setDate] = useState(current_date);

    function handle_set_program (e) {
        const arr_value = e.target.value.split('@@')
        set_program(arr_value[0]);
        set_choices(arr_value[1].split(','));
        console.log(e.target.value)
    }
    

    const handeClick = (e) => {
        let lst = [];
        for (const [index, element] of arr_hcp.entries()) {
        if(element.contract_code === e.target.id) {
            element.check = e.target.checked
            lst.push(element);
        }
        else {
            lst.push(element);
        }
        }
        set_arr_hcp(lst)
    }

    const handleClearNV = () => {
        let lst = [];
        for (const i of arr_hcp) {
            i.check = false
            lst.push(i);
            };
        set_arr_hcp(lst);
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

    const post_form_data = async (data) => {
        set_disable_btn(true);
        const response = await fetch(`https://bi.meraplion.com/local/template/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            set_disable_btn(false);
            const data = await response.json();
            console.log(data);
        } else {
            set_disable_btn(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 2000);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        // const current_date = formatDate(Date());
        const arr = []
        for (let i of arr_hcp) {
            if (i.check === true) {arr.push(i.id)}
        }

        const data = {
            "crtd_datetime":Inserted_at(),
            "crtd_user":manv,
            "uuid": uuid(),
            "program":program,
            "soluong":soluong,
            "arr_hcp":arr
        }
        console.log(data);
        post_form_data(data);
        set_soluong("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>
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
                        <Form.Group className="mt-2 border border-secondary rounded">
                        <Form.Label className="mb-0 fw-bold ml-2">TÊN CHƯƠNG TRÌNH ĐẦU TƯ</Form.Label>
                        <Form.Select className=""  onChange={ (e) => handle_set_program(e) }>  
                        {/* style={{height:"60px"}}*/}
                            {arr_program
                            .map((el, index)=>
                                <option key={index} value={el.id + '@@'+ el.choice}>{el.id}</option>
                            )
                            }
                        </Form.Select>
                        </Form.Group>

                        <ListGroup className="mt-2" style={{maxHeight: "440px", overflowY: "auto"}}>
                        <div>
                            <Button className="w-100" variant="secondary" size="sm" onClick={handleClearNV}>Clear All</Button>
                        </div>
                        <Form.Control className="" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên" />
                        {arr_hcp
                            .map( (el, index) =>
                            <ListGroup.Item style={{maxHeight:"75px"}} className="border border-secondary mx-0 px-0" >
                                <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.contract_code} label={el.contract_name}/>
                            <p className="ml-4"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.contract_code + ' - ' + el.public_name}</p>
                            </ListGroup.Item>
                            )
                        }
                        </ListGroup>

                        {/* <Dropdown>
                            <Dropdown.Toggle style={{height:"60px"}} id="dropdown-basic" className="mt-2 text-dark bg-light border-secondary rounded">
                            Chọn HCP
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}} >
                            <div align="center">
                            <Button variant="warning" size="sm" style={{width:"200px"}} onClick={handleClearNV}>Clear All</Button>
                            </div>
                            <Form.Control className="mt-2" type="text" onChange={ (e) => set_search(e.target.value)} placeholder="Tìm Mã Hoặc Tên" />
                                {arr_hcp
                                // .filter( el => el.contract_name.includes(search))
                                // .slice(0, 100)
                                .map( (el, index) =>
                                <>
                                    <Form.Check key={index} className="text-nowrap" type="switch" checked={el.check} onChange={ handeClick } id={el.contract_code} label={el.contract_name}/>
                                <p className="ml-4"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{el.contract_code + ' - ' + el.public_name}</p>
                                </>
                                )
                                }
                            </Dropdown.Menu>
                        </Dropdown> */}

                        { program !== 'Chi Phí Giao Tiếp' &&

                        <Form.Select style={{height:"60px"}} className="mt-2"  onChange={ (e) => console.log(e.target.value) }>  
                            {choices
                            .map( (el, index) =>
                                <option key={index} value={el}>{el}</option>
                            )
                            }
                        </Form.Select>

                        }

                        
                        {/* soluong */}
                        <FloatingLabel label={ program !== 'Chi Phí Giao Tiếp' ? 'Số Lượng' : 'Nhập Giá Trị'} className="border rounded mt-2" > <Form.Control required type="number" className="" placeholder="" onChange={ (e) => set_soluong(e.target.value) } value = {soluong} /> </FloatingLabel>
                        <p className="fw-bold">{'  Giá trị đã nhập: '+f.format(soluong) +'' }</p>
                        
                        <Button disabled={ soluong === "" | disable_btn } className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
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

export default Chuong_trinh_dau_tu_hcp_test