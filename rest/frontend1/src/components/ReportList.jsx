import React, { useState, useContext, useEffect } from 'react';
import FeedbackContext from '../context/FeedbackContext';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { FaChartPie } from 'react-icons/fa';

function ReportList({ history }) {
  const { userInfo, Reports, clearFilterReport, SetRpScreen } = useContext(FeedbackContext);

  useEffect(() => {
    SetRpScreen(false);
    if (localStorage.getItem("userInfo")) {
      clearFilterReport();
    } else {
      history.push('/login');
    }
  // eslint-disable-next-line
  }, [history, Reports, userInfo]);

  function removeAccents(str) {
    const AccentsMap = [
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
    for (let i = 0; i < AccentsMap.length; i++) {
      let re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      let char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  const [SearchReport, setSearchReport] = useState("");

  const handleSearchReport = (e) => {
    let data = e.target.value.toLowerCase();
    let data1 = removeAccents(data);
    setSearchReport(data1);
  };

  return (
    <div className="container mt-4">
      {/* Search Input */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Tìm Report..."
          onChange={handleSearchReport}
          style={{
            background: "#f7f7f9",
            fontFamily: "Arial",
            borderRadius: "8px",
            border: "2px solid #00A79D",
            padding: "10px"
          }}
        />
      </Form>

      {/* Report List */}
      <ul className="list-group">
        {Reports
          .filter(el => el.manv === userInfo.manv)
          .filter(el => removeAccents(el.tenreport.toLowerCase()).includes(SearchReport))
          .map(el => (
            <li
              key={el.stt}
              className="list-group-item mt-2 p-3 border-0 shadow-sm"
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                transition: "transform 0.2s ease-in-out",
                cursor: "pointer"
              }}
            >
              <div className="row align-items-center">
                <div className="col">
                  <Link
                    target="_blank"
                    onClick={() => console.log('The link was clicked.')}
                    style={{
                      textDecoration: "none",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold"
                    }}
                    to={el.type === 3 ? `${el.link_report}` : `/reportscreen/${el.stt}`}
                  >
                    <FaChartPie style={{ color: "#00A79D", fontSize: 25, marginRight: 10 }} />
                    <span className="text-truncate">{el.tenreport}</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ReportList;