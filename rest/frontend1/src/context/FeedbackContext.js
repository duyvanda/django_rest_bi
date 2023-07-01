import { createContext, useState, useEffect } from 'react'
import FeedbackData from '../data/FeedbackData'
import ChiNhanh from '../data/ChiNhanh'
import PLReports from '../data/PLReports'
// import PhongBan from '../data/PhongBan'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([])
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [product, setProduct] = useState("")
  const [manv, setManv] = useState("")
  const [userInfo, setUserInfo] = useState('')
  const [chiNhanh, SetChiNhanh] = useState([])
  const [tinhthanh, setTinhThanh] = useState([])
  const [khvnp, setKHVNP] = useState({})
  const [quanhuyen, setQuanHuyen] = useState([])
  const [phuongxa, setPhuongXa] = useState([])
  const [alert, SetALert] = useState(false)
  const [alertType, SetALertType] = useState('alert-success')
  const [alertText, SetALertText] = useState('SUCCESS')
  const [loading, SetLoading] = useState(false)
  const [rpScreen, SetRpScreen] = useState(false)
  
  // State Chi Tam
  // const [phongban, SetPhongBan] = useState([])
  // const [NhanVien, SetNhanVien] = useState([])
  // const [HrTamAlert, setHrTamAlert] = useState(false)
  // const [HrTamAlertType, setHrTamAlertType] = useState('alert-success')
  // const [HrTamAlertText, setHrTamAlertText] = useState('SUCCESS')
  // const [HrTamLoading, setHrTamLoading] = useState(false)

  // Reports
  const [Reports, setReports] = useState([])
  const [FilterReports, setFilterReports] = useState('')
  const [ReportParam, setReportParam] = useState()
  const [ReportId, setReportId] = useState('')
  // const [ReportType, setReportType] = useState()
  const [LoginText, setLoginText] = useState('')
  const [LoginLoading, setLoginLoading] = useState(false)
  const [shared, setShared] = useState(true)
  const [vw, setVw] = useState("95vw")
  const [map, SetMap] = useState("https://storage.googleapis.com/django_media_biteam/public/maps/default_map.html")
  const [routes, SetRoutes] = useState("https://storage.googleapis.com/django_media_biteam/public/maps/default_map.html")
  // const [mapLoading, SetMapLoading] = useState(false)

  
  const URL = window.location.host==="localhost:3000" ? process.env.REACT_APP_LURL : process.env.REACT_APP_PURL
  // const URL = process.env.REACT_PRO_URL
  useEffect(() => {
    getUserInfo()
    SetChiNhanh(ChiNhanh)
    console.log("URL",URL)
    console.log("window.location.host ",window.location.host, window.location.host==="localhost:3000")
  }, [])

      // Fetch Report
      const fetchReport = async () => {
        void(0)
    }

    const fetchReports = async (manv) => {
      const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/user_reports.json')
      const data = await response.json()
      const lstreports = data.filter(el => el.manv === manv)
      const manv_el = manv.substring(0, 2)

      // public reports
      if (manv_el === 'EL') {
        setReports(lstreports)
        localStorage.setItem("userLstReports", JSON.stringify(lstreports))
      } else
      {
        
        let plreports = PLReports
        plreports[0].manv = manv
        lstreports.push(plreports[0])
        plreports[1].manv = manv
        lstreports.push(plreports[1])
        
        setReports(lstreports)

        // console.log(lstreports)
        localStorage.setItem("userLstReports", JSON.stringify(lstreports))
      }
      // end
    }

    const fetchFilerReports =  async (stt, isMB) => {
      // const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/user_reports.json')
      // const data = await response.json()
      const data = JSON.parse(localStorage.getItem("userLstReports"))
      const manv = JSON.parse(localStorage.getItem("userInfo")).manv
      const lstreports = data.filter(el => el.manv === manv)
      const manv_el = manv.substring(0, 2)

      // public reports
      if (manv_el === 'EL') {
        setReports(lstreports)
      } else
      {
        
        let plreports = PLReports
        plreports[0].manv = manv
        lstreports.push(plreports[0])
        plreports[1].manv = manv
        lstreports.push(plreports[1])
        
        setReports(lstreports)
      }
      // end

      let report_obj = lstreports.filter(el => el.stt === stt)[0]
      setFilterReports(report_obj)

      if (report_obj) {
        // console.log("is MB", isMB)
        setShared(true);
        const rpvw = isMB ? "95vw" : report_obj.vw
        setVw(rpvw)
        const rpid = isMB ? report_obj.id_mb : report_obj.id
        setReportId(rpid)
        const rppr = isMB ? report_obj.param_mb : report_obj.param
        report_obj.type === 1 ? setReportParam (rppr.replace('xxxxxx', manv)) : setReportParam (rppr.replace('xxxxxx', 'MR0000'))
        // report_obj.type === 1 ? setReportParam (report_obj.param.replace('xxxxxx', manv)) : setReportParam (report_obj.param.replace('xxxxxx', 'MR0000'));
      }
      else {
        setShared(false)
      }
      
    } 


    // const fetchFilerReportsExist =  async (id, isMB) => {
    //   const manv = JSON.parse(localStorage.getItem("userInfo")).manv

    //   let report_obj = Reports.filter(el => el.id === id)[0]
    //   setFilterReports(report_obj)

    //   if (report_obj) {
    //     setShared(true);
    //     const rpvw = isMB ? "95vw" : report_obj.vw
    //     setVw(rpvw)
    //     const rpid = isMB ? report_obj.id_mb : report_obj.id
    //     setReportId(rpid)
        
    //     const rppr = isMB ? report_obj.param_mb : report_obj.param
    //     report_obj.type === 1 ? setReportParam (rppr.replace('xxxxxx', manv)) : setReportParam (rppr.replace('xxxxxx', 'MR0000'))

    //   }
    //   else {
    //     setShared(false)
    //   }

    // }

    const clearFilterReport = () => {
      setFilterReports('')
    }

    const userLogger = async (manv, id, ismb, dv_width) => {

      const data = {
        manv,
        id,
        ismb,
        dv_width
      }

      console.log("userLogger", data)

      fetch(`${URL}/userreportlogger/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
    }

    const fetchUserStatus = async (manv, token) => {

      const logindata={token}
      // console.log(logindata)
      const response = await fetch(`${URL}/getstatus/${manv}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logindata),
      })
  
      const data = await response.json()

      // console.log(data)

      !data.check ? setUserInfo('') : void(0);
      !data.check ? setReports([]) : void(0);
  
    }

  
    const loginUser = async (logindata) => {
      setLoginLoading(true)
      const response = await fetch(`${URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logindata),
      })


      if (!response.ok) {
        const data = await response.json()
        setLoginText(data.message)
        setLoginLoading(false)

      } else {
        const data = await response.json()
        localStorage.setItem("userInfo", JSON.stringify(data))
        setUserInfo(JSON.parse(localStorage.getItem("userInfo")))

        const data1 = JSON.parse(localStorage.getItem("userInfo"))
        fetchReports(data1.manv)
        fetchUserStatus(data1.manv, data1.token)
        setLoginLoading(false)
        setLoginText('')
    }

      }

    const changePassUser = async (changedata) => {
      const response = await fetch(`${URL}/changepass/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedata),
      })
      const data = await response.json()
      logoutUser()
    }

  const getUserInfo = () => {
    if (JSON.parse(localStorage.getItem("userInfo")))
    {
    const data = JSON.parse(localStorage.getItem("userInfo"))
    // console.log("getUserInfo manv", data)
    setUserInfo(data)
    fetchReports(data.manv)
    fetchUserStatus(data.manv, data.token)
  }
    else setUserInfo('')
  }

  const logoutUser = () => {
    window.localStorage.removeItem('userInfo')
    window.localStorage.removeItem('userLstReports')
    setUserInfo('')
    setLoginText('')
    setReports([])
    setFilterReports('')
  }

  // Fetch Ma KH
  const fetchMaps = async (mapdata) => {
    SetLoading(true)
    const response = await fetch(`${URL}/map/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapdata),
  })

  if (response.ok) {
  SetLoading(false)
  const data = await response.json() // or .json() or whatever
  SetMap(data.map_string)
  console.log(data)
  } else {
    void(0);
    SetLoading(false);
  }
}

const fetchRoutes = async (routesdata) => {
  SetLoading(true)
  const response = await fetch(`${URL}/routes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(routesdata),
})

