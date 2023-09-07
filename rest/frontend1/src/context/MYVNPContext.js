import { createContext, useState, useEffect } from "react";
import ChiNhanh from "../data/ChiNhanh";

const MYVNPContext = createContext();

export const MYVNPProvider = ({ children }) => {
  const [chiNhanh, SetChiNhanh] = useState([]);
  const [khvnp, set_khvnp] = useState({});
  const [alert, SetALert] = useState(false);
  const [alertType, SetALertType] = useState("alert-success");
  const [alertText, SetALertText] = useState("SUCCESS");
  const [loading, SetLoading] = useState(false);

  const URL = "https://bi.meraplion.com/myvnp"

  useEffect(() => {
    SetChiNhanh(ChiNhanh);
    console.log("URL", URL);
    console.log(
      "window.location.host ",
      window.location.host,
      window.location.host === "localhost:3000"
    );
  }, []);

  // Post and Update KH
  const post_data = async (data) => {
    SetLoading(true);
    const response = await fetch(`${URL}/create_kh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      SetLoading(false);
      const data = await response.json();
      SetALert(true);
      SetALertType("alert-danger");
      SetALertText("CHƯA THỂ TẠO KH");
      setTimeout(() => SetALert(false), 3000);
    } else {
      SetLoading(false);
      const data = await response.json();
      SetALert(true);
      SetALertType("alert-warning");
      SetALertText("ĐÃ TẠO THÀNH CÔNG");
      setTimeout(() => SetALert(false), 3000);
    }
  }

  // Fetch Ma KH
  const fetchKHVNP = async (id) => {
    SetLoading(true)
    const response = await fetch(`${URL}/get_kh/?makhdms=${id}`);
    const data = await response.json();
    const data_arr = data.data
    console.log(data)
    if (response.ok && data_arr.length > 0 ) {
    console.log(data_arr[0]);
    set_khvnp(data_arr[0]);
    SetLoading(false)
    }

    else {
      const data = {
        "makhdms": "KHONG TIM THAY MA KH",
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

  const post_data_update = async (data) => {
    SetLoading(true)
    const response = await fetch(`${URL}/update_kh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      SetLoading(false);
      const data = await response.json();
      SetALert(true);
      SetALertType("alert-danger");
      SetALertText("CHƯA THỂ LƯU KH");
      setTimeout(() => SetALert(false), 3000);
    } else {
      SetLoading(false);
      const data = await response.json();
      SetALert(true);
      SetALertType("alert-warning");
      SetALertText("ĐÃ LƯU THÀNH CÔNG");
      setTimeout(() => SetALert(false), 3000);
    }
  }
  
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
        post_data,
        post_data_update,
        fetchKHVNP,
        khvnp,
        chiNhanh,
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
