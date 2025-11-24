import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect, useState } from 'react'




function ReportScreen({match, history, location}) {
    const { userInfo, loading, Reports, fetchFilerReports, shared, vw, ReportId, userLogger, ReportParam, SetRpScreen } = useContext(FeedbackContext)
    

    useEffect(() => {
		if (localStorage.getItem("userInfo") ) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      SetRpScreen(true)
      let id = match.params.id
        if (loading===false){
            console.log("Reports", Reports)
            console.log("stt", id)
            console.log("type of stt", typeof(id))
            fetchFilerReports(id, isMB);
            userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, id, isMB, dv_width);
        }
      let location_search = new URLSearchParams(location.search)

      if (location_search.get("params")) {
        let url_param = `?params=${location_search.get("params")}`
        set_search(url_param)
        // console.log("search ",url_param)
      }
      else{ void(0) }
      
		} else {
            history.push('/login');
        };
  // eslint-disable-next-line
	}, [userInfo]);
    const [search, set_search] = useState("")

    // console.log("reportid", ReportId)

    // let params = {
    //     "manv": `${userInfo.manv}`
    //   };
    // let paramsAsString = JSON.stringify(params);
    // let encodedParams = encodeURIComponent(paramsAsString)

    if ( shared && search === "" ) {
      return (
        
        <div align="center" className="border-1 bg-dark" >
          <iframe title="myFrame" frameBorder="0"  src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
        </div>
      )
    }
    else if ( shared && search !== "" ) {
      return (
        
        <div align="center" className="border-1 bg-dark" >
          <iframe title="myFrame" frameBorder="0"  src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${search}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
        </div>
      )

    }
    else {
      return (
      <div className="container">
        <h1>Bạn chưa được cấp quyền truy cập</h1>
        <Link to="/reports">Đi Đến Danh Sách Reports</Link>
      </div>
      )
    }
  }
  
  export default ReportScreen