if (response.ok) {
SetLoading(false)
const data = await response.json() // or .json() or whatever
SetRoutes(data.map_string)
console.log(data)
} else {
  void(0);
  SetLoading(false);
}
}


  // Fetch Ma KH
  const fetchKHVNP = async (id) => {
    const response = await fetch(`${URL}/getonekhvnp/${id}`)
    const data = await response.json() // or .json() or whatever
    setKHVNP(data)
    console.log(data)
}
  // Fetch TinhThanh
  const fetchTinhThanh = async () => {
      const response = await fetch(`${URL}/tinhthanh/`)
      const data = await response.json() // or .json() or whatever
      setTinhThanh(data.sucess)
      console.log(data.sucess)
  }
  // Fetch QuanHuyen
  const fetchQuanHuyen = async (id) => {
      console.log(`${URL}/quanhuyen/${id}`)
      const response = await fetch(`${URL}/quanhuyen/${id}`)
      // if (!response.ok) throw new Error(response.statusText)
      const data = await response.json() // or .json() or whatever
      setQuanHuyen(data.sucess)
      console.log(data)
  }

  const fetchPhuongXa = async (id) => {
      const response = await fetch(`${URL}/phuongxa/${id}`)
      if (!response.ok) throw new Error(response.statusText)
      const data = await response.json() // or .json() or whatever
      setPhuongXa(data.sucess)
      console.log(data)
  }

  // const fetchController = new AbortController();
  const handleSaveForm = async (data) => {
    const SoKien_Arr = Array.from(Array(data.Kien).keys())
    const ToTalKien = data.Kien
    console.log("SoKien", SoKien_Arr, "TotalKien", ToTalKien)

    for (let kien of SoKien_Arr) {
    try {
      SetLoading(true)
      data.Kien = Number(kien)+1
      data.ToTalKien = ToTalKien
      const response = await fetch(`${URL}/createorder/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      

      if (!response.ok) {
      SetLoading(false)
      const data = await response.json()
      // clearTimeout(timmy);
      SetALert(true)
      SetALertType('alert-danger')
      SetALertText(data.message)
      setTimeout(() => SetALert(false),5000)
    } else {
      SetLoading(false)
      const data = await response.json()
      // clearTimeout(timmy);
      SetALert(true)
      SetALertType('alert-sucess')
      SetALertText(data.message+'-kien'+(kien+1).toString())
      setTimeout(() => SetALert(false),5000)
    }
    } catch (err) {
      console.log(err)
    }
  }
  }

  // const handleChiTamFiles = async (MSNV, Files) => {
  //   console.log(Files)
  //     for (let i of Files) {
  //     const formData = new FormData();
  //     formData.append('file', i)
  //     fetch(`${URL}/uploadfile/${MSNV}`, {
  //     method: 'POST',
  //     body: formData,
  //     })
  //     .then((response) => response.json())
  //     .then((result) => {
  //         console.log('Success:', result);
  //     })
  //     .catch((error) => {
  //         console.error('Error:', error);
  //     });
  //   }
  // }
  
  // const handleChiTamData = async (data, Files) => {
  //   console.log(data)
  //   const MSNV = data.MSNV
  //   try {
  //     setHrTamLoading(true)
  //     const response = await fetch(`${URL}/chitamform/`, {
  //       method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(data)})
  //     if (!response.ok) {
  //       setHrTamLoading(false)
  //       const data = await response.json()
  //       // clearTimeout(timmy);
  //       setHrTamAlert(true)
  //       setHrTamAlertType('alert-danger')
  //       setHrTamAlertText(data.message)
  //       setTimeout(() => setHrTamAlert(false),5000)
  //     } else {
  //       setHrTamLoading(false)
  //       const data = await response.json()
  //       handleChiTamFiles(MSNV, Files)
  //       // clearTimeout(timmy);
  //       setHrTamAlert(true)
  //       setHrTamAlertType('alert-sucess')
  //       setHrTamAlertText(data.message)
  //       setTimeout(() => setHrTamAlert(false),5000)
  //   }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }


  // const fetchNhanVien = async () => {

  //   const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/msnv_ten_records.json')

  //   const data = await response.json()

  //   SetNhanVien(data)
  // }


  // const fetchFeedback = () => {
  //   let storage_manv = JSON.parse(localStorage.getItem("manv"))
  //   if (storage_manv) {
  //     console.log("context storage_manv", storage_manv)
  //     setFeedback(FeedbackData.filter((item) => { return item.rating === storage_manv.text }))
  //     setManv(storage_manv)
  //   } else {void(0)}
  // }
  // const addFeedback = (newFeedback) => {
    
  //   {newFeedback.text === "" ? void(0) : localStorage.setItem("manv", JSON.stringify(newFeedback))}
  //   {newFeedback.text === "" ? void(0) : setManv(newFeedback)}
  //   console.log("manv in context", newFeedback.text)
  //   setFeedback(FeedbackData.filter((item) => { return item.rating === newFeedback.text }))
  //   console.log("filter feedback add localstorage")
  // }

  // Delete feedback
  // const deleteFeedback = () => {
  //   window.localStorage.removeItem('manv')
  //   setManv(localStorage.getItem("manv"))
  //   setFeedback(FeedbackData)
  //   console.log("deleted localstorage and setFeedback")
  // }
  

  // Dummy

  const fetchProducts = async () => {

    const response = await fetch('http://127.0.0.1:8000/auth/products/')

    const data = await response.json()

    setProducts(data)

    // console.log("DATAPRODUCTS", products)
  }

  const fetchProductById = async (id) => {

    const response = await fetch(`http://127.0.0.1:8000/auth/products/${id}`)

    const data = await response.json()

    setProduct(data)

    // console.log(data)

  }

  const addCartItemToCart = (cartItem) => {
    const appendArray = [...items, cartItem] 
    setItems(appendArray)
    localStorage.setItem("cartItems", JSON.stringify(appendArray) )
  }

  const getCartInfo = () => {
    const data = 
    localStorage.getItem("cartItems") ?
    
    JSON.parse(localStorage.getItem("cartItems"))
    :
    []

    setItems(data)
  }

  const OrderCreate = async (bodydata) => {
    // console.log(JSON.stringify(bodydata))
    // const response = await fetch('http://127.0.0.1:8000/auth/createorder/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer '+'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY0NzE5ODE0LCJpYXQiOjE2NjQ3MTk1MTQsImp0aSI6Ijk4ZGJkYWE4NWZmYjQ4Zjk4NzljMDk0NWZmMTkwNWMzIiwidXNlcl9pZCI6MX0.MssIa0HBOKTjS9soYRxBB4L8QEFuup6kKcJGsDh4ebQ'
    //     },
    //     body: JSON.stringify(bodydata),
    //   })
    //   const data = await response.json()
      // console.log(JSON.stringify(bodydata))
      localStorage.removeItem('cartItems')
      setItems([])
  }


  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        manv,
        userInfo,
        products,
        // feedbackEdit,
        loginUser,
        changePassUser,
        logoutUser,
        product,
        fetchProductById,
        addCartItemToCart,
        items,
        // totalPrice,
        OrderCreate,
        // updateFeedback,
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

        // Chi Tam
        // phongban,
        // fetchNhanVien,
        // NhanVien,
        // handleChiTamData,
        // HrTamAlert,
        // HrTamAlertType,
        // HrTamAlertText,
        // HrTamLoading,

        //report
        fetchReport,
        fetchReports,
        Reports,
        LoginText,
        LoginLoading,
        FilterReports,
        fetchFilerReports,
        // fetchFilerReportsExist,
        clearFilterReport,
        ReportParam,
        shared,
        vw,
        ReportId,
        userLogger,
        map,
        fetchMaps,
        routes,
        fetchRoutes,
        rpScreen,
        SetRpScreen
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
