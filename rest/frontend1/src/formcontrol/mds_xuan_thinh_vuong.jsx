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
    Card
} from "react-bootstrap";

function MdsXuanThinhVuong({history}) {

    const { Inserted_at, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'mds_xuan_thinh_vuong', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, []);

    const style_1 = {'fontWeight':"bold", "color":"red"}
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());

     //---------------------------//
    const [search, set_search] = useState("");
    const [eh115, set_eh115]= useState("");
    const [t302101008, set_t302101008]= useState("");
    const [t302101007, set_t302101007]= useState("");
    const [oh031, set_oh031]= useState("");
    const [t302201014, set_t302201014]= useState("");
    const [money300, set_money300]= useState("");
    const [gold5, set_gold5]= useState("");
    const [gold1, set_gold1]= useState("");
    const [gold0_5, set_gold0_5]= useState("");

    const [arr_statuscollect, set_arr_statuscollect] = useState(['Đã Thu Hồi','Chưa Thu Hồi']);
    const [statuscollect, set_statuscollect]= useState("");
    const [arr_failcollect, set_arr_failcollect] = useState([
    'Khách hàng hẹn cào sau',
    'Không có chủ tại quầy',
    'Khách cào trước 1 phần',
    'Không mang đủ hàng trả thưởng',
    'Khách hàng trúng giải thưởng khác (Vàng)',
    'Lý do khác (MDS phải ghi chú lại)'
    ]);
    const [failcollect, set_failcollect]= useState("");
    const [note, set_note]= useState("");
    const [disable_btn, set_disable_btn]= useState(false);
    const [text, set_text] = useState("");
    const [number, set_number] = useState("");
    const [onDate, setDate] = useState(current_date);
    const [lst_order, set_lst_order]  = useState( {"invcnbr":"", "mds_id":""} );
    
    // function handleSearchParam (e) {
    //     console.log(e.target.value)
    // }

    const fetch_id_data = async (invcnbr, mds_id) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/data_hoa_don_xuan_thinh_vuong/?invcnbr=${invcnbr}&mds_id=${mds_id}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        set_lst_order(data)
        console.log(data)
        set_eh115(data.eh115);
        set_t302101007(data.t302101007);
        set_oh031(data.oh031);
        set_t302201014(data.t302201014);
        set_money300(data.money300);
        set_gold5(data.gold5);
        set_gold1(data.gold1);
        set_gold0_5(data.gold0_5);
        set_statuscollect(data.statuscollect);
        set_failcollect(data.failcollect);
        // set_failcollect("");
        set_note(data.note);
        SetLoading(false)

        }
    }

    const post_form_data = async (data) => {
        set_disable_btn(true);
        const response = await fetch(`https://bi.meraplion.com/local/insert_data_hoa_don_xuan_thinh_vuong/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            set_disable_btn(false);;
            document.getElementById("ID_BTN").focus();
            const data = await response.json();
            console.log(data);

        } else {
            set_disable_btn(false);
            const data = await response.json();
            console.log(data);
            set_lst_order({"invcnbr":"", "mds_id":""})
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 2000);

        }
    }

    const handle_select_failcollect = (e) => {
        console.log("click:",e.target.value);
        set_failcollect(e.target.value);
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "invoicenbr":lst_order.invcnbr.trimEnd().trimStart(),
            "ordernbr":lst_order.ordernbr.trimEnd().trimStart(),
            "orderdate":lst_order.orderdate.trimEnd().trimStart(),
            "order_date_string":lst_order.order_date_string.trimEnd().trimStart(),
            "custid":lst_order.custid.trimEnd().trimStart(),
            "custname":lst_order.custname.trimEnd().trimStart(),
            "invoicecustid":lst_order.invoicecustid.trimEnd().trimStart(),
            "custnameinvoice":lst_order.custnameinvoice.trimEnd().trimStart(),
            "mds_id":lst_order.mds_id.trimEnd().trimStart(),
            "crs_id":lst_order.crs_id.trimEnd().trimStart(),
            "qty":lst_order.qty.toString().trimEnd().trimStart(),
            "eh115":eh115.trimEnd().trimStart(),
            // "t302101008":t302101008.trimEnd().trimStart(),
            "t302101007":t302101007.trimEnd().trimStart(),
            "oh031":oh031.trimEnd().trimStart(),
            "t302201014":t302201014.trimEnd().trimStart(),
            "money300":money300.trimEnd().trimStart(),
            "gold5":gold5.trimEnd().trimStart(),
            "gold1":gold1.trimEnd().trimStart(),
            "gold0_5":gold0_5.trimEnd().trimStart(),
            "statuscollect":statuscollect.trimEnd().trimStart(),
            "failcollect":failcollect.trimEnd().trimStart(),
            "note":note.trimEnd().trimStart(),
            "crtd_user":manv,
            "crtd_datetime":Inserted_at(),
            "uuid":uuid()

        }
        console.log(data);
        post_form_data(data);
        // set_text("");
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Row className="justify-content-center">
                <Col md={5} >
                <h1>NHẬP HÀNG KM XUÂN THỊNH VƯỢNG</h1>

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

                        <Stack direction="horizontal">
                        <FloatingLabel label="Tìm Hóa Đơn (00090632)" className="border rounded mt-2 text-muted w-100" > <Form.Control className="" type="text" value={search} onChange={ (e) => set_search(e.target.value) } placeholder="" /> </FloatingLabel>
                        <Button style={{height:"58px"}} className="ms-auto mt-2" onClick={ (e) => fetch_id_data(search, manv) }>TÌM HÓA ĐƠN</Button>
                        </Stack>

                        { lst_order.invcnbr !== "" &&
                        <>
                            <Card className="mt-2">
                                <Card.Body>
                                <Card.Title>ĐƠN HÀNG: {lst_order.ordernbr}, HÓA ĐƠN: {lst_order.invcnbr}, NGÀY: {lst_order.order_date_string}</Card.Title>
                                    <Card.Text>
                                    MÃ KH NỘI BỘ: {lst_order.custid}
                                    <br></br>
                                    TÊN KHÁCH HÀNG NỘI BỘ: {lst_order.custname}
                                    <br></br>
                                    MÃ KH THUẾ: {lst_order.invoicecustid}
                                    <br></br>
                                    TÊN KHÁCH HÀNG THUẾ: {lst_order.custnameinvoice}
                                    <br></br>
                                    SỐ THẺ CÀO: {lst_order.qty}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            

                            
                            {/* <FloatingLabel label="LÁ ĐÔI 200ML XANH" className="border rounded mt-2" ><Form.Control required={false} type="number" placeholder="LÁ ĐÔI 200ML XANH" onChange={ (e) => set_t302101008(e.target.value) } value = {t302101008}/></FloatingLabel> */}
                            <FloatingLabel label="EBYSTA" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="EBYSTA" onChange={ (e) => set_eh115(e.target.value) } value = {eh115}/></FloatingLabel>
                            <FloatingLabel label="LÁ ĐÔI 200ML HỒNG" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="LÁ ĐÔI 200ML HỒNG" onChange={ (e) => set_t302101007(e.target.value) } value = {t302101007}/></FloatingLabel>
                            <FloatingLabel label="OSLA 15ML" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="OSLA 15ML" onChange={ (e) => set_oh031(e.target.value) } value = {oh031}/></FloatingLabel>
                            <FloatingLabel label="XISAT XANH 75ML" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="XISAT XANH 75ML" onChange={ (e) => set_t302201014(e.target.value) } value = {t302201014}/></FloatingLabel>
                            <FloatingLabel label="PHIẾU TIỀN MẶT 300K" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="PHIẾU TIỀN MẶT 300K" onChange={ (e) => set_money300(e.target.value) } value = {money300}/></FloatingLabel>
                            <FloatingLabel label="VÀNG 9999 - 5 CHỈ" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="VÀNG 9999 - 5 CHỈ" onChange={ (e) => set_gold5(e.target.value) } value = {gold5}/></FloatingLabel>
                            <FloatingLabel label="VÀNG 9999 - 1 CHỈ" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="VÀNG 9999 - 1 CHỈ" onChange={ (e) => set_gold1(e.target.value) } value = {gold1}/></FloatingLabel>
                            <FloatingLabel label="VÀNG 9999 - 0,5 CHỈ" className="border rounded mt-2" ><Form.Control style={style_1} required={false} type="number" min="0" placeholder="VÀNG 9999 - 0,5 CHỈ" onChange={ (e) => set_gold0_5(e.target.value) } value = {gold0_5}/></FloatingLabel>
                            
                            <Form.Select required className="mt-2" style={{height:"60px"}}  onChange={ (e) => set_statuscollect(e.target.value)  }>                                 
                            <option> { statuscollect ? statuscollect : `CHỌN TRẠNG THÁI THU HỒI` } </option>
                            {arr_statuscollect
                            .map((el, index)=>
                                <option key={index} value={el}>{el}</option>
                            )
                            }
                            </Form.Select>

                            {/* SELECT 2 */}
                            <Form.Select className="mt-2" style={{height:"60px"}}  onChange={ (e) => handle_select_failcollect(e) }>       
                            <option> { failcollect ? failcollect : `CHỌN LÝ DO CHƯA THỂ THU HỒI` } </option>
                            {failcollect && <option value=""> { `BỎ CHỌN` } </option>}
                            {arr_failcollect
                            .map((el, index)=>
                                <option key={index} value={el}>{el}</option>
                            )
                            }
                            </Form.Select>

                            <FloatingLabel label="GHI CHÚ" className="border rounded mt-2" ><Form.Control required={false} type="text" placeholder="GHI CHÚ" onChange={ (e) => set_note(e.target.value) } value = {note}/></FloatingLabel>
                            <h3 style={{color:"red"}} className="mt-2">Bạn Đã Chọn:{`\xa0`}  
                            { Number(eh115)+Number(t302101008)+Number(t302101007)+Number(oh031)+Number(t302201014)+Number(money300)+Number(gold5)+Number(gold1)+Number(gold0_5) } / {lst_order.qty}
                            </h3>
                        </>
                        }
                        
                        <Button id="ID_BTN" disabled={
                            lst_order.invcnbr === "" |
                            lst_order.qty === 0 |
                            statuscollect === "" |
                            Number(eh115)+Number(t302101008)+Number(t302101007)+Number(oh031)+Number(t302201014)+Number(money300)+Number(gold5)+Number(gold1)+Number(gold0_5) < 0 |
                            (Number(eh115)+Number(t302101008)+Number(t302101007)+Number(oh031)+Number(t302201014)+Number(money300)+Number(gold5)+Number(gold1)+Number(gold0_5) === 0 && failcollect === "" ) |
                            Number(eh115)+Number(t302101008)+Number(t302101007)+Number(oh031)+Number(t302201014)+Number(money300)+Number(gold5)+Number(gold1)+Number(gold0_5) > lst_order.qty |
                            (Number(eh115)+Number(t302101008)+Number(t302101007)+Number(oh031)+Number(t302201014)+Number(money300)+Number(gold5)+Number(gold1)+Number(gold0_5) < lst_order.qty && failcollect === "" ) |
                            disable_btn
                            }
                            className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        </Form>
                        {/* END FORM BODY */}

                        {/* CARDS IF NEEDED */}


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

export default MdsXuanThinhVuong