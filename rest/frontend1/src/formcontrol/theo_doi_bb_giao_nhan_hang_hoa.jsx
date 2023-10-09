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
    FloatingLabel
} from "react-bootstrap";

// import ListGroup from 'react-bootstrap/ListGroup';
// import Stack from 'react-bootstrap/Stack';

function Theo_doi_bb_giao_nhan_hang_hoa({history}) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    // const unique_id = uuid();
    // console.log(unique_id);
    
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        const _manv = JSON.parse(localStorage.getItem("userInfo")).manv
        userLogger(_manv, 'Theo_doi_bb_giao_nhan_hang_hoa', isMB, dv_width);
        set_manv(_manv);
        } else {
            history.push('/login');
        };
    }, []);

    
    const [manv, set_manv] = useState("");
    const [lst_order, set_lst_order]  = useState({"SODONDATHANG":""});
    // const [fix_kt_phanhoi, set_fix_kt_phanhoi] = useState("");
    // const [fix_mds_phanhoi, set_fix_mds_phanhoi] = useState("");

    //---------------------------//

    const [search, set_search] = useState("");
    const [kt_da_nhan, set_kt_da_nhan] = useState("");
    const [kt_kh_bb, set_kt_kh_bb] = useState("");
    const [kt_kh_hd, set_kt_kh_hd] = useState("");

    const [phan_hoi_uuid, set_phan_hoi_uuid] = useState("");
    const [kt_phan_hoi, set_kt_phan_hoi] = useState("");
    const [lst_phan_hoi, set_lst_phan_hoi] = useState([]);
    const [kt_ghi_chu, set_kt_ghi_chu] = useState("");
    const [edit_phan_hoi, set_edit_phan_hoi] = useState(false);

    //---------------------------//


    const fetch_kt_cache_data = async (select_order) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/kt_cache_data/?sodondathang=${select_order}`)
        
        if (!response.ok) {
            SetLoading(false)
        }

        else {
        const data_arr = await response.json()
        const data = data_arr[0]
        console.log("fetch_kt_cache_data", data);
        set_lst_order(data);
        //-----------------------------------//
        set_kt_da_nhan(data.KT_DA_NHAN);
        set_kt_kh_bb(data.KH_KI_NHAN_THEO_MAU_BB_GIAO_HANG);
        set_kt_kh_hd(data.KH_KI_NHAN_HANG_TREN_HOA_DON);
        set_lst_phan_hoi(data.KT_PHAN_HOI);
        set_kt_ghi_chu(data.KT_GHI_CHU);
        SetLoading(false)

        }
    }

    const current_date = formatDate(Date());
    const on_click_them_san_pham = (e) => {
        const arr2 = [...lst_phan_hoi];
        const data = {
            "uuid": phan_hoi_uuid ==="" ? uuid() : phan_hoi_uuid,
            "active":true,
            "kt_phan_hoi":kt_phan_hoi,
            "current_date":current_date,
        }
        arr2.push(data);
        console.log("on_click_them_san_pham", arr2)
        set_lst_phan_hoi(arr2);
        set_kt_phan_hoi("");
        set_phan_hoi_uuid("");
        set_edit_phan_hoi(false)
    }


    const on_click_xoa_phan_hoi = (data, idx) => {
        const arr2 = []
        for (const [_, element] of lst_phan_hoi.entries()) {
            if(element.uuid === data.uuid) {
                element.active = false
                arr2.push(element);
            }
            else {
                arr2.push(element);
            }
        }
        console.log("on_click_xoa_phan_hoi", arr2)
        set_lst_phan_hoi(arr2);
    }

    const on_click_edit_phan_hoi = (el, idx) => {
        document.getElementById("IDSP").focus();
        set_phan_hoi_uuid(el.uuid);
        set_kt_phan_hoi(el.kt_phan_hoi);
        set_edit_phan_hoi(!edit_phan_hoi);
        on_click_xoa_phan_hoi(el);

    }

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/kt_theo_doi_bb_giao_nhan_hang_hoa/`, {
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
            SetALertText("TẠO CHƯA THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
        } else {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            //-----------------------------------//
            set_kt_da_nhan("");
            set_kt_kh_bb("");
            set_kt_kh_hd("");
            set_kt_ghi_chu("");
            set_lst_phan_hoi([]);
            set_lst_order({"SODONDATHANG":""});
            //-----------------------------------//  
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        
        const current_date = formatDate(Date())

        const data = {
            "MANV":manv,
            "SODONDATHANG":lst_order.SODONDATHANG,
            "MAKHDMS":lst_order.MAKHDMS,
            "TENKHDMS":lst_order.TENKHDMS,
            "DUNO":lst_order.DUNO,
            "KT_DA_NHAN":kt_da_nhan,
            "KH_KI_NHAN_THEO_MAU_BB_GIAO_HANG":kt_kh_bb,
            "KH_KI_NHAN_HANG_TREN_HOA_DON":kt_kh_hd,
            "KT_GHI_CHU":kt_ghi_chu,
            "KT_PHAN_HOI":lst_phan_hoi
        }

        console.log("handle_submit", data);
        post_form_data(data);


    }

    const handleSearchParam = (e) => {
        set_search(e.target.value);
    }

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value);
            fetch_kt_cache_data(e.target.value);
            set_search(e.target.value);
        }
    }

    if (!loading) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
        <Row className="justify-content-center">
            <Col md={6} >
                <div>
                    <h1>Nhập thông tin thu hồi biên bản</h1>

                    {alert &&
                    <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                        </button>
                        <span><strong>Cảnh Báo  </strong>{alertText}</span>
                    </div>
                    }
                    <Form onSubmit={handle_submit}>
                    <FloatingLabel label="Tìm Hóa Đơn (00090632) Hoặc Đơn Hàng - Hóa Đơn (DL5-0723-00116-00090632)" className="border rounded mt-2 text-muted" > <Form.Control className="" type="text" onKeyDown={handleSearchEnter} value={search} onChange={handleSearchParam} placeholder="" /> </FloatingLabel>
                    
                    <Form.Control className="mt-2" readOnly value = {lst_order.SODONDATHANG}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.MAKHDMS}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.DUNO}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.TENKHDMS}/>

                    <FloatingLabel label="KT ĐÃ NHẬN" className="border rounded mt-2 text-muted" > <Form.Control placeholder="" type="text" onChange={ (e) => set_kt_da_nhan( e.target.value ) } value = {kt_da_nhan} /> </FloatingLabel>
                    <FloatingLabel label="KH KÍ NHẬN THEO MẪU BIÊN BẢN GIAO HÀNG" className="border rounded mt-2 text-muted" > <Form.Control placeholder="" type="text" onChange={ (e) => set_kt_kh_bb(e.target.value) } value = {kt_kh_bb} /> </FloatingLabel>
                    <FloatingLabel label="KH KÍ NHẬN HÀNG TRÊN HÓA ĐƠN" className="border rounded mt-2 text-muted" > <Form.Control placeholder="" type="text" onChange={ (e) => set_kt_kh_hd(e.target.value) } value = {kt_kh_hd} /> </FloatingLabel>
                    <FloatingLabel label="KT GHI CHÚ" className="border rounded mt-2 text-muted" > <Form.Control placeholder="" type="text" onChange={ (e) => set_kt_ghi_chu(e.target.value) } value = {kt_ghi_chu} /> </FloatingLabel>
                    

                    {/* ADD MULTIPLE ITEMS WITH THE SAME ID */}

                    <div className="mt-3 p-1 border border-2 border-success rounded">
                        <FloatingLabel label="KT PHẢN HỒI" id="IDSP" className="border rounded mt-2 text-muted" > <Form.Control type="text" className="" placeholder="PHAI IN PUT" onChange={ (e) => set_kt_phan_hoi( e.target.value ) } value = {kt_phan_hoi} /> </FloatingLabel>
                        <FloatingLabel label="DATE" className="border rounded mt-2" > <Form.Control disabled type="date" className="" placeholder="" value={formatDate(Date())} /> </FloatingLabel>
                        {!edit_phan_hoi ? (
                            <>
                            <Button disabled={kt_phan_hoi===""} size="sm" variant="success" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            + PHẢN HỒI
                            </Button>
                            </>
                        )
                        :(    
                            <Button size="sm" variant="danger" id="button-addon1" className="mb-1 text-left w150px" onClick={ on_click_them_san_pham }>
                            UPDATE
                            </Button>
                        )
                        }

                        {!edit_phan_hoi && (
                        
                            lst_phan_hoi
                            .filter( el => el.active === true)
                            .map( (el, index) =>                                
                                <InputGroup key={index} className="ml-1">
                                    <Button  className="font-weight-bold w75px" variant="outline-danger" onClick={ () => on_click_xoa_phan_hoi(el, index) } > Xóa </Button>
                                    <Button  className="font-weight-bold w75px" variant="outline-success" onClick={ () => on_click_edit_phan_hoi(el, index) } > Edit </Button> 
                                    <Form.Control readOnly type="text" className="" placeholder=""  value = {el.current_date}/>
                                    <Form.Control readOnly type="textarea" className="w-50" placeholder=""  value = {el.kt_phan_hoi}/>
                                </InputGroup>
                            )
                        )
                        }

                        </div >


                    <Button disabled={edit_phan_hoi | lst_order.SODONDATHANG==="" } className='mt-2' variant="warning" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
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

