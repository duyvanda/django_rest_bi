import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MapContext from "../context/MapContext";
import FeedbackContext from '../context/FeedbackContext'
import {
    Button,
    Dropdown,
    Form,
    Spinner,
} from "react-bootstrap";

// import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

function TonKhoVaTocDoBan(history) {

    const {userLogger, SetRpScreen, fetchFilerReports, shared, loading } = useContext(FeedbackContext)



    const [manv, set_manv] = useState("");
    const [mb, set_mb] = useState(false);
    const [lst_cn_check, set_lst_cn_check] = useState (
        [
            {cn: "CTO016", checked: false},
            {cn: "DNG013" ,checked: false},
            {cn: "DNI015" ,checked: false},
            {cn: "HCM001" ,checked: false},
            {cn: "HNI010" ,checked: false},
            {cn: "HYN017" ,checked: false},
            {cn: "KHA014" ,checked: false},
            {cn: "NAN012" ,checked: false},
            {cn: "MR0001" ,checked: false},
            {cn: "MR0003" ,checked: false},
            {cn: "MR0010" ,checked: false},
            {cn: "MR0011" ,checked: false},
            {cn: "MR0012" ,checked: false},
            {cn: "MR0013" ,checked: false},
            {cn: "MR0014" ,checked: false},
            {cn: "MR0015" ,checked: false},
            {cn: "MR0016" ,checked: false}       
        ]
        
        );
    const handeClick = (e) => {

        let lst = [];
        for (const [index, element] of lst_cn_check.entries()) {
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

    const handleReportSubmit = (e) => {
        var date = new Date;
        var seconds = date.getSeconds().toString();
        var minutes = date.getMinutes().toString();
        var hour = date.getHours().toString();
        const cn = []
        for (let i of lst_cn_check) {
            if (i.checked === true) 
            {cn.push(i.cn)}
        }
        
        e.preventDefault();
        const data = {
            "cn": cn,
            "manv": manv,
            "mb":mb,
            "version":hour+minutes+seconds
        };
        // fetchReport(routesdata);
        console.log(data);
        };

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
            <Form className='ml-5 mt-2' onSubmit={handleReportSubmit}>
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
            </Form>
            <div align="center" className="mt-2" >
            <h1>REPORT</h1>
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

export default TonKhoVaTocDoBan