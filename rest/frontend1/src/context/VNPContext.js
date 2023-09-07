import { createContext, useState, useEffect } from "react";
import ChiNhanh from "../data/ChiNhanh";

const VNPContext = createContext();

export const VNPProvider = ({ children }) => {
  const [chiNhanh, SetChiNhanh] = useState([]);
  const [tinhthanh, setTinhThanh] = useState([]);
  const [khvnp, setKHVNP] = useState({});
  const [quanhuyen, setQuanHuyen] = useState([]);
  const [phuongxa, setPhuongXa] = useState([]);
  const [alert, SetALert] = useState(false);
  const [alertType, SetALertType] = useState("alert-success");
  const [alertText, SetALertText] = useState("SUCCESS");
  const [loading, SetLoading] = useState(false);

  const URL =
    window.location.host === "localhost:3000"
      ? process.env.REACT_APP_LURL
      : process.env.REACT_APP_PURL;
  // const URL = process.env.REACT_PRO_URL
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
    const response = await fetch(`${URL}/getonekhvnp/${id}`);
    const data = await response.json(); // or .json() or whatever
    setKHVNP(data);
    console.log(data);
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
    <VNPContext.Provider
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
    </VNPContext.Provider>
  );
};

export default VNPContext;
