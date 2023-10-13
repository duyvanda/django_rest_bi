import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Spinner
} from "react-bootstrap";

function Don_treo_cxs( {match,history} ) {

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
        const local_url = "don_treo_cxs"
        fetchFilerReportsRT(rpid, isMB, phancap, local_url, {});
		} else {
            history.push('/login');
        };
	}, []);

    const {userLogger, SetRpScreen, fetchFilerReportsRT, shared, loading, ReportId, ReportParam, vw } = useContext(FeedbackContext)


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

export default Don_treo_cxs