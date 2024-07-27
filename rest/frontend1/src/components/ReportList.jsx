import React from 'react'
import { useState, useContext, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import { FaChartPie } from 'react-icons/fa';

function ReportList({history}) {

  // console.log(window.location.hre, window.location.href==="http://localhost:3000/reports")
  // const URL = window.location.host==="localhost:3000" ? process.env.REACT_APP_LURL : process.env.REACT_APP_PURL
  const { userInfo, Reports, clearFilterReport, SetRpScreen } = useContext(FeedbackContext)


  useEffect(() => {
    SetRpScreen(false)
    // console.log("Reports", Reports)
		if (localStorage.getItem("userInfo")) {
			clearFilterReport()
		} else {
            history.push('/login');
        }
  // eslint-disable-next-line
	}, [history, Reports, userInfo]);

  console.log("Reports", Reports)

  function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  const [SearchReport, setSearchReport] = useState("");

  const handleSearchReport=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchReport(data1)
  }

  return (
    <div className='container'>
      <Form className='mt-2'>
        <Form.Control className='border-1' type="text" style={{ background: "#f7f7f9", fontFamily: "Arial"}} onChange={handleSearchReport} placeholder="Tìm Report" />
      </Form>
      <ul className="list-group">
      {Reports
      .filter(el => el.manv === userInfo.manv)
      .filter(el=> removeAccents(el.tenreport.toLowerCase()).includes(SearchReport))
      .map(el =>
          (
            el.type === 3  ? 
            (
              <li className="list-group-item mt-1 mb-1" key={el.stt}>
                <div className="row" style={{maxHeight:"30px"}}>
                  <div className="col">
                  <Link target="_blank" onClick={e => {console.log('The link was clicked.'); }} style={{textDecoration: "None", color:"black"}} to={`${el.link_report}`} > <p className="text-left text-truncate" style={{ fontWeight: "bold", paddingBottom: "0px" }}><strong><span><FaChartPie style={{ fontWeight: "bold", color: "blue", fontSize:25 }} /> {el.tenreport}</span></strong></p></Link>
                  </div>
                </div>
              </li>
            ) 
            : 
            (
              <li className="list-group-item mt-1 mb-1" key={el.stt}>
                <div className="row" style={{maxHeight:"30px"}} >
                  <div className="col border-dark rounded">
                  <Link target="_blank" onClick={e => {console.log('The link was clicked.'); }} style={{textDecoration: "None", color:"black"}} to={`/reportscreen/${el.stt}`} > <p className="text-left text-truncate" style={{ fontWeight: "bold", paddingBottom: "0px" }}><strong><span><FaChartPie style={{ fontWeight: "bold", color: "blue", fontSize:25 }} /> {el.tenreport}</span></strong></p></Link>
                  </div>
                </div>
              </li>
            )
          )
        )
      }
      </ul>
    </div>
)

}

export default ReportList