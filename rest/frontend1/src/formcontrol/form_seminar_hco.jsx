import React, { useState, useContext } from 'react';
import { Container, Row, Col, Nav, Form, ListGroup, FloatingLabel, Button, Stack, Spinner, Table, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { removeAccents } from '../utils/string.js';
import FeedbackContext from '../context/FeedbackContext'; // Assuming context path

// Based on form_ui_rules.md and the provided spec

const FormSeminarHco = () => {
    const { get_id, Inserted_at, userLogger, loading, SetLoading, alert, alertText, alertType, SetALert, SetALertText, SetALertType } = useContext(FeedbackContext);

    const [active_tab, set_active_tab] = useState('deXuat');
    const [hco_search_term, set_hco_search_term] = useState('');
    
    // State for Tab 1
    const [selected_hco, set_selected_hco] = useState([]);
    const [smn_thang, set_smn_thang] = useState(null);
    const [tuan_thuc_hien, set_tuan_thuc_hien] = useState(null);
    const [nhom_san_pham, set_nhom_san_pham] = useState(null);
    const [so_luong_bs_ds, set_so_luong_bs_ds] = useState('');
    const [dia_diem, set_dia_diem] = useState('');
    const [muc_dich, set_muc_dich] = useState('');
    const [chi_phi_hoi_truong, set_chi_phi_hoi_truong] = useState('');
    const [chi_phi_may_chieu, set_chi_phi_may_chieu] = useState('');
    const [chi_phi_an_uong, set_chi_phi_an_uong] = useState('');
    const [chi_phi_teabreak, set_chi_phi_teabreak] = useState('');
    const [chi_phi_bao_cao_vien, set_chi_phi_bao_cao_vien] = useState('');
    const [tang_pham, set_tang_pham] = useState('');

    const [hco_options, set_hco_options] = useState([]);
    const [smn_thang_options, set_smn_thang_options] = useState([]);
    const [tuan_thuc_hien_options, set_tuan_thuc_hien_options] = useState([]);
    const [nhom_san_pham_options_state, set_nhom_san_pham_options_state] = useState([]);

    // State for CXM Proposals
    const [cxm_proposals, set_cxm_proposals] = useState([]);
    
    React.useEffect(() => {
        const fetch_options_data = async () => {
            SetLoading(true);
            try {
                const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dummy_data?manv=MR0023`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Add a 'checked' property to each HCO option for the switch list
                const hco_with_checked = (data.hco_options || []).map(option => ({ ...option, checked: false }));
                set_hco_options(hco_with_checked);
                set_smn_thang_options(data.smn_thang_options || []);
                set_tuan_thuc_hien_options(data.tuan_thuc_hien_options || []);
                set_nhom_san_pham_options_state(data.nhom_san_pham_options || []);
            } catch (error) {
                console.error("Fetch error:", error);
                SetALert(true);
                SetALertType("danger");
                SetALertText("Failed to fetch form options data.");
            } finally {
                SetLoading(false);
            }
        };

        fetch_options_data();
    }, [SetALert, SetALertType, SetALertText, SetLoading]); // Dependency array


    React.useEffect(() => {
        if (active_tab === 'cxmDuyet') {
            const fetch_cxm_proposals = async () => {
                SetLoading(true);
                try {
                    const response = await fetch(`https://bi.meraplion.com/local/get_data/get_form_seminar_hco_cxm`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json(); // Data is wrapped in 'data' key
                    const proposals_with_checked = (result.data || []).map(proposal => ({ ...proposal, checked: true }));
                    set_cxm_proposals(proposals_with_checked);
                } catch (error) {
                    console.error("Fetch error for CXM proposals:", error);
                    SetALert(true);
                    SetALertType("danger");
                    SetALertText("Failed to fetch CXM proposals data.");
                } finally {
                    SetLoading(false);
                }
            };
            fetch_cxm_proposals();
        }
    }, [active_tab, SetLoading, SetALert, SetALertType, SetALertText]); // Re-fetch when active_tab changes to cxmDuyet
    
    const select_styles = {
        container: (base) => ({
            ...base,
            fontSize: "15px",
        }),
        control: (base) => ({
            ...base,
            minHeight: '58px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#000000',
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    };

    // Helper functions for number formatting
    const format_number = (num) => {
        if (num === '' || num === undefined || num === null) return '';
        const numberValue = parseFloat(num);
        if (isNaN(numberValue)) return '';
        // Use 'en-US' locale for comma as thousands separator, dot as decimal
        return new Intl.NumberFormat('en-US').format(numberValue);
    };

    const parse_number = (formattedNum) => {
        if (typeof formattedNum !== 'string' || formattedNum.trim() === '') return '';
        // If 'en-US' format is used for display:
        // Remove commas (thousands separator) and then parse with parseFloat
        const cleanNum = formattedNum.replace(/,/g, ''); // Remove commas
        const numberValue = parseFloat(cleanNum);
        return isNaN(numberValue) ? '' : numberValue;
    };

    const clear_data = () => {
        // Re-fetch initial data to reset hco_options with checked:false
        const fetch_options_data = async () => {
            const response = await fetch(`https://bi.meraplion.com/local/get_data/get_dummy_data?manv=MR0023`);
            const data = await response.json();
            const hco_with_checked = (data.hco_options || []).map(option => ({ ...option, checked: false }));
            set_hco_options(hco_with_checked);
        };
        fetch_options_data();
        
        set_smn_thang(null);
        set_tuan_thuc_hien(null);
        set_nhom_san_pham(null);
        set_so_luong_bs_ds('');
        set_dia_diem('');
        set_muc_dich('');
        set_chi_phi_hoi_truong('');
        set_chi_phi_may_chieu('');
        set_chi_phi_an_uong('');
        set_chi_phi_teabreak('');
        set_chi_phi_bao_cao_vien('');
        set_tang_pham('');
        set_active_tab('deXuat'); // Reset to the first tab
        set_hco_search_term(''); // Clear the search term
        set_cxm_proposals([]); // Clear CXM proposals
    };

    const handleHcoSwitch = (id) => {
        set_hco_options(
            hco_options.map(option => 
                option.id === id ? { ...option, checked: !option.checked } : option
            )
        );
    };

    const handleCxmProposalSwitch = (id) => {
        set_cxm_proposals(
            cxm_proposals.map(proposal => 
                proposal.id === id ? { ...proposal, checked: !proposal.checked } : proposal
            )
        );
    };

    const post_form_data = async (data) => {
        SetLoading(true);
        try {
            const response = await fetch(`https://bi.meraplion.com/local/post_data/insert_form_seminar_hco/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                SetALert(true);
                SetALertType("danger");
                SetALertText(errorData.error_message);
                setTimeout(() => {
                    SetALert(false);
                    SetLoading(false);
                }, 2000);

            } else {
                const successData = await response.json();
                console.log(successData);
                SetALert(true);
                SetALertType("success");
                SetALertText(successData.success_message);
                setTimeout(() => {
                    SetALert(false);
                    SetLoading(false);
                }, 2000);
                
                clear_data();
            }
        } catch (error) {
            console.error("Fetch error:", error);
            SetALert(true);
            SetALertType("alert-danger");
            SetALertText("Network error or server unreachable.");
            setTimeout(() => {
                SetALert(false);
                SetLoading(false);
            }, 2000);
        }
    };

    const handle_submit = () => {
        const selected_hco_ids = hco_options.filter(option => option.checked).map(option => option.id);
        const postData = {
            id: get_id(),
            manv: 'MR0673', // default value
            status:'H',
            hco: selected_hco_ids.join(','),
            smn_thang: smn_thang ? smn_thang.value : null,
            tuan_thuc_hien: tuan_thuc_hien ? tuan_thuc_hien.value : null,
            nhom_san_pham: nhom_san_pham ? nhom_san_pham.value : null,
            so_luong_bs_ds: so_luong_bs_ds,
            dia_diem: dia_diem,
            muc_dich: muc_dich,
            chi_phi_hoi_truong: chi_phi_hoi_truong,
            chi_phi_may_chieu: chi_phi_may_chieu,
            chi_phi_an_uong: chi_phi_an_uong,
            chi_phi_teabreak: chi_phi_teabreak,
            chi_phi_bao_cao_vien: chi_phi_bao_cao_vien,
            tang_pham: tang_pham,
            inserted_at: Inserted_at(),
        };
        post_form_data([postData]);
    };

    const render_de_xuat_tab = () => (
        <div className="bg-white border rounded shadow-sm p-3 mt-2">
            <h5 className="mb-3">📝 Đề xuất Kế hoạch Seminar</h5>

                        <Modal show={loading} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
                            <Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>

                            {alert && (
                                <Alert
                                    variant={alertType} // e.g., 'danger', 'warning', 'success'
                                    onClose={() => SetALert(false)} // You must handle the state update here
                                    dismissible
                                    className="mt-2 text-start" // Added text-start to align text left if parent is centered
                                >
                                    <Alert.Heading as="h6" className="mb-1">
                                        <strong>Cảnh Báo: </strong>
                                    </Alert.Heading>
                                    {alertText}
                                </Alert>
                            )}
                        </Modal>

            {/* --- Chọn nhiều HCO --- */}
            <div className="form-field-hover">
                <p className="fw-bold mt-3">🧑‍⚕️ Chọn HCO - Khoa Phòng</p>
                <div className="border rounded p-2">
                    <Form.Control 
                        placeholder="🔍 Tìm HCO (KHÔNG DẤU)" 
                        className="mb-2 black-placeholder"
                        value={hco_search_term}
                        onChange={e => set_hco_search_term(e.target.value)}
                    />
                    <ListGroup style={{ maxHeight: "400px", overflowY: "auto" }}>
                        {hco_options
                            .filter(item => 
                                removeAccents(item.ten_gop_hco).includes(removeAccents(hco_search_term))
                            )
                            .map(item => (
                            <ListGroup.Item key={item.id} className="p-1 bg-white border rounded">
                                 <Form.Check 
                                    type="switch" 
                                    id={`hco-switch-${item.id}`} 
                                    label={item.ten_gop_hco}
                                    checked={item.checked}
                                    onChange={() => handleHcoSwitch(item.id)}
                                 />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>

            <Select styles={select_styles} options={smn_thang_options} placeholder="SMN tháng" onChange={set_smn_thang} value={smn_thang} isSearchable required className="form-field-hover mt-2" menuPortalTarget={document.body} />
            <Select styles={select_styles} options={tuan_thuc_hien_options} placeholder="Tuần thực hiện" onChange={set_tuan_thuc_hien} value={tuan_thuc_hien} isSearchable required className="form-field-hover mt-2" menuPortalTarget={document.body} />
            <Select styles={select_styles} options={nhom_san_pham_options_state} placeholder="Nhóm sản phẩm giới thiệu chính" onChange={set_nhom_san_pham} value={nhom_san_pham} isSearchable required className="form-field-hover mt-2" menuPortalTarget={document.body} />
            
            <FloatingLabel label="Số lượng BS/ DS" className="border rounded mt-2 form-field-hover">
                <Form.Control type="number" value={so_luong_bs_ds} onChange={e => set_so_luong_bs_ds(e.target.value)} required />
            </FloatingLabel>
            
            <FloatingLabel label="Địa điểm thực hiện" className="border rounded mt-2 form-field-hover">
                <Form.Control type="text" value={dia_diem} onChange={e => set_dia_diem(e.target.value)} required />
            </FloatingLabel>

            <FloatingLabel label="Mục đích thực hiện" className="border rounded mt-2 form-field-hover">
                <Form.Control type="text" value={muc_dich} onChange={e => set_muc_dich(e.target.value)} required />
            </FloatingLabel>

            <p className="fw-bold mt-3">💰 Chi phí dự kiến</p>
            <FloatingLabel label="CP Hội trường" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(chi_phi_hoi_truong)} 
                    onChange={e => set_chi_phi_hoi_truong(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>
            <FloatingLabel label="CP Máy chiếu" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(chi_phi_may_chieu)} 
                    onChange={e => set_chi_phi_may_chieu(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>
            <FloatingLabel label="CP Ăn uống" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(chi_phi_an_uong)} 
                    onChange={e => set_chi_phi_an_uong(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>
            <FloatingLabel label="CP Teabreak" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(chi_phi_teabreak)} 
                    onChange={e => set_chi_phi_teabreak(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>
             <FloatingLabel label="CP BCV" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(chi_phi_bao_cao_vien)} 
                    onChange={e => set_chi_phi_bao_cao_vien(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>
             <FloatingLabel label="CP Tặng phẩm" className="border rounded mt-2 form-field-hover">
                <Form.Control 
                    type="text"
                    value={format_number(tang_pham)} 
                    onChange={e => set_tang_pham(parse_number(e.target.value))} 
                    required
                />
            </FloatingLabel>

            <div className="mt-3 d-grid">
                <Button variant="primary" size="lg" onClick={handle_submit}>
                    {loading ? <Spinner animation="grow" size="sm" /> : "Gửi Đề Xuất"}
                </Button>
            </div>
        </div>
    );

    const render_cxm_duyet_tab = () => {
        return (
            <div className="bg-white border rounded shadow-sm p-3 mt-2">
                <h5 className="mb-3">Duyệt đề xuất</h5>
                <p>Danh sách các đề xuất đang chờ duyệt. Tắt switch để từ chối.</p>
                
                <Table striped bordered hover responsive id="cxm-approval-table" className="mt-3">
                    <thead>
                        <tr>
                            <th>Chọn</th>
                            <th>ID</th>
                            <th>Mã NV</th>
                            <th>Tên NV</th>           
                            <th style={{ minWidth: '200px' }}>Tên HCO</th>
                            <th style={{ minWidth: '120px' }}>DS HCO</th>
                            <th style={{ minWidth: '120px' }}>DS Nhóm SP</th>
                            <th style={{ minWidth: '100px' }}>SL NVYT</th>
                            <th>Tháng</th>
                            <th>Tuần</th>
                            <th style={{ minWidth: '200px' }}>Địa điểm</th>
                            <th>Nhóm SP</th>
                            <th style={{ minWidth: '100px' }}>SL BS-DS</th>
                            <th style={{ minWidth: '300px' }}>Mục đích</th>
                            <th style={{ minWidth: '120px' }} className="text-end">Tổng CP</th>
                            <th style={{ minWidth: '120px' }}>CP Hội trường</th>
                            <th style={{ minWidth: '120px' }}>CP Máy chiếu</th>
                            <th style={{ minWidth: '120px' }}>CP Ăn uống</th>
                            <th style={{ minWidth: '120px' }}>CP Teabreak</th>
                            <th style={{ minWidth: '120px' }}>CP BCV</th>
                            <th style={{ minWidth: '120px' }}>CP Tặng phẩm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cxm_proposals.map(p => {
                            const total_cost = p.chi_phi_hoi_truong + p.chi_phi_may_chieu + p.chi_phi_an_uong + p.chi_phi_teabreak + p.chi_phi_bao_cao_vien + p.tang_pham;
                            return (
                                <tr key={p.id}>
                                    <td>
                                        <Form.Check 
                                            type="switch"
                                            id={`proposal-switch-${p.id}`}
                                            checked={p.checked}
                                            onChange={() => handleCxmProposalSwitch(p.id)}
                                        />
                                    </td>
                                    <td>{p.id}</td>
                                    <td>{p.manv}</td>
                                    <td>{p.ten_nv}</td>                                        
                                    <td style={{ minWidth: '200px' }}>{p.ten_hco}</td>
                                    <td className="text-end" style={{ minWidth: '120px' }}>{format_number(p.ds_tong_hco)}</td>
                                    <td className="text-end" style={{ minWidth: '120px' }}>{format_number(p.ds_nhom_sp_chinh)}</td>
                                    <td style={{ minWidth: '100px' }}>{p.tong_sl_nvyt}</td>
                                    <td>{p.smn_thang}</td>
                                    <td>{p.tuan_thuc_hien}</td>
                                    <td style={{ minWidth: '200px' }}>{p.dia_diem}</td>
                                    <td>{p.nhom_san_pham}</td>
                                    <td>{p.so_luong_bs_ds}</td>
                                    <td style={{ minWidth: '300px' }}>{p.muc_dich}</td>
                                    <td className="text-end fw-bold" style={{ minWidth: '120px' }}>{format_number(total_cost)}</td>
                                    <td className="text-end">{format_number(p.chi_phi_hoi_truong)}</td>
                                    <td className="text-end">{format_number(p.chi_phi_may_chieu)}</td>
                                    <td className="text-end">{format_number(p.chi_phi_an_uong)}</td>
                                    <td className="text-end">{format_number(p.chi_phi_teabreak)}</td>
                                    <td className="text-end">{format_number(p.chi_phi_bao_cao_vien)}</td>
                                    <td className="text-end">{format_number(p.tang_pham)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

                <div className="mt-3 d-flex gap-2">
                    <Button variant="danger" size="lg" className="flex-fill">Từ chối</Button>
                    <Button variant="success" size="lg" className="flex-fill">Duyệt</Button>
                </div>
            </div>
        );
    };


    const render_bao_cao_tab = () => (
        <div className="bg-white border rounded shadow-sm p-3 mt-2">
            <h5 className="mb-3">📊 Báo cáo</h5>
            <iframe
                title="Looker Studio Report"
                width="100%"
                height="600"
                src="https://lookerstudio.google.com/embed/reporting/YOUR_REPORT_ID"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
            ></iframe>
        </div>
    );

    return (
        <Container fluid className="bg-teal-100 h-100 p-2">
            <Row className="justify-content-center">
                <Col xs={12}>
                    <Nav variant="pills" fill className="bg-light p-2 rounded gap-2 fw-bold">
                        <Nav.Item>
                            <Nav.Link 
                                onClick={() => set_active_tab('deXuat')} 
                                className={active_tab === 'deXuat' ? 'bg-merap-active text-white' : 'bg-white shadow-sm border text-dark'}
                            >
                                Đề xuất
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                onClick={() => set_active_tab('cxmDuyet')}
                                className={active_tab === 'cxmDuyet' ? 'bg-merap-active text-white' : 'bg-white shadow-sm border text-dark'}
                            >
                                CXM Duyệt
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                onClick={() => set_active_tab('baoCao')}
                                className={active_tab === 'baoCao' ? 'bg-merap-active text-white' : 'bg-white shadow-sm border text-dark'}
                            >
                                Báo cáo
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {active_tab === 'deXuat' && render_de_xuat_tab()}
                    {active_tab === 'cxmDuyet' && render_cxm_duyet_tab()}
                    {active_tab === 'baoCao' && render_bao_cao_tab()}
                </Col>
            </Row>
        </Container>
    );
};

export default FormSeminarHco;