/* eslint-disable */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Spinner
} from "react-bootstrap";

function Thu_hoi_bbgh( {match,history} ) {

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
        const local_url = "sp_f_thuhoibienbanno_kt_v2"
        fetchFilerReportsRT(rpid, isMB, phancap, local_url, {});
		} else {
            history.push('/login');
        };
	}, []);

    const {userLogger, SetRpScreen, fetchFilerReportsRT, shared, loading, ReportId, ReportParam, vw } = useContext(FeedbackContext)



    // const [manv, set_manv] = useState("");
    // const [mb, set_mb] = useState(false);
    // const [lst_cn_check, set_lst_cn_check] = useState (
    //     [
    //         {cn: "CTO016", checked: false},
    //         {cn: "DNG013" ,checked: false},
    //         {cn: "DNI015" ,checked: false},
    //         {cn: "HCM001" ,checked: false},
    //         {cn: "HNI010" ,checked: false},
    //         {cn: "HYN017" ,checked: false},
    //         {cn: "KHA014" ,checked: false},
    //         {cn: "NAN012" ,checked: false},
    //         {cn: "MR0001" ,checked: false},
    //         {cn: "MR0003" ,checked: false},
    //         {cn: "MR0010" ,checked: false},
    //         {cn: "MR0011" ,checked: false},
    //         {cn: "MR0012" ,checked: false},
    //         {cn: "MR0013" ,checked: false},
    //         {cn: "MR0014" ,checked: false},
    //         {cn: "MR0015" ,checked: false},
    //         {cn: "MR0016" ,checked: false}       
    //     ]
        
    //     );
    // const handeClick = (e) => {

    //     let lst = [];
    //     for (const [index, element] of lst_cn_check.entries()) {
    //         if(element.cn === e.target.id) {
    //         element.checked = e.target.checked
    //         lst.push(element);
    //         }
    //         else {
    //         lst.push(element);
    //         }
    //     }
    //     set_lst_cn_check(lst)
    // }

    // const handleReportSubmit = (e) => {
    //     e.preventDefault();
    //     var date = new Date();
    //     var seconds = date.getSeconds().toString();
    //     var minutes = date.getMinutes().toString();
    //     var hour = date.getHours().toString();
    //     const cn = []
    //     for (let i of lst_cn_check) {
    //         if (i.checked === true) 
    //         {cn.push(i.cn)}
    //     }
        
        
    //     const data = {
    //         "cn": cn,
    //         "manv": manv,
    //         "mb":mb,
    //         "version":hour+minutes+seconds
    //     };
    //     console.log(data);
    //     };

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


                <div align="center" className="border-1 bg-dark" >
                    <iframe title="myFrame" frameBorder="0"  src={`https://datastudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
                </div>
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

export default Thu_hoi_bbgh


                {/* <Form className='ml-5 mt-2' onSubmit={console.log("first")}>
                <Stack direction="horizontal" gap={2} className="col-md-2">
                
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="text-dark bg-warning border border-warning">
                        Chọn CN
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{maxHeight: "410px", overflowY: "auto"}}>
                            {lst_cn_check
                            .map( el => <Form.Check key={el.cn} className="text-nowrap" type="switch" checked={el.checked} onChange={handeClick} id={el.cn} label={el.cn}/>)
                            }
                        </Dropdown.Menu>
                    </Dropdown>                
                    <Button className="ml-2 border-0"  type="submit" variant="warning">Submit</Button>
        
                    </Stack>
                </Form> */}