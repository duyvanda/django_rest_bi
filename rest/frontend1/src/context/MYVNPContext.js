import { createContext, useState, useEffect } from "react";
import ChiNhanh from "../data/ChiNhanh";
import PLReports from "../data/PLReports";

const MYVNPContext = createContext();

export const MYVNPProvider = ({ children }) => {
  const [chiNhanh, SetChiNhanh] = useState([]);
  const [tinhthanh, setTinhThanh] = useState([]);
  const [khvnp, set_khvnp] = useState({});
  const [quanhuyen, setQuanHuyen] = useState([]);
  const [phuongxa, setPhuongXa] = useState([]);
  const [alert, SetALert] = useState(false);
  const [alertType, SetALertType] = useState("alert-success");
  const [alertText, SetALertText] = useState("SUCCESS");
  const [loading, SetLoading] = useState(false);

  const ABC =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_LURL
      : process.env.REACT_APP_PURL;
  // const URL = process.env.REACT_PRO_URL

  const URL = "http://localhost:5000/feedback"

  useEffect(() => {
    SetChiNhanh(ChiNhanh);
    console.log("URL", URL);
    console.log(
      "window.location.host ",
      window.location.host,
      window.location.host === "localhost:3000"
    );
  }, []);

  // Fetch Ma KH
  const fetchKHVNP = async (id) => {
    SetLoading(true)
    const response = await fetch(`${URL}/?id=${id}`);
    const data = await response.json();
    if (response.ok & data.length >0 ) {
    console.log(data[0]);
    set_khvnp(data[0]);
    SetLoading(false)
    }

    else {
      const data = {
        "id": "KHONG TIM THAY MA KH",
        "makhdms": "",
        "receiverName": "",
        "receiverAddress": "",
        "receiverProvinceCode": "",
        "receiverDistrictCode": "",
        "receiverCommuneCode": "",
        "receiverPhone": "",
        "receiverEmail": ""
      };

      set_khvnp(data);
      SetLoading(false)
    }
  };
  // Fetch TinhThanh
  const fetchTinhThanh = async () => {
    const response = await fetch(`${URL}/tinhthanh/`);
    const data = await response.json(); // or .json() or whatever
    setTinhThanh(data.sucess);
    console.log(data.sucess);
  };
  // Fetch QuanHuyen
  const fetchQuanHuyen = async (id) => {
    console.log(`${URL}/quanhuyen/${id}`);
    const response = await fetch(`${URL}/quanhuyen/${id}`);
    // if (!response.ok) throw new Error(response.statusText)
    const data = await response.json(); // or .json() or whatever
    setQuanHuyen(data.sucess);
    console.log(data);
  };

  const fetchPhuongXa = async (id) => {
    const response = await fetch(`${URL}/phuongxa/${id}`);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json(); // or .json() or whatever
    setPhuongXa(data.sucess);
    console.log(data);
  };

  // const fetchController = new AbortController();
  const handleSaveForm = async (data) => {
    const SoKien_Arr = Array.from(Array(data.Kien).keys());
    const ToTalKien = data.Kien;
    console.log("SoKien", SoKien_Arr, "TotalKien", ToTalKien);

    for (let kien of SoKien_Arr) {
      try {
        SetLoading(true);
        data.Kien = Number(kien) + 1;
        data.ToTalKien = ToTalKien;
        const response = await fetch(`${URL}/createorder/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          SetLoading(false);
          const data = await response.json();
          // clearTimeout(timmy);
          SetALert(true);
          SetALertType("alert-danger");
          SetALertText(data.message);
          setTimeout(() => SetALert(false), 5000);
        } else {
          SetLoading(false);
          const data = await response.json();
          // clearTimeout(timmy);
          SetALert(true);
          SetALertType("alert-sucess");
          SetALertText(data.message + "-kien" + (kien + 1).toString());
          setTimeout(() => SetALert(false), 5000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <MYVNPContext.Provider
      value={{
        fetchKHVNP,
        khvnp,
        fetchTinhThanh,
        chiNhanh,
        tinhthanh,
        fetchQuanHuyen,
        quanhuyen,
        fetchPhuongXa,
        phuongxa,
        handleSaveForm,
        alert,
        alertType,
        alertText,
        loading,
      }}
    >
      {children}
    </MYVNPContext.Provider>
  );
};

export default MYVNPContext;
