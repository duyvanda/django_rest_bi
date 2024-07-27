/* eslint-disable */
import { useContext, useEffect, useState } from "react";
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
    InputGroup
} from "react-bootstrap";

// import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

function Sup_location_ngoai_mcp(history) {

    const { userLogger, loading, SetLoading } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Sup_location_ngoai_mcp', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_sup_location_ngoai_mcp(JSON.parse(localStorage.getItem("userInfo")).manv)
        } else {
            history.push('/login');
        };
    }, []);

    
    const [manv, set_manv] = useState("");
    const [lst_location, set_lst_location]  = useState([]);
    const [lst_statedescr, set_lst_statedescr]  = useState([]);
    const [select_statedescr, set_select_statedescr] = useState("");
    const [search, set_search] = useState("");
    const [kt_phanhoi, set_kt_phanhoi] = useState("");

    const fetch_sup_location_ngoai_mcp = async (manv) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/sup_location_ngoai_mcp/?supid=${manv}`)
        const data = await response.json()
        set_lst_location(data)        
        var vals=[];
        for(var item of data){
            vals.push(item.statedescr); 
        }
        const arr1 = [...new Set(vals)];
        set_lst_statedescr(arr1)
        SetLoading(false)
    }

    // cái v

    const handle_select_state = (e) => {
        set_select_statedescr(e.target.value)
    }


    const handle_submit = (e) => {
        e.preventDefault()
        console.log("first")
    }

    const handleSearchParam = (e) => {
        set_search(e.target.value);
    }

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            // fetch_kt_cache_data(e.target.value);
            // set_search(e.target.value);
        }
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
        <Row className="justify-content-center">
            <Col md={6} >
                <div>
                    <h1>Nhập thông cập nhật ngoài MCP</h1>
                    <Form onSubmit={handle_submit}>
                    
                    <Form.Select disabled={false} className="mt-2" required style={{fontStyle: "bold"}} onChange={ (e) => set_select_statedescr(e.target.value) } value={select_statedescr} size='sm'>
                        <option>Vui Lòng Chọn Tỉnh</option>
                        {lst_statedescr
                        .map(el =><option key={el} value={el}> {el} </option>
                        )}
                    </Form.Select>

                    <Form.Select disabled={false} className="mt-2" required style={{fontStyle: "bold"}} onChange={ handle_select_state } value={select_statedescr} size='sm'>
                        <option>Vui Lòng Chọn Tỉnh</option>
                        {lst_statedescr
                        .map(el =><option key={el} value={el}> {el} </option>
                        )}
                    </Form.Select>

                    <Form.Select disabled={false} className="mt-2" required style={{fontStyle: "bold"}} onChange={ (e) => set_select_statedescr(e.target.value) } value={select_statedescr} size='sm'>
                        <option>Vui Lòng Chọn Tỉnh</option>
                        {lst_statedescr
                        .map(el =><option key={el} value={el}> {el} </option>
                        )}
                    </Form.Select>
                    
                    <Button className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                    
                    </Form>

                    {loading &&
                    <div>
                        <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                        <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                        </Spinner>
                    </div>
                    }

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

export default Sup_location_ngoai_mcp

{/* <Dropdown required disabled={false} block="true" onSelect = {e =>set_select_order(e)}>

<Dropdown.Toggle className="text-dark border-0 bg-warning" style={{width: "100%"}} block="true">{select_order ==="" ? "Bấm Để Chọn": select_order}</Dropdown.Toggle>
<Dropdown.Menu style={{width: "100%"}}>
<Form.Control className='border-0' type="text" style={{}} onChange={ (e) => set_search(e.target.value) } placeholder="Tìm Mã" />
<Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
    {lst_order
    .filter( el => el.SODONDATHANG.includes(search))
    .slice(0, 20)
    .map(el =>
    <Dropdown.Item key={el.SODONDATHANG} eventKey={el.SODONDATHANG}> {el.SODONDATHANG} </Dropdown.Item>
    )}
</Dropdown.Menu>
</Dropdown> */}