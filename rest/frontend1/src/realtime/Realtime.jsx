/* eslint-disable */
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import {
    Spinner, Modal, Button
} from "react-bootstrap";

function Realtime( {match, history, location} ) {

    const {userInfo, userLogger, SetRpScreen, fetchFilerReportsRT, shared, loading, ReportId, ReportParam, vw } = useContext(FeedbackContext)

    useEffect(() => {
		if (localStorage.getItem("userInfo")) {
        const media = window.matchMedia('(max-width: 960px)');
        const isMB = (media.matches);
        const dv_width = window.innerWidth;
        const stt = match.params.id
        userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, stt , isMB, dv_width);
        SetRpScreen(true);
        if (loading===false){
            fetchFilerReportsRT(stt, isMB, {});
        }
		} else {
            history.push('/login');
        };
    // eslint-disable-next-line
	}, [userInfo]);

    
    
return (
<div>
<Modal show={loading===true | shared === false} centered aria-labelledby="contained-modal-title-vcenter" size="sm">
<Button variant="secondary" disabled> <Spinner animation="grow" size="sm"/> Đang tải...</Button>
</Modal>
{ (loading===false && shared ===true ) &&
<div align="center" className="border-1 bg-dark" >
<iframe title="myFrame" frameBorder="0"  src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
</div>
}
</div>
);
}

export default Realtime