export default Theo_doi_bb_giao_nhan_hang_hoa

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

// {
//     "MANV": "AM0000",
//     "SODONDATHANG": "OO3-0823-00001-02681367",
//     "MAKHDMS": "004718",
//     "TENKHDMS": "CTCP Bán Lẻ An Khang - Liên Chiểu - Đà Nẵng",
//     "DUNO": "0",
//     "KT_DA_NHAN": "XXX",
//     "KH_KI_NHAN_THEO_MAU_BB_GIAO_HANG": "XXXX",
//     "KH_KI_NHAN_HANG_TREN_HOA_DON": "XXXX",
//     "KT_GHI_CHU": "XXXXX",
//     "KT_PHAN_HOI": [
//         {
//             "uuid": "e8cad3b7-40d7-47af-93bd-2daf42a944b6",
//             "current_date": "2023-09-18",
//             "kt_phan_hoi": "Them thong tin",
//             "active": true
//         },
//         {
//             "uuid": "7c7dd21a-8a4c-4bc9-9c6f-be942259c828",
//             "current_date": "2023-09-18",
//             "kt_phan_hoi": "TOI KO CO GI DE PHAN HOI",
//             "active": false
//         }
//     ],
//     "MDS_PHAN_HOI": "",
//     "MDS_GHI_CHU": "",
//     "inserted_at": "2023-09-18T22:16:59"
// }