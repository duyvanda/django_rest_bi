import { createContext, useState, useEffect } from "react";
import PLReports from "../data/PLReports";
// import { useHistory, useLocation } from "react-router-dom";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  // eslint-disable-next-line
  const [manv, setManv] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [rpScreen, SetRpScreen] = useState(false);

  // Reports
  const [Reports, setReports] = useState([]);
  const [FilterReports, setFilterReports] = useState("");
  const [ReportParam, setReportParam] = useState();
  const [ReportId, setReportId] = useState("");
  const [LoginText, setLoginText] = useState("");
  const [LoginLoading, setLoginLoading] = useState(false);
  const [shared, setShared] = useState(true);
  const [vw, setVw] = useState("95vw");
  const [loading, SetLoading] = useState(false);
  const [alert, SetALert] = useState(false);
  const [alertType, SetALertType] = useState("alert-success");
  const [alertText, SetALertText] = useState("SUCCESS");
  // const [rt_report, set_rt_report] = useState("https://lookerstudio.google.com/embed/reporting/1ccb8576-9fae-4c46-a757-5a7aa361140d/page/7qYcD");
  // const history = useHistory();
  // const location = useLocation();
  const URL =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_PURL
      : process.env.REACT_APP_PURL;
  // const URL = process.env.REACT_PRO_URL
  const LOCALURL = "https://bi.meraplion.com/local"

  useEffect(() => {
    console.log("getUserInfo() from context");
    getUserInfo();
  // eslint-disable-next-line
  }, []);

  const loginUser = async (logindata) => {
    setLoginLoading(true);
    const response = await fetch(`${URL}/loginv1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logindata),
    });

    if (!response.ok) {
      const data = await response.json();
      setLoginText(data.message);
      setLoginLoading(false);
    } else {
      const data = await response.json();
      console.log("loginUser response", data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));

      const data1 = JSON.parse(localStorage.getItem("userInfo"));
      await fetchReports(data1.manv);
      await fetchUserStatus(data1.manv, data1.token);
      setLoginLoading(false);
      setLoginText("");
    }
  };

  const fetchReports = async (manv) => {
    const response = await fetch(
      "https://storage.googleapis.com/django_media_biteam/public/user_reports.json"
    );
    const data = await response.json();
    const lstreports = data.filter((el) => el.manv === manv);
    const manv_el = manv.substring(0, 2);

    // public reports
    // if (manv_el === "EL") {
    //   setReports(lstreports);
    //   localStorage.setItem("userLstReports", JSON.stringify(lstreports));
    // } else {
    let plreports = PLReports;
    plreports[0].manv = manv;
    lstreports.push(plreports[0]);
    plreports[1].manv = manv;
    lstreports.push(plreports[1]);

    setReports(lstreports);
    console.log(lstreports)
    localStorage.setItem("userLstReports", JSON.stringify(lstreports));
      // console.log("lstreports", lstreports)
    // }
    // end
  };
  

  const fetchFilerReports = (stt, isMB) => {
    let data = JSON.parse(localStorage.getItem("userLstReports"));
    let manv = JSON.parse(localStorage.getItem("userInfo")).manv;
    let lstreports = data.filter((el) => el.manv === manv);
    let manv_int_0 = manv.replaceAll("MR", "11")
    setReports(lstreports);
    let report_obj = lstreports.filter((el) => el.stt === stt)[0];
    console.log("report_obj", report_obj);
    setFilterReports(report_obj);

    if (Object.keys(report_obj).length > 0) {
      setShared(true);
      let rpvw = isMB ? "95vw" : report_obj.vw;
      setVw(rpvw);
      let rpid = isMB ? report_obj.id_mb : report_obj.id;
      setReportId(rpid);
      let rppr = isMB ? report_obj.param_mb : report_obj.param;

      if ( report_obj.type === 1) {
        setReportParam(rppr.replace("xxxxxx", manv).replaceAll("vvvvvv", manv_int_0));
        console.log(rppr.replace("xxxxxx", manv).replaceAll("vvvvvv", manv_int_0));
      }
      else {
        setReportParam(rppr.replace("xxxxxx", "MR0000"));
        console.log(rppr.replace("xxxxxx", "MR0000"));
      }
    } else {
      setShared(false);
    }
  };

  const get_version = () => {
    var date = new Date();
    var seconds = date.getSeconds()< 10 ? '0'+ date.getSeconds().toString() : date.getSeconds().toString();
    var minutes = date.getMinutes()< 10 ? '0'+ date.getMinutes().toString() : date.getMinutes().toString();
    var hour = date.getHours()< 10 ? '0'+ date.getHours().toString() : date.getHours().toString();
    var milliseconds = (date.getMilliseconds() < 10 ) ? '00'+ date.getMilliseconds().toString()
    : (date.getMilliseconds() < 100 ) ? '0'+ date.getMilliseconds().toString()
    : date.getMilliseconds().toString();
    // var milliseconds = date.getMilliseconds().toString();
    return 'T'+hour+minutes+seconds+milliseconds
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  function get_current_dmy() {
      let d = new Date()
      let month = d.getMonth() + 1
      let day = d.getDate()
      let year = d.getFullYear() 
    return [year, month, day];
  }

  function Inserted_at() {
    let datetime = new Date();
    datetime.setHours(datetime.getHours() + 7); // Add 7 hours
    const inserted_at = datetime.toISOString().replace("Z", "");
    return inserted_at;
  }

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

  function get_id() {
    let timestampId = new Date(Date.now() + 7 * 3600000).toISOString().replace(/[-:.TZ]/g, '');
    return timestampId
  }

  const fetch_real_time_report = async (data_user, local_url, rppr) => {
    console.log("fetch_real_time_report", data_user, local_url, rppr)
    try {
      setShared(false)
      SetLoading(true)
      const response = await fetch(`${LOCALURL}/${local_url}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_user),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.log("reponse not ok", data);
        SetLoading(false);
        setShared(false);
      } else {
        const data = await response.json();
        setReportParam(rppr.replaceAll("xxxxxx", data_user.manv).replaceAll("vvvvvv", data_user.version))
        console.log(rppr.replaceAll("xxxxxx", data_user.manv).replaceAll("vvvvvv", data_user.version))
        console.log("reponse ok", data);
        SetLoading(false);
        setShared(true);
      }
    } catch (error) {
      SetLoading(false);
      setShared(false);
      console.log(error);
    }

  }

  const fetchFilerReportsRT = async (stt, isMB, filter_data) => {
    console.log("start funtion fetchFilerReportsRT")
    console.log(stt, isMB, filter_data)
    const data = JSON.parse(localStorage.getItem("userLstReports"));
    const manv = JSON.parse(localStorage.getItem("userInfo")).manv;
    const lstreports = data.filter((el) => el.manv === manv);
    const mobile = isMB;
    const manv_el = manv.substring(0, 2);

    // public reports
    if (manv_el === "EL") {
      setReports(lstreports);
    } else {
      let plreports = PLReports;
      plreports[0].manv = manv;
      lstreports.push(plreports[0]);
      plreports[1].manv = manv;
      lstreports.push(plreports[1]);

      setReports(lstreports);
    }
    // end

    let report_obj = lstreports.filter((el) => el.stt === stt)[0];

    console.log("report_obj context", report_obj)

    setFilterReports(report_obj);

    if (report_obj) {
      const rpvw = isMB ? "95vw" : report_obj.vw;
      setVw(rpvw);
      const rpid = isMB ? report_obj.id_mb : report_obj.id;
      setReportId(rpid);

      const link_report = report_obj.link_report
      const new_local_url = link_report.split('=')[1]
      const new_phancap = String(report_obj.type)==="0" ? false : true;
      console.log("new_phancap", new_phancap);
      const version = get_version()

      const data = {
        "manv":manv,
        "mobile":mobile,
        "version":version,
        "phancap": new_phancap
      }
      const new_data = {...data, ...filter_data}
      console.log("new_data", new_data)
      const rppr = isMB ? report_obj.param_mb : report_obj.param;

      await fetch_real_time_report(new_data, new_local_url, rppr);

    } else {
      setShared(false);
    }
  };



  const clearFilterReport = () => {
    setFilterReports("");
  };

  const userLogger = async (manv, id, ismb, dv_width) => {
    const data = {
      manv,
      id,
      ismb,
      dv_width,
    };

    console.log("userLogger", data);

    fetch(`${URL}/userreportlogger/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const fetchUserStatus = async (manv, token) => {
    const logindata = { token };
    // console.log(logindata)
    const response = await fetch(`${URL}/getstatusv1/${manv}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logindata),
    });

    const data = await response.json();

    console.log("fetchUserStatus response", data)

    !data.check ? setUserInfo("") : void 0;
    !data.check ? setReports([]) : void 0;
    !data.check ? window.localStorage.removeItem("userInfo") : void(0);
    !data.check ? window.localStorage.removeItem("userLstReports") : void(0);
  };



  const getUserInfo = async () => {
    SetLoading(true);
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      const data = JSON.parse(localStorage.getItem("userInfo"));
      console.log("getUserInfo manv", data)
      setUserInfo(data);
      await fetchReports(data.manv);
      await fetchUserStatus(data.manv, data.token);
    SetLoading(false);
    } 
    
    else {
      setUserInfo("");
      SetLoading(false);
    }
    
    
  };

  const logoutUser = () => {
    window.localStorage.removeItem("userInfo");
    window.localStorage.removeItem("userLstReports");
    setUserInfo("");
    setLoginText("");
    setReports([]);
    setFilterReports("");
  };

  return (
    <FeedbackContext.Provider
      value={{
        formatDate,
        get_current_dmy,
        Inserted_at,
        removeAccents,
        get_id,
        loading,
        SetLoading,
        alert,
        SetALert,
        alertText,
        SetALertText,
        alertType,
        SetALertType,
        manv,
        userInfo,
        loginUser,
        logoutUser,
        fetchReports,
        Reports,
        LoginText,
        LoginLoading,
        FilterReports,
        fetchFilerReports,
        fetchFilerReportsRT,
        clearFilterReport,
        ReportParam,
        shared,
        vw,
        ReportId,
        userLogger,
        rpScreen,
        SetRpScreen,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
