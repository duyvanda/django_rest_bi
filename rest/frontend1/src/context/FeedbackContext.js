import { createContext, useState, useEffect } from "react";
import PLReports from "../data/PLReports";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
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

  const URL =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_LURL
      : process.env.REACT_APP_PURL;
  // const URL = process.env.REACT_PRO_URL
  const LOCALURL = "https://bi.meraplion.com/local"

  useEffect(() => {
    getUserInfo();
    console.log("URL", URL);
    console.log(
      "window.location.host ",
      window.location.host,
      window.location.host === "localhost:3000"
    );
  }, []);

  const fetchReports = async (manv) => {
    const response = await fetch(
      "https://storage.googleapis.com/django_media_biteam/public/user_reports.json"
    );
    const data = await response.json();
    const lstreports = data.filter((el) => el.manv === manv);
    const manv_el = manv.substring(0, 2);

    // public reports
    if (manv_el === "EL") {
      setReports(lstreports);
      localStorage.setItem("userLstReports", JSON.stringify(lstreports));
    } else {
      let plreports = PLReports;
      plreports[0].manv = manv;
      lstreports.push(plreports[0]);
      plreports[1].manv = manv;
      lstreports.push(plreports[1]);

      setReports(lstreports);

      // console.log(lstreports)
      localStorage.setItem("userLstReports", JSON.stringify(lstreports));
    }
    // end
  };

  const fetchFilerReports = async (stt, isMB) => {
    // const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/user_reports.json')
    // const data = await response.json()
    const data = JSON.parse(localStorage.getItem("userLstReports"));
    const manv = JSON.parse(localStorage.getItem("userInfo")).manv;
    const lstreports = data.filter((el) => el.manv === manv);
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
    setFilterReports(report_obj);

    if (report_obj) {
      // console.log("is MB", isMB)
      setShared(true);
      const rpvw = isMB ? "95vw" : report_obj.vw;
      setVw(rpvw);
      const rpid = isMB ? report_obj.id_mb : report_obj.id;
      setReportId(rpid);
      const rppr = isMB ? report_obj.param_mb : report_obj.param;
      report_obj.type === 1
        ? setReportParam(rppr.replace("xxxxxx", manv))
        : setReportParam(rppr.replace("xxxxxx", "MR0000"));
      // report_obj.type === 1 ? setReportParam (report_obj.param.replace('xxxxxx', manv)) : setReportParam (report_obj.param.replace('xxxxxx', 'MR0000'));
    } else {
      setShared(false);
    }
  };

  const get_version = () => {
    var date = new Date;
    var seconds = date.getSeconds()< 10 ? '0'+ date.getSeconds().toString() : date.getSeconds().toString();
    var minutes = date.getMinutes()< 10 ? '0'+ date.getMinutes().toString() : date.getMinutes().toString();
    var hour = date.getHours()< 10 ? '0'+ date.getHours().toString() : date.getHours().toString();
    return hour+minutes+seconds
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

  const fetch_real_time_report = async (data_user, rppr) => {
    SetLoading(true)
    const response = await fetch(`${LOCALURL}/ton_phan_bo_hang_hoa/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_user),
    });

    if (!response.ok) {
      SetLoading(false);
      const data = await response.json();
      console.log("reponse not ok", data);
    } else {
      const data = await response.json();
      setReportParam(rppr.replace("xxxxxx", data_user.manv).replace("vvvvvv", data_user.version))
      console.log(rppr.replace("xxxxxx", data_user.manv).replace("vvvvvv", data_user.version))
      console.log("reponse ok", data);
      SetLoading(false);
    }
  }

  const fetchFilerReportsRT = async (stt, isMB, phancap) => {
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
    setFilterReports(report_obj);

    if (report_obj) {
      setShared(true);
      const rpvw = isMB ? "95vw" : report_obj.vw;
      setVw(rpvw);
      const rpid = isMB ? report_obj.id_mb : report_obj.id;
      setReportId(rpid);

      

      // const phancap = report_obj.param === "type0" ? false : true

      const version = get_version()

      const data = {
        "manv":manv,
        "mobile":mobile,
        "version":version,
        "phancap": phancap
      }

      // console.log("data", data)
      const rppr = isMB ? report_obj.param_mb : report_obj.param;

      fetch_real_time_report(data, rppr)

      // setReportParam(rppr.replace("xxxxxx", manv).replace("vvvvvv", version))
      // console.log(rppr.replace("xxxxxx", manv).replace("vvvvvv", version))

      // fetch_real_time_report(data)

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
    const response = await fetch(`${URL}/getstatus/${manv}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logindata),
    });

    const data = await response.json();

    // console.log(data)

    !data.check ? setUserInfo("") : void 0;
    !data.check ? setReports([]) : void 0;
  };

  const loginUser = async (logindata) => {
    setLoginLoading(true);
    const response = await fetch(`${URL}/login/`, {
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
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")));

      const data1 = JSON.parse(localStorage.getItem("userInfo"));
      fetchReports(data1.manv);
      fetchUserStatus(data1.manv, data1.token);
      setLoginLoading(false);
      setLoginText("");
    }
  };

  const changePassUser = async (changedata) => {
    const response = await fetch(`${URL}/changepass/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedata),
    });
    const data = await response.json();
    logoutUser();
  };

  const getUserInfo = () => {
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      const data = JSON.parse(localStorage.getItem("userInfo"));
      // console.log("getUserInfo manv", data)
      setUserInfo(data);
      fetchReports(data.manv);
      fetchUserStatus(data.manv, data.token);
    } else setUserInfo("");
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
        changePassUser,
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
