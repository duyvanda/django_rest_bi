import { ButtonGroup, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect, useState } from 'react'




function ReportScreen({match, history}) {
    const { userInfo, Reports, FilterReports, fetchFilerReports, fetchFilerReportsExist, shared, vw, ReportId, userLogger, ReportParam, SetRpScreen } = useContext(FeedbackContext)
    const [MB, setIsDS] = useState(false)
    // const [data_param, setData_Param] = useState('')

    useEffect(() => {
		if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      setIsDS(isMB)
      SetRpScreen(true)
      console.log(Reports)
      console.log(typeof(Reports))
      console.log(Reports)
      console.log(Reports.length)
      // console.log("isMB", isMB)
      // width
      
      //  || document.documentElement.clientWidth || document.body.clientWidth;
      // console.log("dv_width", dv_width)
      console.log("stt", match.params.id)
      console.log("type of stt", typeof(match.params.id))
      fetchFilerReports(match.params.id, isMB)
			userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, match.params.id, isMB, dv_width);

		} else {
            history.push('/login');
        };
	}, []);

    // var vw = "90vw"
    // var vw = "600px"

    console.log("reportid", ReportId)

    let params = {
        "manv": `${userInfo.manv}`
      };
    let paramsAsString = JSON.stringify(params);
    let encodedParams = encodeURIComponent(paramsAsString)

    return (
      shared ?
      <div align="center" className="border-1 bg-dark" >
      <iframe frameBorder="0"  src={`https://datastudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
      </div>
        :
        <div className="container">
        <h1>Khong The Truy Cap</h1>
        <Link to="/reports">Đi Đến Danh Sách Reports</Link>
        </div>
    )
  }
  
  export default ReportScreen
//* 
//<iframe width="600" height="600" src={`https://datastudio.google.com/embed/reporting/${match.params.id}`}  style={{ border: 0 }}></iframe>
//{/* page/2SX2C/ <p>{`https://datastudio.google.com/embed/reporting/${match.params.id}/page/2SX2C/?params=%7B%22df3%22:%22include%25EE%2580%25800%25EE%2580%2580IN%25EE%2580%2580${manv.text}%22%7D`}</p> */}
// style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }}
// <div align="center" className="border-1 bg-dark" >
// match.params.id // ReportId
// <iframe frameBorder="0"  src={`https://datastudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>

{/* <div align="center" className="border-1 bg-dark" >
<iframe frameBorder="0"  src={`https://docs.google.com/spreadsheets/d/e/2PACX-1vQqV-Kkd_blhoRhJwLBuPtOBz7hkPcnsja8E1EPMGPBAPcu0NGDo1By9r-FhwBHYHJkAWZVkX7xdG9i/pubhtml?widget=true&amp;headers=false#gid=0`} ></iframe>
</div> */}

// <iframe src={`https://docs.google.com/spreadsheets/d/e/2PACX-1vQqV-Kkd_blhoRhJwLBuPtOBz7hkPcnsja8E1EPMGPBAPcu0NGDo1By9r-FhwBHYHJkAWZVkX7xdG9i/pubhtml?widget=false&amp;headers=false#gid=0`} style={{ border: 1, height: "100vh", frameBorder:"1", width: "100vw"  }} ></iframe>