import { Link } from "react-router-dom";
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect } from 'react'




function ReportScreen({match, history}) {
    const { Reports, fetchFilerReports, shared, vw, ReportId, userLogger, ReportParam, SetRpScreen } = useContext(FeedbackContext)
    // const [MB, setIsDS] = useState(false)

    useEffect(() => {
		if (localStorage.getItem("userInfo")) {
      const media = window.matchMedia('(max-width: 960px)');
      const isMB = (media.matches);
      const dv_width = window.innerWidth;
      // setIsDS(isMB)
      SetRpScreen(true)
      console.log(Reports)
      console.log(typeof(Reports))
      console.log(Reports)
      console.log(Reports.length)
      console.log("stt", match.params.id)
      console.log("type of stt", typeof(match.params.id))
      fetchFilerReports(match.params.id, isMB)
			userLogger(JSON.parse(localStorage.getItem("userInfo")).manv, match.params.id, isMB, dv_width);
		} else {
            history.push('/login');
        };
  // eslint-disable-next-line
	}, []);

    // console.log("reportid", ReportId)

    // let params = {
    //     "manv": `${userInfo.manv}`
    //   };
    // let paramsAsString = JSON.stringify(params);
    // let encodedParams = encodeURIComponent(paramsAsString)

    if (shared) {
      return (
        
        <div align="center" className="border-1 bg-dark" >
          <iframe title="myFrame" frameBorder="0"  src={`https://lookerstudio.google.com/embed/reporting/${ReportId}${ReportParam}`} style={{ border: 1, height: "85vh", frameBorder:"1", width: vw  }} ></iframe>
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