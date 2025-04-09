/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import './myvnp.css';
import { Link, useLocation  } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext';
import {
    // ButtonGroup,
    Modal,
    Button,
    Col,
    Row,
    Container,
    Form,
    Spinner,
} from "react-bootstrap";
import ClaimNavTabs from '../components/FormClaimNavTabs'; // adjust the path as needed

function Form_claim_chi_phi({ history }) {
    const location = useLocation();
    const { get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        // const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=${manv}`)
        const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=MR0673`)
        if (!response.ok) {
            SetLoading(false)
        }
        else {
        const data = await response.json()
        set_data_kh_chung(data['data_kh_chung'])
        set_data_hcp(data['data_hcp'])
        set_manv_info(data['manv_info'][0])
        console.log(data);
        SetLoading(false);

        }
    }
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, location.pathname, isMB, dv_width);
        set_manv(JSON.parse(localStorage.getItem("userInfo")).manv);
        fetch_initial_data( JSON.parse(localStorage.getItem("userInfo")).manv );
        } else {
            history.push(`/login?redirect=${location.pathname}`);
        };
    }, []);
    
    const [manv, set_manv] = useState("");
    const [manv_info, set_manv_info] = useState("");
    const [chon_kh_chung, set_chon_kh_chung] = useState(null);
    const [chon_hcp, set_chon_hcp] = useState(null);
    const [qua_tang, set_qua_tang] = useState("");
    const [kenh, set_kenh] = useState("");
    const [noi_dung, set_noi_dung] = useState("");
    const [ghi_chu, set_ghi_chu] = useState("");
    const [so_ke_hoach, set_so_ke_hoach] = useState("");
    const [data_kh_chung, set_data_kh_chung] = useState(
    [
    ]
    )
    const [data_hcp, set_data_hcp] = useState(
    [
    ]

);  
    
    const kenhs = ["CLC", "INS", "PCL", "TP", "MT" ];
    // const noi_dungs = ["noi_dung1", "noi_dung2", "noi_dung3"];

    const noi_dungs = [
        "Chi phí quà tặng tết nguyên đán",
        "Chi phí quà tặng tết trung thu",
        "Chi phí quà tặng ngày nhà giáo",
        "Chi phí quà tặng ngày thầy thuốc",
        "Chi phí quà tặng dịp sinh nhật",
        "Chi phí quà tặng dịp thăng cấp",
        "Chi phí quà tặng mừng sinh con",
        "Chi phí quà tặng mừng cưới",
        "Chi phí vòng hoa đám tang",
        "Chi phí giỏ trái cây đám tang",
        "Chi phí quà tặng quà dịp 01/01",
        "Chi phí quà tặng quà dịp 08/03",
        "Chi phí quà tặng quà dịp 20/03",
        "Chi phí quà tặng quà dịp Giỗ tổ Hùng Vương",
        "Chi phí quà tặng quà dịp 01/05",
        "Chi phí quà tặng ngày Điều dưỡng thế giới 12/05",
        "Chi phí quà tặng ngày Gia đình Việt Nam 28/06",
        "Chi phí quà tặng quà dịp Dược sĩ thế giới 25/09",
        "Chi phí quà tặng sinh nhật Merap 17/10",
        "Chi phí quà tặng ngày phụ nữ Việt Nam 20/10",
        "Chi phí quà tặng ngày giáng sinh 24/12"
    ];

    const qua_tang_type = [
        "Quà tặng",
        "Giao tiếp - Mời cơm",
    ]

    const clear_data = () => {
        set_chon_kh_chung(null);
        set_chon_hcp(null);
        set_qua_tang("");
        set_kenh("");
        set_noi_dung("");
        set_ghi_chu("");
        set_so_ke_hoach("");
    };

    const formatNumber = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/insert_form_claim_chi_phi/`, {
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
            SetALertText("CHƯA TẠO ĐƯỢC");
            setTimeout(() => SetALert(false), 3000);
        } else {
            SetLoading(false);
            const data = await response.json();
            console.log(data);
            SetALert(true);
            SetALertType("alert-success");
            SetALertText("ĐÃ TẠO THÀNH CÔNG");
            setTimeout(() => SetALert(false), 3000);
            clear_data();
            setCount(count+1);

        }
    }

    const handle_submit = (e) => {
        e.preventDefault();
        const data = {
            id: get_id(),
            status:"new",
            // manv: manv,
            manv: "MR0673",
            tencvbh: manv_info?.tencvbh,
            phongdeptsummary: manv_info?.phongdeptsummary,
            chon_kh_chung: chon_kh_chung?.hco_bv,
            pubcustname: chon_kh_chung?.pubcustname,
            chon_hcp: chon_hcp?.ma_hcp_2,
            ten_hcp: chon_hcp?.ten_hcp,
            qua_tang,
            kenh,
            noi_dung,
            ghi_chu,
            so_ke_hoach: so_ke_hoach.replace(/,/g, ""),
            so_hoa_don: null,
            ngay_hoa_don: null,
            so_tien_hoa_don:null,
            inserted_at: Inserted_at()      
        };
        console.log(data);
        post_form_data(data);
        clear_data();
    };

    if (true) {
        return (
    <Container className="bg-teal-100 h-100" fluid>
        {/* Responsive Full-Width Buttons */}
        <ClaimNavTabs />

        {/* Existing noi_dung */}

                <Row className="justify-noi_dung-center">
                    <Col xs={12} md={12}>

                        {/* ALERT COMPONENT */}
                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

                        {alert &&
                        <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                            <span><strong>Cảnh Báo:  </strong>{alertText}</span>
                        </div>
                        }
                        </Modal>

                        <Form onSubmit={handle_submit}>
                            {/* General chon_hcp Select with Search */}
                            <Select
                            className=""
                            options={data_kh_chung}
                            getOptionValue={(el) => el.hco_bv}
                            getOptionLabel={(el) => `${el.hco_bv} - ${el.pubcustname}`}
                            value={chon_kh_chung}
                            onChange={set_chon_kh_chung}
                            // onChange={(selectedOption) => set_chon_kh_chung(selectedOption?.hco_bv)}
                            isSearchable
                            placeholder="Chọn khách hàng tổng"
                            styles={{ placeholder: (base) => ({ ...base, color: "#212529" }) }}
                            />
                            
                            {/* chon_hcp Select with Search */}
                            <Select
                            className="mt-2"
                            options={data_hcp.filter((el) => el.hco_bv === chon_kh_chung?.hco_bv)} // Filter data_hcp
                            getOptionValue={(el) => el.ma_hcp_2}
                            getOptionLabel={(el) => `${el.ma_hcp_2} - ${el.ten_hcp}`}
                            value={chon_hcp}
                            onChange={set_chon_hcp}
                            // onChange={ (selectedOption) => set_chon_hcp(selectedOption?.ma_hcp_2) }
                            isSearchable
                            placeholder="Chọn khách hàng"
                            styles={{ placeholder: (base) => ({ ...base, color: "#212529" }) }}
                            />

                            {/* kenh Select */}
                            <Form.Select className='mt-2' required onChange={(e) => set_qua_tang(e.target.value)} value={qua_tang}>
                                <option value="">Chọn loại quà</option>
                                {qua_tang_type.map((ch, idx) => (
                                <option key={idx} value={ch}>{ch}</option>
                                ))}
                            </Form.Select>
                            
                            {/* kenh Select */}
                            <Form.Select className='mt-2' required onChange={(e) => set_kenh(e.target.value)} value={kenh}>
                                <option value="">Chọn kênh</option>
                                {kenhs.map((ch, idx) => (
                                    <option key={idx} value={ch}>{ch}</option>
                                ))}
                            </Form.Select>
                            
                            {/* noi_dung Select */}
                            <Form.Select className='mt-2' required onChange={(e) => set_noi_dung(e.target.value)} value={noi_dung}>
                                <option value="">Chọn nội dung</option>
                                {noi_dungs.map((cnt, idx) => (
                                    <option key={idx} value={cnt}>{cnt}</option>
                                ))}
                            </Form.Select>
                            
                            {/* ghi_chu Input */}
                            <Form.Control className='mt-2 dark-placeholder' required type="text" placeholder="Ghi chú" onChange={(e) => set_ghi_chu(e.target.value)} value={ghi_chu} style={{ '::placeholder': { color: '#333' } }}/>
                            
                            {/* Planning Number Input */}
                            <Form.Control className='mt-2 dark-placeholder' required type="text" placeholder="Số kế hoạch" onChange={(e) => set_so_ke_hoach( formatNumber(e.target.value.replace(/\D/g, "")) )} value={so_ke_hoach} style={{ '::placeholder': { color: '#333' } }}/>
                            
                            <Button className='mt-2' variant="warning" type="submit" style={{ width: "100%", fontWeight: "bold" }}>GỬI QL DUYỆT</Button>

                        </Form>
                    </Col>
                </Row>
            <style>
            {`
            .dark-placeholder::placeholder {
            color: #333; /* Dark color */
            }
            `}
            </style>
            </Container>


        );
    } else {
        return (
            <div>
                <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
                <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                </Spinner>
            </div>
        );
    }
}

export default Form_claim_chi_phi;


