/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    ButtonGroup,
    Col,
    Row,
    Container,
    Form,
    Spinner,
    Card,
    ListGroup,
    Modal,
    FloatingLabel,
    Stack,
    Dropdown,
    // Badge
    // InputGroup,
    
    
} from "react-bootstrap";

function Mds_bbgh_bo_sung() {

    const { removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext)
    const navigate = useNavigate();
    const location = useLocation();
    const location_search = new URLSearchParams(location.search)


    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, 'mds_bbgh_bo_sung', isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        // fetch_initial_data(JSON.parse(localStorage.getItem("userInfo")).manv);
        console.log("so_don_hang_hoa_don", location_search.get('so_don_hang_hoa_don') )
        console.log("branchid",location_search.get('chi_nhanh'))
        set_so_don_hang_hoa_don(location_search.get('so_don_hang_hoa_don'));
        set_chi_nhanh(location_search.get('chi_nhanh'));
        set_so_don_hang_hoa_don(location_search.get('so_don_hang_hoa_don'));
        set_ma_kh(location_search.get('ma_kh'));
        set_slsperid(location_search.get('slsperid'));
        // window.open("https://www.w3schools.com")
        } else {
            navigate('/login');
        };
    }, []);

    
    const f = new Intl.NumberFormat();
    const [EDITMODE, SET_EDITMODE] = useState(false);
    const [manv, set_manv] = useState("");
    const [so_don_hang_hoa_don, set_so_don_hang_hoa_don]= useState("");
    const [chi_nhanh, set_chi_nhanh]= useState("");
    const [ma_kh, set_ma_kh]= useState("");
    const [slsperid, set_slsperid]= useState("");
    const [selectedFile, setSelectedFile] = useState([]);

    const choose_images = (e) => {
        console.log( Array.from(e.target.files) );

        setSelectedFile([...selectedFile, ...e.target.files]);
        }
    

    // const handeClick = (e) => {
    //     let lst = [];
    //     for (let element of arr_co_lam_phong_mach) {
    //         let select_lua_chon = e.target.id;  
    //         if(element.cacluachon === select_lua_chon) {
    //             element.check = e.target.checked
    //             lst.push(element);
    //         }

    //         else if (element.cacluachon !== select_lua_chon){
    //             element.check = false
    //             lst.push(element);
    //         } 
    //         else {
    //             lst.push(element);
    //         }

    //         set_arr_co_lam_phong_mach(lst);

    //         if("Có code" === select_lua_chon & e.target.checked === true) {
    //             set_chon_co_code(true);
    //         }
    //         else {
    //             set_chon_co_code(false);
    //             set_chon_hco_pcl("");
    //             set_chon_chuc_vu("");
    //         }
    //     }

    // }
    


    // const fetch_id_data = async (select_id) => {
    //     SetLoading(true)
    //     const response = await fetch(`https://bi.meraplion.com/local/template/?id=${select_id}`)
        
    //     if (!response.ok) {
    //         SetLoading(false)
    //     }

    //     else {
    //     const data_arr = await response.json()
    //     const data = data_arr[0]
    //     set_ten_hcp(data.id)
    //     console.log(data)
    //     SetLoading(false)

    //     }
    // }

    const post_form_data = async (postdata) => {
        SetLoading(true);
        const formData = new FormData();
        // let data = {
        //     "test":1,
        //     "status":0
        // }
        // JSON.stringify(data)
        formData.append('data', JSON.stringify(postdata));
        for (let i of selectedFile) {
            // console.log(i)
            formData.append('images', i)
        }
        const response = await fetch(`https://bi.meraplion.com/local/file_upload/`, {
            method: "POST",
            headers: {
            },
            body: formData,
        });


        if (!response.ok) {
            SetLoading(false);
            const data = await response.json();
            // console.log(data);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetALert(false), 3000);
        } else {
            SetLoading(false);
            const data = await response.json();
            // console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout( () => SetALert(false), 3000);
            // window.open("https://www.w3schools.com")
            // window.close()
            // CLEAR OLD DATA
            setSelectedFile([])
            // END CLEAR DATA
            // window.location.reload();

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const current_date = formatDate(Date());

        const data = {
            "manv": manv,
            "chi_nhanh":chi_nhanh,
            "thong_tin_don_hang_upload":so_don_hang_hoa_don,
            "so_luong_anh_upload": Array.from(selectedFile).length,
            "inserted_at": null,
            "uuid":uuid(),
            "ma_kh":ma_kh,
            "slsperid": slsperid
        }
        console.log("postdata ", data);
        post_form_data(data);
        // document.getElementById("focus_1").focus();

    }

    if (true) {
        return (
        <Container className="bg-teal-100 h-100" fluid>
            <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
            </Modal>
            <Row className="justify-content-center">
                <Col md={5} >

                    <div>
                        {/* ALERT COMPONENT */}
                        <Form onSubmit={handle_submit}>
                        {/* START FORM BODY */}
                        <FloatingLabel label="Số đơn hàng - Hóa đơn" className="border rounded mt-2" > <Form.Control readOnly={true} type="text" className="" placeholder="xxx" value = {so_don_hang_hoa_don}/> </FloatingLabel>
                        <FloatingLabel label="Chi nhánh" className="border rounded mt-2" > <Form.Control readOnly={true} type="text" className="" placeholder="xxx" value = {chi_nhanh}/> </FloatingLabel>


                        <label className="form-label mt-2 ml-1" style={{fontWeight: "bold"}}>Upload Hình Ảnh *</label>
                        <Form.Control id='file-input-thing' required type="file" style={{width: "115px", fontWeight: "bold"}} multiple={true} accept="image/*"  onChange={ (e) => choose_images(e) } ></Form.Control>
                        <h5 className="ml-1 mt-1 text-wrap">{Array.from(selectedFile).length} hình đã up</h5>
                        {Array.from(selectedFile)
                        .map( (el, index) => 
                            <h5 className="text-wrap">{el.name}</h5>
                        )
                        }
                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        <Button disabled={ Array.from(selectedFile).length === 0 } className='mt-2' variant="primary" type="submit" style={{width: "100%", fontWeight: "bold"}}> LƯU THÔNG TIN </Button>
                        <p className="fw-italic">version: 1.1</p>
                        
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
        // return (
    
        //     <div>
        //         <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
        //         <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        //         </Spinner>
        //     </div>
            
        // )
    }
}


export default Mds_bbgh_bo_sung