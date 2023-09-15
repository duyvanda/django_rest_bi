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

function Theo_doi_bb_giao_nhan_hang_hoa(history) {

    const { userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)

    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'Theo_doi_bb_giao_nhan_hang_hoa', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        } else {
            history.push('/login');
        };
    }, []);

    
    const [manv, set_manv] = useState("");
    const [lst_order, set_lst_order]  = useState({});
    const [fix_kt_phanhoi, set_fix_kt_phanhoi] = useState("");
    const [fix_mds_phanhoi, set_fix_mds_phanhoi] = useState("");

    //---------------------------//

    const [search, set_search] = useState("");
    const [kt_da_nhan, set_kt_da_nhan] = useState("");
    const [kt_kh_bb, set_kt_kh_bb] = useState("");
    const [kt_kh_hd, set_kt_kh_hd] = useState("");
    const [kt_phan_hoi, set_kt_phan_hoi] = useState("");
    const [kt_ghi_chu, set_kt_ghi_chu] = useState("");

    //---------------------------//
    const [mds_phan_hoi, set_mds_phan_hoi] = useState("");
    const [mds_ghi_chu, set_mds_ghi_chu] = useState("");

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
        set_lst_order(data)
        set_fix_kt_phanhoi(data.KT_PHAN_HOI)
        set_fix_mds_phanhoi(data.MDS_PHAN_HOI)
        //-----------------------------------//
        set_kt_da_nhan(data.KT_DA_NHAN);
        set_kt_kh_bb(data.KH_KI_NHAN_THEO_MAU_BB_GIAO_HANG);
        set_kt_kh_hd(data.KH_KI_NHAN_HANG_TREN_HOA_DON);
        // set_kt_phan_hoi(data.KT_PHAN_HOI);
        set_kt_ghi_chu(data.KT_GHI_CHU);
        // set_mds_phan_hoi(data.MDS_PHAN_HOI);
        set_mds_ghi_chu(data.MDS_GHI_CHU);
        console.log(data)
        SetLoading(false)

        }
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
            "KT_PHAN_HOI":current_date + " " + kt_phan_hoi + " | " + fix_kt_phanhoi,
            "MDS_PHAN_HOI":current_date + " " + mds_phan_hoi + " | " + fix_mds_phanhoi,
            "MDS_GHI_CHU":mds_ghi_chu,
        }

        console.log(data);
        post_form_data(data);

        set_kt_da_nhan("");
        set_kt_kh_bb("");
        set_kt_kh_hd("");
        set_kt_ghi_chu("");
        set_kt_phan_hoi("");
        set_mds_phan_hoi("");
        set_mds_ghi_chu("");
        set_fix_kt_phanhoi("");
        set_fix_mds_phanhoi("");

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
                    <Form.Control className="mt-2 text-truncate" type="text" onKeyDown={handleSearchEnter} value={search} onChange={handleSearchParam} placeholder="Tìm Đơn Hàng - Hóa Đơn (DL5-0723-00116-00090632)" />
                    <Form.Control className="mt-2" readOnly value = {lst_order.SODONDATHANG}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.MAKHDMS}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.DUNO}/>
                    <Form.Control className="mt-2" readOnly value = {lst_order.TENKHDMS}/>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT ĐÃ NHẬN </InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_kt_da_nhan( e.target.value ) } value = {kt_da_nhan}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white text-wrap text-left"> KH KÍ NHẬN THEO MẪU BIÊN BẢN GIAO HÀNG </InputGroup.Text> <Form.Control style = {{height: "7vh"}} type="text" onChange={ (e) => set_kt_kh_bb(e.target.value) } value = {kt_kh_bb}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white text-wrap text-left">KH KÍ NHẬN HÀNG TRÊN HÓA ĐƠN</InputGroup.Text> <Form.Control type="text" style = {{height: "7vh"}} onChange={ (e) => set_kt_kh_hd(e.target.value) } value = {kt_kh_hd}/></InputGroup>
                    
                    <Form.Control className="mt-2 font-italic bg-secondary text-white" readOnly value = {  "KT Phản Hồi Trước Đó: " + fix_kt_phanhoi }/>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT PHẢN HỒI</InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_kt_phan_hoi( e.target.value ) } value = {kt_phan_hoi}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-secondary text-white">KT GHI CHÚ</InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_kt_ghi_chu(e.target.value) } value = {kt_ghi_chu}/></InputGroup>

                    <Form.Control className="mt-2 font-italic bg-success text-white" readOnly value = {  "MDS Phản Hồi Trước Đó: " + fix_mds_phanhoi }/>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-success text-white">MDS PHẢN HỒI</InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_mds_phan_hoi(e.target.value) } value = {mds_phan_hoi}/></InputGroup>
                    <InputGroup className="mt-2 text-truncate"> <InputGroup.Text className="w200px bg-success text-white">MDS GHI CHÚ</InputGroup.Text> <Form.Control type="text" onChange={ (e) => set_mds_ghi_chu(e.target.value) } value = {mds_ghi_chu}/></InputGroup>
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