/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Spinner,
    Button,
    Dropdown,
    Form,
    Stack
} from "react-bootstrap";

function Ton_Kho_Va_Toc_Do_Ban( {match,history} ) {

    const [lst_cn_check, set_lst_cn_check] = useState (
        [
            {cn: "CTO016" ,checked: true},
            {cn: "DNG013" ,checked: true},
            {cn: "DNI015" ,checked: true},
            {cn: "HCM001" ,checked: true},
            {cn: "HNI010" ,checked: true},
            {cn: "HYN017" ,checked: true},
            {cn: "KHA014" ,checked: true},
            {cn: "NAN012" ,checked: true},
            {cn: "MR0001" ,checked: true},
            {cn: "MR0003" ,checked: true},
            {cn: "MR0010" ,checked: true},
            {cn: "MR0011" ,checked: true},
            {cn: "MR0012" ,checked: true},
            {cn: "MR0013" ,checked: true},
            {cn: "MR0014" ,checked: true},
            {cn: "MR0015" ,checked: true},
            {cn: "MR0016" ,checked: true}       
        ]
    )

    const [show_report, set_show_report] = useState(false)



    useEffect(() => {
		if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        console.log("stt", match.params.id)
        const stt = match.params.id
        const rpid = stt.slice(0, -1)
        const lastChar = stt.substr(stt.length - 1);
        const phancap = lastChar==="0" ? false : true;
        console.log("phan cap", phancap)
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, rpid , isMB, dv_width);
        SetRpScreen(true);
        fetchFilerReports(rpid, isMB);
		} else {
            history.push('/login');
        };
    // eslint-disable-next-line
	}, []);

    const handle_click_chi_nhanh = (e) => {
        let lst = [];
        // eslint-disable-next-line
        for (const [ind, element] of lst_cn_check.entries()) {
            if(element.cn === e.target.id) {
                element.checked = e.target.checked
                lst.push(element);
            }
            else {
                lst.push(element);
            }
        }
        set_lst_cn_check(lst)
    }

    const handleClear = () => {
        const lst = [];
        for (const i of lst_cn_check) {
        i.checked = false
        lst.push(i);
        };
        set_lst_cn_check(lst)
        }

    const handle_submit = (e) => {
        e.preventDefault();
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const stt = match.params.id
        const rpid = stt.slice(0, -1)
        const lastChar = stt.substr(stt.length - 1);
        const phancap = lastChar==="0" ? false : true;
        const local_url = "ton_kho_va_toc_do_ban"

        const chinhanh = []
        for (let i of lst_cn_check) {
            if (i.checked === true) {chinhanh.push(i.cn)}
        }

        const filter_data = {
            "chinhanh":chinhanh
        }

        fetchFilerReportsRT(rpid, isMB, phancap, local_url, filter_data);
        set_show_report(true);

    }

    const {userLogger, SetRpScreen, fetchFilerReportsRT, fetchFilerReports, shared, loading, ReportId, ReportParam, vw } = useContext(FeedbackContext)


    if (!shared) {
        return (
            <div className="container">
                <h1>Bạn chưa được cấp quyền truy cập</h1>
                <Link to="/reports">Đi Đến Danh Sách Reports</Link>
            </div>
        )
    }
    
    else if (!loading) {
        return (
            <div>
                <Form className='mt-2' onSubmit={ handle_submit }>
                <Stack direction="horizontal" gap={2} className="col-md-2">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="text-dark bg-warning border border-warning">
                        Chọn CN
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}}>
                        <Button variant="warning" size="sm" style={{width:"200px"}} onClick={handleClear}>Clear All</Button>
                            {lst_cn_check
                            .map( el => <Form.Check key={el.cn} className="text-nowrap" type="switch" checked={el.checked} onChange={handle_click_chi_nhanh} id={el.cn} label={el.cn}/>)
                            }
                        </Dropdown.Menu>
                    </Dropdown>                
                    <Button className="ml-2 border-0"  type="submit" variant="warning">Submit</Button>
        
                    </Stack>
                </Form>


                { show_report &&
                <div align="center" className="border-1 bg-dark mt-2" >
                    <iframe title="myFrame" frameBorder="0"  src={`https://datastudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
                </div>
                }
            </div>
        );
    
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

export default Ton_Kho_Va_Toc_Do_Ban

/* <Form className='ml-5 mt-2' onSubmit={console.log("first")}>
<Stack direction="horizontal" gap={2} className="col-md-2">

    <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" className="text-dark bg-warning border border-warning">
        Chọn CN
        </Dropdown.Toggle>
        <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}}>
            {lst_cn_check
            .map( el => <Form.Check key={el.cn} className="text-nowrap" type="switch" checked={el.checked} onChange={console.log("first")} id={el.cn} label={el.cn}/>)
            }
        </Dropdown.Menu>
    </Dropdown>                
    <Button className="ml-2 border-0"  type="submit" variant="warning">Submit</Button>

    </Stack>
</Form> */