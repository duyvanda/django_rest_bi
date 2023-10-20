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

function Scn_quan_ly_nvl({history}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    async function  fetch_nvl  () {
        let response = await fetch(`https://bi.meraplion.com/local/get_nvl/`)
        let arr = await response.json()
        let df = new pd.DataFrame(arr.data)
        set_fix_df(df)
        df.head().print()
        console.log(pd.toJSON(df)[0]);
        set_lst_dd1(pd.toJSON(df));
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
    const [fix_df, set_fix_df] = useState(new pd.DataFrame());
    const [dd_search1, set_dd_search1] = useState("");
    const [dd_select1, set_dd_select1] = useState("");
    const [lst_dd1, set_lst_dd1] = useState([]);
    {/*  */}

    const [CREATEMODE, SET_CREATEMODE] = useState(true);
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    
    {/* DATA STATE */}
    const [manvl, set_manvl]= useState("");
    const [ten, set_ten]= useState("");
    const [phanloai, set_phanloai]= useState("");
    const [tieuchuan, set_tieuchuan]= useState("");
    const [nhasanxuat, set_nhasanxuat]= useState("");
    const [hsdretestthang, set_hsdretestthang]= useState("");
    const [donvithuongmai, set_donvithuongmai]= useState("");
    const [mancc, set_mancc]= useState("");
    const [dvtinh, set_dvtinh]= useState("");
    const [quycach, set_quycach]= useState("");
    const [ghichu, set_ghichu]= useState("");
    const [leadtimethang, set_leadtimethang]= useState("");
    const [diadiemgiao, set_diadiemgiao]= useState("");
    const [dvtiente, set_dvtiente]= useState("");
    const [dongia, set_dongia]= useState("");

    function handle_select1 (e) {
        console.log("handle_select1 ", e);
        set_dd_select1(e);
        fetch_id_data(e);

    }

    function fetch_id_data (pk) {
        console.log("pk", pk)
        let dk = fix_df['ten'].eq(pk)
        let df = fix_df.loc({rows: dk})
        df.head().print()
        df = df.shape[0] === 0 ? new pd.DataFrame() : df
        df.fillNa('', {'inplace':true})
        let data_arr = pd.toJSON(df);
        set_manvl(data_arr[0].manvl);
        set_ten(data_arr[0].ten);
        set_phanloai(data_arr[0].phanloai);
        set_tieuchuan(data_arr[0].tieuchuan);
        set_nhasanxuat(data_arr[0].nhasanxuat);
        set_hsdretestthang(data_arr[0].hsdretestthang);
        set_donvithuongmai(data_arr[0].donvithuongmai);
        set_mancc(data_arr[0].mancc);
        set_dvtinh(data_arr[0].dvtinh);
        set_quycach(data_arr[0].quycach);
        set_ghichu(data_arr[0].ghichu);
        set_leadtimethang(data_arr[0].leadtimethang);
        set_diadiemgiao(data_arr[0].diadiemgiao);
        set_dvtiente(data_arr[0].dvtiente);
        set_dongia(data_arr[0].dongia);
        }

    const post_form_data = async (data) => {
        try{
            SetLoading(true)
            let crud = CREATEMODE ? 'create_nvl' : 'update_nvl'
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
            "manvl":manvl.trimEnd().trimStart(),
            "ten":ten.trimEnd().trimStart(),
            "phanloai":phanloai.trimEnd().trimStart(),
            "tieuchuan":tieuchuan.trimEnd().trimStart(),
            "nhasanxuat":nhasanxuat.trimEnd().trimStart(),
            "hsdretestthang":hsdretestthang,
            "donvithuongmai":donvithuongmai.trimEnd().trimStart(),
            "mancc":mancc.trimEnd().trimStart(),
            "dvtinh":dvtinh.trimEnd().trimStart(),
            "quycach":quycach,
            "ghichu":ghichu.trimEnd().trimStart(),
            "leadtimethang":leadtimethang,
            "diadiemgiao":diadiemgiao,
            "dvtiente":dvtiente.trimEnd().trimStart(),
            "dongia":dongia            
        }
        console.log(data);
        post_form_data(data);
        set_manvl("");
        set_ten("");
        set_phanloai("");
        set_tieuchuan("");
        set_nhasanxuat("");
        set_hsdretestthang("");
        set_donvithuongmai("");
        set_mancc("");
        set_dvtinh("");
        set_quycach("");
        set_ghichu("");
        set_leadtimethang("");
        set_diadiemgiao("");
        set_dvtiente("");
        set_dd_select1("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">

                <ButtonGroup style={{width: "83%",fontWeight: "bold"}} size="sm" className="mt-2 border-0">
                    <Button onClick={ () => SET_CREATEMODE(!CREATEMODE) } className="bg-warning text-dark border-0" disabled={CREATEMODE}>CREATE</Button>
                    <Button onClick={ () => SET_CREATEMODE(!CREATEMODE) } disabled={!CREATEMODE}>EDIT</Button>
                </ButtonGroup>

                {/* SEARCH COMPONENT */}

                {!CREATEMODE && 

                <InputGroup className="mt-2 d-flex" style={{height:"60px", width: "83%"}}>
                    <InputGroup.Text className=" w150px bg-secondary text-white text-wrap text-left">SELECT</InputGroup.Text>                       
                    <Dropdown className="d-inline mt-2 w150px" autoClose="true" block="true" onSelect = { handle_select1 }>
                        <Dropdown.Toggle className="bg-white border-0 text-dark text-left flex-grow-1"> 
                        {dd_select1 ==="" ? "Bấm Để Chọn": dd_select1}
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu className="" style={{maxHeight: "410px", overflowY: "auto"}}>
                        <Form.Control type="text" placeholder="Tìm Giá Trị" onChange={ (e) => set_dd_search1(e.target.value) } value = {dd_search1} />
                        
                        <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                            {
                            lst_dd1
                            .filter( el => removeAccents(el.ten).toLowerCase().includes(dd_search1) )
                            .map( (el, index) =>
                                <Dropdown.Item key={index} eventKey={el.ten}> {el.ten} </Dropdown.Item>
                            )
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>

                }


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
                    <FloatingLabel label="TÊN" className="border rounded mt-2" ><Form.Control readOnly={!CREATEMODE} required type="text" placeholder="TÊN" onChange={ (e) => set_ten(e.target.value) } value = {ten}/></FloatingLabel>
                    <FloatingLabel label="PHÂN LOẠI" className="border rounded mt-2" ><Form.Control required type="text" placeholder="PHÂN LOẠI" onChange={ (e) => set_phanloai(e.target.value) } value = {phanloai}/></FloatingLabel>
                    <FloatingLabel label="TIÊU CHUẨN" className="border rounded mt-2" ><Form.Control required type="text" placeholder="TIÊU CHUẨN" onChange={ (e) => set_tieuchuan(e.target.value) } value = {tieuchuan}/></FloatingLabel>
                    <FloatingLabel label="NHÀ SẢN XUẤT" className="border rounded mt-2" ><Form.Control required type="text" placeholder="NHÀ SẢN XUẤT" onChange={ (e) => set_nhasanxuat(e.target.value) } value = {nhasanxuat}/></FloatingLabel>
                    <FloatingLabel label="HSDRETESTTHANG" className="border rounded mt-2" ><Form.Control required type="number" placeholder="TEL_FAX" onChange={ (e) => set_hsdretestthang(e.target.value) } value = {hsdretestthang}/></FloatingLabel>
                    <FloatingLabel label="ĐƠN VỊ THƯƠNG MẠI" className="border rounded mt-2" ><Form.Control required type="text" placeholder="ĐƠN VỊ THƯƠNG MẠI" onChange={ (e) => set_donvithuongmai(e.target.value) } value = {donvithuongmai}/></FloatingLabel>
                    <FloatingLabel label="MÃ NCC" className="border rounded mt-2" ><Form.Control required type="text" placeholder="MÃ NCC" onChange={ (e) => set_mancc(e.target.value) } value = {mancc}/></FloatingLabel>
                    </Form>
                    {/* END FORM BODY */}
                </Col>
                <Col md={5} >
                <FloatingLabel label="ĐV TÍNH" className="border rounded mt-2" ><Form.Control required type="text" placeholder="ĐV TÍNH" onChange={ (e) => set_dvtinh(e.target.value) } value = {dvtinh}/></FloatingLabel>
                <FloatingLabel label="QUY CÁCH" className="border rounded mt-2" ><Form.Control required type="number" placeholder="QUY CÁCH" onChange={ (e) => set_quycach(e.target.value) } value = {quycach}/></FloatingLabel>
                <FloatingLabel label="GHI CHÚ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="GHI CHÚ" onChange={ (e) => set_ghichu(e.target.value) } value = {ghichu}/></FloatingLabel>
                <FloatingLabel label="LEADTIME THÁNG" className="border rounded mt-2" ><Form.Control required type="number" placeholder="LEADTIME THÁNG" onChange={ (e) => set_leadtimethang(e.target.value) } value = {leadtimethang}/></FloatingLabel>
                <FloatingLabel label="ĐỊA ĐIỂM GIAO" className="border rounded mt-2" ><Form.Control required type="text" placeholder="ĐỊA ĐIỂM GIAO" onChange={ (e) => set_diadiemgiao(e.target.value) } value = {diadiemgiao}/></FloatingLabel>
                <FloatingLabel label="ĐV TIỀN TỆ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="ĐV TIỀN TỆ" onChange={ (e) => set_dvtiente(e.target.value) } value = {dvtiente}/></FloatingLabel>
                <FloatingLabel label="ĐƠN GIÁ" className="border rounded mt-2" ><Form.Control required type="number" placeholder="ĐƠN GIÁ" onChange={ (e) => set_dongia(e.target.value) } value = {dongia}/></FloatingLabel>

                </Col>

                <Button disabled={false} onClick={handle_submit} className='mt-2' variant={CREATEMODE ? `warning`: `primary` } type="submit" style={{width: "82%",fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                
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

export default Scn_quan_ly_nvl