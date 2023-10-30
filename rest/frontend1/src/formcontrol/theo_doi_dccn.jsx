import * as pd from "danfojs";
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

function Theo_doi_dccn({history}) {

    const { get_current_dmy, fetchFilerReports, SetRpScreen, userLogger, loading, SetLoading, formatDate, Inserted_at, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    const fetch_fix_data = async () => {
        // SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/kt_fix_data/`)
        const arr = await response.json()
        let df = new pd.DataFrame(arr)
        set_fix_df(df)
        set_id1(df.dccndenthang.unique().values);
        console.log("fetch_fix_data", df.dccndenthang.unique().values)
        // SetLoading(false)
    }

    const fetch_fix_data_ten_kh = async (pk) => {
        set_id2([]);
        set_select_id2("");
        set_sotiendccn("");
        console.log("pk", pk)
        let dk = fix_df['dccndenthang'].eq(pk)
        let df = fix_df.loc({rows: dk})
        df = df.shape[0] === 0 ? new pd.DataFrame() : df.groupby(['makhcu','tenkh','tenkh_clean']).count()
        console.log(df.shape)
        set_id2(pd.toJSON(df));
        // console.log(pd.toJSON(df))
    }
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_dccn', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_fix_data();
        let [year, month, day] = get_current_dmy();
        console.log([year, month, day])
        set_number1(month);
        set_number2(year);
        } else {
            history.push('/login');
        };
    }, []);

    function removeusingSet(arr) {
        let outputArray = Array.from(new Set(arr))
        return outputArray
    }


    const f = new Intl.NumberFormat()
    const [manv, set_manv] = useState("");
    const current_date = formatDate(Date());
    const [fix_df, set_fix_df] = useState(new pd.DataFrame());
    const [id1, set_id1]= useState([]);
    const [id2, set_id2]= useState([]);
    const [select_id1, set_select_id1]= useState("");
    const [select_id2, set_select_id2]= useState("");
    const [search_id2, set_search_id2]= useState("");
    const [text1, set_text1]= useState("");
    const [text2, set_text2]= useState("");
    const [text3, set_text3]= useState("");
    const [text4, set_text4]= useState("");
    const [text5, set_text5]= useState("");
    const [text6, set_text6]= useState("");
    const [text7, set_text7]= useState("");
    const [text8, set_text8]= useState("");
    const [text9, set_text9]= useState("");
    const [text10, set_text10]= useState("");
    const [text11, set_text11]= useState("");
    const [text12, set_text12]= useState("");
    const [number1, set_number1]= useState("");
    const [number2, set_number2]= useState("");
    const [sotiendccn, set_sotiendccn] = useState("");
    const [date1, setDate1] = useState("");

    const fetch_id_data = async (select_id) => {
        // SetLoading(true)
        console.log("fetch_id_data", select_id)

        const response = await fetch(`https://bi.meraplion.com/local/kt_get_dccn_id/?pk=${select_id}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        console.log("fetch_id_data", data)
        setDate1(data.date1);
        set_text1(data.text1);
        set_text2(data.text2);
        set_text3(data.text3);
        set_text4(data.text4);
        set_text5(data.text5);
        set_text6(data.text6);
        set_text7(data.text7);
        set_text8(data.text8);
        set_text9(data.text9);
        set_text10(data.text10);
        set_text11(data.text11);
        set_text12(data.text12);

        let x1 = data.number1 === 0 ? number1 : data.number1
        let x2 = data.number2 === 0 ? number2 : data.number2
        set_number1(x1);
        set_number2(x2);
        set_sotiendccn(data.sotiendccn)
        // console.log(data)
        SetLoading(false)

        }
    }


    const handle_select_id1 = (e) => {
        console.log("handle_select_id1 ",e.target.value);

        set_select_id1(e.target.value);
        fetch_fix_data_ten_kh(e.target.value)

    }

    const handle_select_id2 = (e) => {
        console.log("handle_select_id2", e);
        set_select_id2(e)

        fetch_id_data(e+select_id1);
    }

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/kt_update_dccn_id/`, {
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

        const data = {
            "pk":select_id2+select_id1,
            "lupd_user":manv,
            "text1":text1.trimEnd().trimStart(),
            "text2":text2.trimEnd().trimStart(),
            "text3":text3.trimEnd().trimStart(),
            "text4":text4.trimEnd().trimStart(),
            "text5":text5.trimEnd().trimStart(),
            "text6":text6.trimEnd().trimStart(),
            "text7":text7.trimEnd().trimStart(),
            "text8":text8.trimEnd().trimStart(),
            "text9":text9.trimEnd().trimStart(),
            "text10":text10.trimEnd().trimStart(),
            "text11":text11.trimEnd().trimStart(),
            "text12":text12.trimEnd().trimStart(),
            "number1":number1,
            "number2":number2,
            "date1":date1.split("T")[0],
            "inserted_at": Inserted_at()
        }
        console.log(data);
        post_form_data(data);

        set_text1("");
        set_text2("");
        set_text3("");
        set_text4("");
        set_text5("");
        set_text6("");
        set_text7("");
        set_text8("");
        set_text9("");
        set_text10("");
        set_text11("");
        set_text12("");
        set_number1("");
        set_number2("");
        set_select_id1("");
        set_select_id2("");
        set_search_id2("");
        setDate1("");
    
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Form onSubmit={handle_submit}>
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

                        
                        {/* START FORM BODY */}

                        <InputGroup className="mt-2" style={{height:"60px"}}>
                        <Form.Select required className="" onChange={ handle_select_id1 }>
                            <option value="">ĐCCN ĐẾN THÁNG</option>
                            {id1
                            .map( (el, index) => 
                            <option key={index} value={ el }>{ el }</option>
                            )
                            }
                        </Form.Select>

                        <Dropdown className="" autoClose="true" block="true" onSelect = { handle_select_id2 }>

                                <Dropdown.Toggle disabled={select_id1==="" | id2.length === 0} className="ml-1 bg-white border-0 text-dark text-left flex-grow-1"> 
                                {select_id2 === "" ? "Chọn Mã KH": select_id2}
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="" style={{maxHeight: "410px", overflowY: "auto"}}>
                                <Form.Control type="text" placeholder="Tìm (KHÔNG DẤU)" onChange={ (e) => set_search_id2(e.target.value) } />
                                
                                <Dropdown.Divider style={{height: 1, backgroundColor: 'steelblue'}}></Dropdown.Divider>
                                    {
                                    id2
                                    .filter( el => el.tenkh_clean.includes(search_id2.toLowerCase()))
                                    .slice(0, 200)                     
                                    .map( (el, index) =>
                                        <Dropdown.Item key={index} eventKey={el.makhcu}> {el.makhcu + " - " + el.tenkh} </Dropdown.Item>
                                    )
                                    }
                                </Dropdown.Menu>
                        </Dropdown>
                        </InputGroup>

                        
                        <FloatingLabel label="NGÀY THU HỒI MỚI" className="border rounded mt-2" > <Form.Control type="date" className="" placeholder="xxx" onChange={(e) => setDate1(e.target.value)} value={date1} /> </FloatingLabel>
                        <FloatingLabel label="THÁNG THU HỒI" className="border rounded mt-2" > <Form.Control min="0" max="12" type="number" className="" placeholder="xxx" onChange={ (e) => set_number1(e.target.value) } value = {number1}/> </FloatingLabel>
                        <FloatingLabel label="NĂM THU HỒI" className="border rounded mt-2" > <Form.Control type="number" className="" placeholder="xxx" onChange={ (e) => set_number2(e.target.value) } value = {number2}/> </FloatingLabel>
                        <FloatingLabel label="NGƯỜI THU HỒI" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text1(e.target.value) } value = {text1}/> </FloatingLabel>
                        
                        <FloatingLabel label="TÍNH KPI PBH" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text2(e.target.value) } value = {text2}/> </FloatingLabel>
                        <FloatingLabel label="SỐ BILL" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text3(e.target.value) } value = {text3}/> </FloatingLabel>
                        <FloatingLabel label="PHỤ TRÁCH LIÊN HỆ" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text4(e.target.value) } value = {text4}/> </FloatingLabel>
                        <p className="text-danger fw-bold">SỐ TIỀN ĐCCN: {f.format(sotiendccn)} VND</p>
                        <p className="text-danger fw-bold">NGÀY THU HỒI CŨ (Y-M-D): {date1.replace("T00:00:00","")}</p>
                        
                        {/* END FORM BODY */}

                    </div>
                </Col>
                <Col md={5} >
                        <FloatingLabel label="TUẦN 1" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text5(e.target.value) } value = {text5}/> </FloatingLabel>
                        <FloatingLabel label="TUẦN 2" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text6(e.target.value) } value = {text6}/> </FloatingLabel>
                        <FloatingLabel label="TUẦN 3" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text7(e.target.value) } value = {text7}/> </FloatingLabel>
                        <FloatingLabel label="TUẦN 4" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text8(e.target.value) } value = {text8}/> </FloatingLabel>
                        <FloatingLabel label="Thư nhắc nợ" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text9(e.target.value) } value = {text9}/> </FloatingLabel>
                        <FloatingLabel label="Cảnh báo nợ" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text10(e.target.value) } value = {text10}/> </FloatingLabel>
                        <FloatingLabel label="Khởi kiện" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text11(e.target.value) } value = {text11}/> </FloatingLabel>
                        <FloatingLabel label="Ghi chú" className="border rounded mt-2" > <Form.Control type="text" className="" placeholder="xxx" onChange={ (e) => set_text12(e.target.value) } value = {text12}/> </FloatingLabel>
                        <Button disabled={select_id2 === ''} className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                </Col>
                
            </Row>
            </Form>
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

export default Theo_doi_dccn

// set_fix_arr(arr)

// var _dccn_den_thang = arr.map(function(item) {
//     return item['dccn_den_thang'];
// });

// const dccn_den_thang = removeusingSet(_dccn_den_thang)

// var _newArray = fix_arr.filter(function (el) {
//     return el.dccn_den_thang === e.target.value
// });

// console.log(_newArray);

// set_id2(_newArray);

