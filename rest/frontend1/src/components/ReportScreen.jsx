import { ButtonGroup, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect, useState } from 'react'




function ReportScreen({match, history}) {
    const { userInfo, Reports, FilterReports, fetchFilerReports, fetchFilerReportsExist, ReportParam } = useContext(FeedbackContext)
    const [MB, setIsDS] = useState(false)
    // const [data_param, setData_Param] = useState('')

    useEffect(() => {
		if (localStorage.getItem("userInfo")) {
			void(0)
		} else {
            history.push('/login');
        };
    const media = window.matchMedia('(max-width: 960px)');
    const isMB = (media.matches)
    setIsDS(isMB)
    console.log(Reports.length)
    Reports.length === 0 ? fetchFilerReports(match.params.id) : fetchFilerReportsExist(match.params.id)
	}, []);

    // var vw = "90vw"
    // var vw = "600px"

    let params = {
        "manv": `${userInfo.manv}`
      };
    let paramsAsString = JSON.stringify(params);
    let encodedParams = encodeURIComponent(paramsAsString)

  const filter_Reports = Reports.filter(el => el.id===match.params.id)
  const shared = filter_Reports.map(el=> el.manv).includes(userInfo.manv)
  const vw = MB ? "90vw" : filter_Reports.map(el=> el.vw)[0]
  // console.log("vw and mb", vw, MB, ReportParam)

    return (
      shared ?
        <div>
          {/* <Link to="/"><Button className="mr-1" variant="primary" size="sm">Go Back</Button></Link> */}
            <div align="center" className="border-1 bg-dark" >
            <iframe frameBorder="0" className="border-1" src={`https://datastudio.google.com/embed/reporting/${match.params.id}${ReportParam}`}  style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} allowFullScreen></iframe>
            </div>
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
