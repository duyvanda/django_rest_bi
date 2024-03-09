import * as pd from "danfojs";
import { useContext, useEffect, useState } from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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

function Scn_quan_ly_dmnvl({history}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    async function  fetch_nvl  () {
        let response = await fetch(`https://bi.meraplion.com/local/get_dm_nvl/`)
        let arr = await response.json()
        let df = new pd.DataFrame(arr.data)
        set_fix_df(df)
        console.log("fetch_nvl", pd.toJSON(df)[0]);
        set_lst_dd1(pd.toJSON(df.groupby(['manvl','ma_ten_nvl']).count().fillNa('')));
    }
    
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'scn_quan_ly_nvl', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_nvl();

        } else {
            history.push('/login');
        };
    }, []);

    {/* SEARCH STATE */}
    const f = new Intl.NumberFormat()
    const [fix_df, set_fix_df] = useState(new pd.DataFrame());
    const [dd_search1, set_dd_search1] = useState("");
    const [dd_select1, set_dd_select1] = useState("");
    const [lst_dd1, set_lst_dd1] = useState([]);
    {/*  */}

    const [CREATEMODE, SET_CREATEMODE] = useState(true);
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    
    {/* DATA STATE */}
    const [ten_thanhpham, set_ten_thanhpham]= useState("");
    const [soluong_thanhpham, set_soluong_thanhpham]= useState("");
    const [manvl, set_manvl]= useState("");
    const [ten_nvl, set_ten_nvl]= useState("");
    const [hamluong_nvl, set_hamluong_nvl]= useState("");
    const [dvt, set_dvt] = useState("kg");

    function handle_select1 (e) {
        console.log("handle_select1 ", e);
        set_dd_select1(e);
        // fetch_id_data(e);

    }

    function fetch_id_data (pk) {
        console.log("pk", pk)
        let dk = fix_df['ten'].eq(pk)
        let df = fix_df.loc({rows: dk})
        df.head().print()
        df = df.shape[0] === 0 ? new pd.DataFrame() : df
        df.fillNa('', {'inplace':true})
        let data_arr = pd.toJSON(df);
        set_ten_thanhpham(data_arr[0].ten_thanhpham);
        set_soluong_thanhpham(data_arr[0].soluong_thanhpham);
        set_manvl(data_arr[0].manvl);
        set_hamluong_nvl(data_arr[0].hamluong_nvl);
        set_dvt(data_arr[0].dvt);
        }

    const post_form_data = async (data) => {
        try{
            SetLoading(true)
            let crud = CREATEMODE ? 'create_dm_nvl' : 'create_nvl'
            const response = await fetch(`https://bi.meraplion.com/local/${crud}/`, {
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
                SetALertType("alert-success");
                SetALertText("ĐÃ TẠO THÀNH CÔNG");
                setTimeout(() => SetALert(false), 3000);
            }
        }catch (error) {
            SetLoading(false);
            console.log(error);
        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "lupd_user":manv,
            "ten_thanhpham":ten_thanhpham.trimEnd().trimStart(),
            "soluong_thanhpham":soluong_thanhpham,
            "manvl":dd_select1.trimEnd().trimStart(),
            "ten_nvl":'',
            "hamluong_nvl":hamluong_nvl,
        }
        console.log(data);
        post_form_data(data);
        set_ten_thanhpham("");
        set_soluong_thanhpham("");
        set_manvl("");
        set_hamluong_nvl("");
        set_dvt("kg");
        set_dd_select1("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">

                {/* <ButtonGroup style={{width: "83%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                    <Button onClick={ () => SET_CREATEMODE(!CREATEMODE) } className="bg-warning text-dark border-0" disabled={CREATEMODE}>CREATE</Button>
                    <Button onClick={ () => SET_CREATEMODE(!CREATEMODE) } disabled={!CREATEMODE}>EDIT</Button>
                </ButtonGroup> */}

                {/* SEARCH COMPONENT */}

                <Col md={5} >
                    {/* ALERT COMPONENT */}
                    {alert &&
                    <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                        </button>
                        <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                    </div>
                    }

                    <Form>
                    {/* START FORM BODY */}
                    
                    {/* TEXT */}
                    <FloatingLabel label="TÊN THÀNH PHẨM" className="border rounded mt-2" ><Form.Control required type="text" placeholder="TÊN THÀNH PHẨM" onChange={ (e) => set_ten_thanhpham(e.target.value) } value = {ten_thanhpham}/></FloatingLabel>
                    
                    <InputGroup className="mt-2 d-flex" style={{height:"60px", width: "100%"}}>
                    <InputGroup.Text className=" w150px bg-secondary text-white text-wrap text-left">CHỌN THÀNH PHẦN NVL</InputGroup.Text>                       
                    <Dropdown className="d-inline mt-2 w150px" autoClose="true" block="true" onSelect = { handle_select1 }>
                        <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1"> 
                        {dd_select1 ==="" ? "Bấm Để Chọn": dd_select1}
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu className="" style={{maxHeight: "410px", overflowY: "auto"}}>
                        <Form.Control type="text" placeholder="Tìm Giá Trị" onChange={ (e) => set_dd_search1(e.target.value) } value = {dd_search1} />
                        
                        <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                            {
                                lst_dd1
                                .filter( el => removeAccents(el.ma_ten_nvl).toLowerCase().includes(dd_search1) )
                                .map( (el, index) =>
                                    <Dropdown.Item key={index} eventKey={el.manvl}> {el.ma_ten_nvl} </Dropdown.Item>
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    </InputGroup>
                    
                    <FloatingLabel label="SỐ LƯỢNG THÀNH PHẨM" className="border rounded mt-2" ><Form.Control required type="number" placeholder="SỐ LƯỢNG THÀNH PHẨM" onChange={ (e) => set_soluong_thanhpham(e.target.value) } value = { soluong_thanhpham }/></FloatingLabel>
                    <FloatingLabel label="HÀM LƯỢNG NVL" className="border rounded mt-2" ><Form.Control required type="number" placeholder="HÀM LƯỢNG NVL" onChange={ (e) => set_hamluong_nvl(e.target.value) } value = {hamluong_nvl}/></FloatingLabel>
                    <Button disabled={false} onClick={handle_submit} className='mt-2' variant={`primary`} type="submit" style={{width: "100%",fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                    </Form>

                    
                </Col>

                
                {/* END FORM BODY */}
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

export default Scn_quan_ly_dmnvl