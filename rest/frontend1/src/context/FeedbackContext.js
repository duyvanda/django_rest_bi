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

  const URL =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_LURL
      : process.env.REACT_APP_PURL;
  // const URL = process.env.REACT_PRO_URL
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
