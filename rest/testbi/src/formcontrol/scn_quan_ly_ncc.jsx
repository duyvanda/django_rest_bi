/* eslint-disable */
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

function Scn_quan_ly_ncc({history}) {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'scn_quan_ly_ncc', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_ncc();

        } else {
            history.push('/login');
        };
    }, []);

    async function  fetch_ncc  () {
        let response = await fetch(`https://bi.meraplion.com/local/get_ncc/`)
        let arr = await response.json()
        let df = new pd.DataFrame(arr.data)
        set_fix_df(df)
        // df.ctypes.print()
        df.head(1).print()
        console.log(pd.toJSON(df)[0]);
        df = df.groupby(['manvl','ma_ten_nvl']).count()
        set_lst_dd1(pd.toJSON(df));
    }

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
    const [mancc, set_mancc]= useState("");
    const [tenncc, set_tenncc]= useState("");
    const [danhmuc_hanghoa, set_danhmuc_hanghoa]= useState("");
    const [diachi, set_diachi]= useState("");
    const [tel_fax, set_tel_fax]= useState("");
    const [maso_thue, set_maso_thue]= useState("");
    const [cong_no, set_cong_no]= useState("");
    const [nguoi_lienhe, set_nguoi_lienhe]= useState("");
    const [sdt, set_sdt]= useState("");
    const [email, set_email]= useState("");
    const [nam_hopdong, set_nam_hopdong]= useState("");
    const [ma_hopdong, set_ma_hopdong]= useState("");
    const [website, set_website]= useState("");
    const [status, set_status]= useState("");

    function handle_select1 (e) {
        console.log("handle_select1 ", e);
        set_dd_select1(e);
        fetch_id_data(e);

    }

    function fetch_id_data (pk) {
        console.log("pk", pk)
        let dk = fix_df['mancc'].eq(pk)
        let df = fix_df.loc({rows: dk})
        df.head(1).print()
        df = df.shape[0] === 0 ? new pd.DataFrame() : df
        df.fillNa('', {'inplace':true})
        let data_arr = pd.toJSON(df)
        set_mancc(data_arr[0].mancc);
        set_tenncc(data_arr[0].tenncc);
        set_danhmuc_hanghoa(data_arr[0].danhmuc_hanghoa);
        set_diachi(data_arr[0].diachi);
        set_tel_fax(data_arr[0].tel_fax);
        set_maso_thue(data_arr[0].maso_thue);
        set_cong_no(data_arr[0].cong_no);
        set_nguoi_lienhe(data_arr[0].nguoi_lienhe);
        set_sdt(data_arr[0].sdt);
        set_email(data_arr[0].email);
        set_nam_hopdong(data_arr[0].nam_hopdong);
        set_ma_hopdong(data_arr[0].ma_hopdong);
        set_website(data_arr[0].website);
        set_status(data_arr[0].status);
        }

    const post_form_data = async (data) => {
        try{
            SetLoading(true)
            let crud = CREATEMODE ? 'create_ncc' : 'update_ncc'
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
            "mancc":mancc.trimEnd().trimStart(),
            "tenncc":tenncc.trimEnd().trimStart(),
            "danhmuc_hanghoa":danhmuc_hanghoa.trimEnd().trimStart(),
            "diachi":diachi.trimEnd().trimStart(),
            "tel_fax":tel_fax.trimEnd().trimStart(),
            "maso_thue":maso_thue.trimEnd().trimStart(),
            "cong_no":cong_no.trimEnd().trimStart(),
            "nguoi_lienhe":nguoi_lienhe.trimEnd().trimStart(),
            "sdt":sdt.trimEnd().trimStart(),
            "email":email.trimEnd().trimStart(),
            "nam_hopdong":nam_hopdong,
            "ma_hopdong":ma_hopdong.trimEnd().trimStart(),
            "website":website.trimEnd().trimStart(),
            "status":status.trimEnd().trimStart()
        }
        console.log(data);
        post_form_data(data);
        set_mancc("");
        set_tenncc("");
        set_danhmuc_hanghoa("");
        set_diachi("");
        set_tel_fax("");
        set_maso_thue("");
        set_cong_no("");
        set_nguoi_lienhe("");
        set_sdt("");
        set_email("");
        set_nam_hopdong("");
        set_ma_hopdong("");
        set_website("");
        set_status("");
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
                            .filter( el => removeAccents(el.tenncc).toLowerCase().includes(dd_search1) )
                            .map( (el, index) =>
                                <Dropdown.Item key={index} eventKey={el.mancc}> {el.tenncc} </Dropdown.Item>
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
                    <FloatingLabel label="MÃ NCC" className="border rounded mt-2" ><Form.Control readOnly={!CREATEMODE} required type="text" placeholder="MÃ NCC" onChange={ (e) => set_mancc(e.target.value) } value = {mancc}/></FloatingLabel>
                    <FloatingLabel label="TÊN NCC" className="border rounded mt-2" ><Form.Control required type="text" placeholder="TÊN NCC" onChange={ (e) => set_tenncc(e.target.value) } value = {tenncc}/></FloatingLabel>
                    <FloatingLabel label="DANH MỤC HÀNG HÓA" className="border rounded mt-2" ><Form.Control required type="text" placeholder="DANH MỤC HÀNG HÓA" onChange={ (e) => set_danhmuc_hanghoa(e.target.value) } value = {danhmuc_hanghoa}/></FloatingLabel>
                    <FloatingLabel label="ĐỊA CHỈ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="ĐỊA CHỈ" onChange={ (e) => set_diachi(e.target.value) } value = {diachi}/></FloatingLabel>
                    <FloatingLabel label="TEL_FAX" className="border rounded mt-2" ><Form.Control required type="text" placeholder="TEL_FAX" onChange={ (e) => set_tel_fax(e.target.value) } value = {tel_fax}/></FloatingLabel>
                    <FloatingLabel label="MÃ SỐ THUẾ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="MÃ SỐ THUẾ" onChange={ (e) => set_maso_thue(e.target.value) } value = {maso_thue}/></FloatingLabel>
                    <FloatingLabel label="CÔNG NỢ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="CÔNG NỢ" onChange={ (e) => set_cong_no(e.target.value) } value = {cong_no}/></FloatingLabel>
                    </Form>
                    {/* END FORM BODY */}
                </Col>
                <Col md={5} >
                    <FloatingLabel label="NGƯỜI LIÊN HỆ" className="border rounded mt-2" ><Form.Control required type="text" placeholder="NGƯỜI LIÊN HỆ" onChange={ (e) => set_nguoi_lienhe(e.target.value) } value = {nguoi_lienhe}/></FloatingLabel>
                    <FloatingLabel label="SĐT" className="border rounded mt-2" ><Form.Control required type="text" placeholder="SĐT" onChange={ (e) => set_sdt(e.target.value) } value = {sdt}/></FloatingLabel>
                    <FloatingLabel label="EMAIL" className="border rounded mt-2" ><Form.Control required type="text" placeholder="EMAIL" onChange={ (e) => set_email(e.target.value) } value = {email}/></FloatingLabel>
                    <FloatingLabel label="NĂM HỢP ĐỒNG" className="border rounded mt-2" ><Form.Control required type="number" placeholder="NĂM HỢP ĐỒNG" onChange={ (e) => set_nam_hopdong(e.target.value) } value = {nam_hopdong}/></FloatingLabel>
                    <FloatingLabel label="MÃ HỢP ĐỒNG" className="border rounded mt-2" ><Form.Control required type="text" placeholder="MÃ HỢP ĐỒNG" onChange={ (e) => set_ma_hopdong(e.target.value) } value = {ma_hopdong}/></FloatingLabel>
                    <FloatingLabel label="WEBSITE" className="border rounded mt-2" ><Form.Control required type="text" placeholder="WEBSITE" onChange={ (e) => set_website(e.target.value) } value = {website}/></FloatingLabel>
                    <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ e => set_status(e.target.value) }>
                        <option value="">{status === '' ? `Trạng Thái` : status}</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </Form.Select>
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

// export default Scn_quan_ly_ncc