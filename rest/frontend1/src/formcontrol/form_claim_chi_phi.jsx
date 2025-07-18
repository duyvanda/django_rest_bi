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
    const queryParams = new URLSearchParams(location.search);
    const { formatNumber, get_id, Inserted_at, removeAccents, userLogger, loading, SetLoading, formatDate, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);
    
    const fetch_initial_data = async (manv) => {
        SetLoading(true)
        // const response = await fetch(`https://bi.meraplion.com/local/get_form_claim_chi_phi/?manv=${queryParams.get('manv')}`)
        const response = await fetch(`https://bi.meraplion.com/local/get_data/get_form_claim_chi_phi/?manv=${manv}`)
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
    const [manv_info, set_manv_info] = useState(null);
    const [chon_kh_chung, set_chon_kh_chung] = useState(null);
    const [chon_hcp, set_chon_hcp] = useState(null);
    const [qua_tang, set_qua_tang] = useState("");
    const [kenh, set_kenh] = useState("");
    const [ty_le, set_ty_le] = useState( { value: '5:5', label: '5:5' } );
    const [current_noi_dung, set_current_noi_dung] = useState([]);
    const [noi_dung, set_noi_dung] = useState("");
    const [ghi_chu, set_ghi_chu] = useState("");
    const [so_ke_hoach, set_so_ke_hoach] = useState("");
    const [data_kh_chung, set_data_kh_chung] = useState([]
    )
    const [data_hcp, set_data_hcp] = useState([]);  
    
    const kenhs = ["CLC & INS","CLC", "INS", "PCL"];
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

    const noi_dungs_giao_tiep = [
        "Chi phí gặp gỡ giao tiếp trao đổi thông tin",
        "Chi phí gặp sở chia sẻ thông tin ngành",
        "Chi phí giao tiếp tư vấn chuyên môn",
        "Chi phí giao tiếp cập nhật kiến thức về sản phẩm",
        "Chi phí giao tiếp đánh giá về hiệu quả của thuốc"
      ];

    const qua_tang_type = [
        "Quà tặng",
        "Giao tiếp - Mời cơm",
    ]

    const handleQuaTangChange = (e) => {
        const selectedValue = e.target.value;
        set_qua_tang(selectedValue);
        set_noi_dung(null); // Reset nội dung
    
        if (selectedValue === 'Giao tiếp - Mời cơm') {
          set_current_noi_dung(noi_dungs_giao_tiep);
        } else {
          set_current_noi_dung(noi_dungs);
        }
      };


// So every time current_noi_dung changes (from set_current_noi_dung()), React re-renders the component, and this line re-executes to generate new options. That’s why it still works even though it’s not inside the handler.
// It’s totally valid (and preferred) to keep this mapping outside like that — it's declarative and aligns with React's reactive design.

    // Check if phongdeptsummary is "MT" or "TP"
    const isKenhDisabled = manv_info?.phongdeptsummary === 'MT' || manv_info?.phongdeptsummary === 'TP';
    // If phongdeptsummary is "MT" or "TP", set kenh to that value
    const currentKenhValue = isKenhDisabled ? manv_info?.phongdeptsummary : kenh;
    
    // Automatically set kenh to "MT" or "TP" if necessary
    useEffect(() => {
    if (manv_info?.phongdeptsummary === 'MT' || manv_info?.phongdeptsummary === 'TP') {
        set_kenh(manv_info?.phongdeptsummary); // Set kenh to "MT" or "TP"
    }
    }, [manv_info]); // Run this effect when manv_info changes

    const noi_dung_options = current_noi_dung.map(item => ({
        value: item,
        label: item
        }));

    const clear_data = () => {
        set_chon_kh_chung(null);
        set_chon_hcp(null);
        set_qua_tang("");
        set_kenh("");
        set_noi_dung("");
        set_ghi_chu("");
        set_so_ke_hoach("");
        set_ty_le( { value: '5:5', label: '5:5' } )
    };

    // const formatNumber = (value) => {
    //     return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // };

    const post_form_data = async (data) => {
        SetLoading(true)
        const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_gift_expenses/`, {
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
        let max_ke_hoach

        if (manv_info?.phongdeptsummary === 'HCP' & qua_tang === 'Quà tặng' ) 
        {
            max_ke_hoach = Number(chon_hcp?.length)*2000000
        }
        else {max_ke_hoach = 99999999}
        
        const rawId = get_id();
        const insert = Inserted_at();
        const baseData = {
            id: rawId,
            status:"new",
            manv: manv,
            tencvbh: manv_info?.tencvbh,
            phongdeptsummary: manv_info?.phongdeptsummary,
            chon_kh_chung: chon_kh_chung?.hco_bv,
            pubcustname: chon_kh_chung?.pubcustname,
            chon_hcp: chon_hcp,
            ten_hcp: null,
            qua_tang,
            kenh: kenh,
            noi_dung: noi_dung,
            ghi_chu,
            so_ke_hoach: Number(so_ke_hoach.replace(/,/g, "")  ),
            so_hoa_don: null,
            ngay_hoa_don: null,
            so_tien_hoa_don:null,
            inserted_at: insert,
            ty_le: ty_le?.value,
            max_ke_hoach
        };
        const plan = Number(so_ke_hoach.replace(/,/g, ""));

        console.log("baseData", baseData)

        const explodedData = [];

        // Check if chon_hcp is null or an empty array
        if (!baseData.chon_hcp || baseData.chon_hcp.length === 0) {
            explodedData.push(baseData);
        } else {
            // If chon_hcp exists and is an array, explode it
            let index = 0;
            for (const hcp_detail of baseData.chon_hcp) {
                index++; // Increment index for suffix (starts from 1)
                const newItem = {
                    // id: `${baseData.id}_${index}`, 
                    id: baseData.id,
                    status: baseData.status,
                    manv: baseData.manv,
                    tencvbh: baseData.tencvbh,
                    phongdeptsummary: baseData.phongdeptsummary,
                    chon_kh_chung: baseData.chon_kh_chung,
                    pubcustname: baseData.pubcustname,
                    chon_hcp: hcp_detail.ma_hcp_2,
                    ten_hcp: hcp_detail.ten_hcp,
                    qua_tang: baseData.qua_tang,
                    kenh: baseData.kenh,
                    noi_dung: baseData.noi_dung,
                    ghi_chu: baseData.ghi_chu,
                    so_ke_hoach: baseData.so_ke_hoach,
                    so_hoa_don: baseData.so_hoa_don,
                    ngay_hoa_don: baseData.ngay_hoa_don,
                    so_tien_hoa_don: baseData.so_tien_hoa_don,
                    inserted_at: baseData.inserted_at,
                    ty_le: baseData.ty_le,
                    max_ke_hoach
                };
                explodedData.push(newItem);
            }
        }

        console.log("explodedData", explodedData);
        post_form_data(explodedData);
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
                            onChange={
                            (selectedOptions) => {
                            set_chon_kh_chung(selectedOptions);  // Update state
                            set_chon_hcp(null)
                            console.log(selectedOptions);  // Log the selected options

                            }
                            }
                            isSearchable
                            placeholder="Chọn khách hàng tổng"
                            styles={{ placeholder: (base) => ({ ...base, color: "#212529" }) }}
                            />
                            
                            {/* chon_hcp Select with Search */}
                            <Select
                            isMulti
                            className="mt-2"
                            options={data_hcp.filter((el) => el.hco_bv === chon_kh_chung?.hco_bv)}
                            getOptionValue={(el) => el.ma_hcp_2}
                            getOptionLabel={(el) => `${el.ma_hcp_2} - ${el.ten_hcp}`}
                            value={chon_hcp}
                            onChange={
                                (selectedOptions) => {
                                set_chon_hcp(selectedOptions);  // Update state
                                console.log(selectedOptions);  // Log the selected options
                                }
                            }
                            // onChange={ (selectedOption) => set_chon_hcp(selectedOption?.ma_hcp_2) }
                            isSearchable
                            isDisabled={isKenhDisabled}
                            placeholder="Chọn khách hàng"
                            styles={{ placeholder: (base) => ({ ...base, color: "#212529" }) }}
                            />

                            {/* Chon Loai Qua Select */}
                            <Form.Select className='mt-2' required onChange={handleQuaTangChange} value={qua_tang}>
                                <option value="">Chọn loại quà</option>
                                {qua_tang_type.map((ch, idx) => (
                                <option key={idx} value={ch}>{ch}</option>
                                ))}
                            </Form.Select>
                            
                            {/* kenh Select */}
                            <Form.Select className='mt-2' required 
                            onChange={(e) => set_kenh(e.target.value)} 
                            value={currentKenhValue}
                            disabled={isKenhDisabled}
                            >
                            
                            <option value="">Chọn kênh</option>
                            {kenhs.map((ch, idx) => (
                                <option key={idx} value={ch}>{ch}</option>
                            ))}
                            </Form.Select>

                            {(kenh === 'CLC & INS') && (
                                <Select
                                required
                                className="mt-2"
                                options={[
                                { value: '5:5', label: '5:5' },
                                { value: '6:4', label: '6:4' },
                                { value: '7:3', label: '7:3' }
                                ]}
                                value={ty_le} // state for selected option
                                onChange={(selected) => set_ty_le(selected)} // or set_ty_le(selected?.value) if storing string
                                placeholder="Chọn tỷ lệ"
                                isSearchable
                                styles={{
                                placeholder: (base) => ({ ...base, color: "#212529" })
                                }}
                            />
                            )}
                            
                            {/* noi_dung Select */}
                            {/* <Form.Select className='mt-2' required onChange={(e) => set_noi_dung(e.target.value)} value={noi_dung}>
                                <option value="">Chọn nội dung</option>
                                {current_noi_dung.map((cnt, idx) => (
                                    <option key={idx} value={cnt}>{cnt}</option>
                                ))}
                            </Form.Select> */}

                            {(manv_info?.phongdeptsummary === 'MT' || manv_info?.phongdeptsummary === 'TP') ? (
                            <textarea
                                className="form-control mt-2"
                                placeholder="Nhập nội dung"
                                value={noi_dung}
                                onChange={(e) => set_noi_dung(e.target.value)}
                                required
                            />
                            ) : 
                            
                            (
                                <Select
                                className="mt-2"
                                options={noi_dung_options}
                                value={noi_dung_options.find(option => option.value === noi_dung) || null}
                                onChange={(selected) => set_noi_dung(selected?.value || '')}
                                isSearchable
                                placeholder="Chọn nội dung"
                                styles={{ placeholder: (base) => ({ ...base, color: "#212529" }) }}
                                />
                            )}


                            
                            {/* ghi_chu Input */}
                            <Form.Control className='mt-2 dark-placeholder' type="text" placeholder="Ghi chú" onChange={(e) => set_ghi_chu(e.target.value)} value={ghi_chu} style={{ '::placeholder': { color: '#333' } }}/>
                            
                            {/* Planning Number Input */}
                            <Form.Control className='mt-2 dark-placeholder' required type="text" placeholder="Số kế hoạch" onChange={(e) => set_so_ke_hoach( formatNumber(e.target.value.replace(/\D/g, "")) )} value={so_ke_hoach} style={{ '::placeholder': { color: '#333' } }}/>
                            
                            <Button className='mt-2' variant="warning" type="submit" 
                            style={{ width: "100%", fontWeight: "bold" }}
                            disabled={
                            (qua_tang === "Quà tặng" && manv_info?.phongdeptsummary === 'HCP' &&
                                (Number(so_ke_hoach.replace(/,/g, ""))  / Number(chon_hcp?.length)) >= 2000000)
                            }
                            >GỬI QL DUYỆT</Button>

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
        // return (
        //     <div>
        //         <h1 className="text-danger text-center">Xử Lý Thông Tin</h1>
        //         <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
        //         </Spinner>
        //     </div>
        // );
    }
}

export default Form_claim_chi_phi;

// const handle_submit = (e) => {
//     e.preventDefault();
//     const rawId = get_id();
//     const baseData = {
//         id: rawId,
//         status:"new",
//         // manv: manv,
//         manv: "MR0673",
//         tencvbh: manv_info?.tencvbh,
//         phongdeptsummary: manv_info?.phongdeptsummary,
//         chon_kh_chung: chon_kh_chung?.hco_bv,
//         pubcustname: chon_kh_chung?.pubcustname,
//         chon_hcp: chon_hcp?.ma_hcp_2,
//         ten_hcp: chon_hcp?.ten_hcp,
//         qua_tang,
//         kenh: kenh,
//         noi_dung: noi_dung,
//         ghi_chu,
//         so_ke_hoach: Number(so_ke_hoach.replace(/,/g, "")),
//         so_hoa_don: null,
//         ngay_hoa_don: null,
//         so_tien_hoa_don:null,
//         inserted_at: Inserted_at()      
//     };
//     const plan = Number(so_ke_hoach.replace(/,/g, ""));

//     let dataEntries = [];  

//     if (ty_le && (kenh === "CLC & INS")) {
//         const id1 = rawId;
//         const id2 = (BigInt(rawId) + 1n).toString(); 
//         console.log('id1:', id1, 'id2:', id2);
//         const [clcRatio, insRatio] = ty_le.value.split(':').map(Number);
//         const total = clcRatio + insRatio;
//         const clcValue = Math.round(plan * (clcRatio / total));
//         const insValue = plan - clcValue;
    
//         const data1 = {
//           ...baseData,
//           id: id1,
//           kenh: "CLC",
//           so_ke_hoach: clcValue
//         };
    
//         const data2 = {
//           ...baseData,
//           id: id2,
//           kenh: "INS",
//           so_ke_hoach: insValue
//         };
//         console.log("Multiple data entries:", [data1, data2]);
//         dataEntries.push(data1, data2);
//     } else {
//         const data = {
//           ...baseData,
//           kenh,
//           so_ke_hoach: plan
//         };
//         console.log("Single data entry:", [data]);
//         dataEntries.push(data);
//     }
//     post_form_data(dataEntries);
// };
