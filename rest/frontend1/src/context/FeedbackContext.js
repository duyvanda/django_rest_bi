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
  const [quanhuyen, setQuanHuyen] = useState([])
  const [phuongxa, setPhuongXa] = useState([])
  const [alert, SetALert] = useState(false)
  const [alertType, SetALertType] = useState('alert-success')
  const [alertText, SetALertText] = useState('SUCCESS')
  const [loading, SetLoading] = useState(false)
  
  // State Chi Tam
  const [phongban, SetPhongBan] = useState([])
  const [NhanVien, SetNhanVien] = useState([])
  const [HrTamAlert, setHrTamAlert] = useState(false)
  const [HrTamAlertType, setHrTamAlertType] = useState('alert-success')
  const [HrTamAlertText, setHrTamAlertText] = useState('SUCCESS')
  const [HrTamLoading, setHrTamLoading] = useState(false)

  // Reports
  const [Reports, setReports] = useState([])
  const [FilterReports, setFilterReports] = useState('')
  const [ReportParam, setReportParam] = useState()
  // const [ReportType, setReportType] = useState()
  const [LoginText, setLoginText] = useState('')
  const [LoginLoading, setLoginLoading] = useState(false)
  const [shared, setShared] = useState(true)
  const [vw, setVw] = useState("95vw")

  
  const URL = window.location.host==="localhost:3000" ? process.env.REACT_APP_LURL : process.env.REACT_APP_PURL
  // const URL = process.env.REACT_PRO_URL
  useEffect(() => {
    // writelogs()
    getUserInfo()
    // fetchTinhThanh()
    // fetchReports()
    SetChiNhanh(ChiNhanh)
    // SetPhongBan(PhongBan)
    console.log("URL",URL)
    console.log("window.location.host ",window.location.host, window.location.host==="localhost:3000")
  }, [])


  // Fetch TinhThanh
  const fetchTinhThanh = async () => {
      const response = await fetch(`${URL}/tinhthanh/`)
      const data = await response.json() // or .json() or whatever
      setTinhThanh(data.sucess)
      console.log(data.sucess)
  }

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

      // Fetch Report
      const fetchReport = async () => {
        void(0)
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        // console.log("fetch report start")
        // console.log(`${URL}/reports/${userInfo.manv}`)
        // const response = await fetch(`${URL}/reports/${userInfo.manv}`)
        // const data = await response.json()
        // setReports(data)
        // console.log("fetch report ", data)
    }

    const fetchReports = async (manv) => {
      const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/user_reports.json')
      const data = await response.json()
      const lstreports = data.filter(el => el.manv === manv)

      // public reports
      let plreports = PLReports
      plreports[0].manv = manv
      lstreports.push(plreports[0])
      plreports[1].manv = manv
      lstreports.push(plreports[1])
      // end

      setReports(lstreports)
    }

    const fetchFilerReports =  async (id, isMB) => {
      const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/user_reports.json')
      const data = await response.json()
      const manv = JSON.parse(localStorage.getItem("userInfo")).manv
      const lstreports = data.filter(el => el.manv === manv)

      // public reports
      let plreports = PLReports
      plreports[0].manv = manv
      lstreports.push(plreports[0])
      plreports[1].manv = manv
      lstreports.push(plreports[1])
      // end

      let report_obj = lstreports.filter(el => el.id === id)[0]
      setFilterReports(report_obj)

      if (report_obj) {
        // console.log("is MB", isMB)
        setShared(true);
        const rpvw = isMB ? "95vw" : report_obj.vw
        setVw(rpvw)
        report_obj.type === 1 ? setReportParam (report_obj.param.replace('xxxxxx', manv)) : setReportParam (report_obj.param.replace('xxxxxx', 'MR0000'));
      }
      else {
        setShared(false)
      }
      
    } 


    const fetchFilerReportsExist =  async (id, isMB) => {
      const manv = JSON.parse(localStorage.getItem("userInfo")).manv
      let report_obj = Reports.filter(el => el.id === id)[0]
      setFilterReports(report_obj)

      if (report_obj) {
        setShared(true);
        const rpvw = isMB ? "90vw" : report_obj.vw
        setVw(rpvw)
        report_obj.type === 1 ? setReportParam (report_obj.param.replace('xxxxxx', manv)) : setReportParam (report_obj.param.replace('xxxxxx', 'MR0000'))

      }
      else {
        setShared(false)
      }

    }

    const clearFilterReport = () => {
      setFilterReports('')
    }

    const userLogger = async (manv, id) => {

      const data = {
        manv,
        id
      }

      console.log(data)

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

  // const fetchController = new AbortController();
  const handleSaveForm = async (data) => {
    const SoKien_Arr = Array.from(Array(data.Kien).keys())
    const ToTalKien = data.Kien
    console.log("SoKien", SoKien_Arr, "TotalKien", ToTalKien)
    // const { signal } = fetchController;
    // let timmy = setTimeout(() => {
    //   fetchController.abort();
    //   SetLoading(false);
    //   SetALert(true)
    //   SetALertType('alert-danger')
    //   SetALertText('Hệ Thống Đang Quá Tải Vui Lòng Kiểm Tra Lại Xem ĐH Đã Được Tạo Chưa')
    // }, 15000);

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

  const handleChiTamFiles = async (MSNV, Files) => {
    console.log(Files)
      for (let i of Files) {
      const formData = new FormData();
      formData.append('file', i)
      fetch(`${URL}/uploadfile/${MSNV}`, {
      method: 'POST',
      body: formData,
      })
      .then((response) => response.json())
      .then((result) => {
          console.log('Success:', result);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
    }
  }
  
  const handleChiTamData = async (data, Files) => {
    console.log(data)
    const MSNV = data.MSNV
    // const { signal } = fetchController;
    // let timmy = setTimeout(() => {
    //   fetchController.abort();
    //   setHrTamLoading(false);
    //   setHrTamAlert(true)
    //   setHrTamAlertType('alert-danger')
    //   setHrTamAlertText('Hệ Thống Đang Quá Tải Vui Lòng Kiểm Tra Lại Xem ĐH Đã Được Tạo Chưa')
    // }, 10000);
    try {
      setHrTamLoading(true)
      const response = await fetch(`${URL}/chitamform/`, {
        method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(data)})
      if (!response.ok) {
        setHrTamLoading(false)
        const data = await response.json()
        // clearTimeout(timmy);
        setHrTamAlert(true)
        setHrTamAlertType('alert-danger')
        setHrTamAlertText(data.message)
        setTimeout(() => setHrTamAlert(false),5000)
      } else {
        setHrTamLoading(false)
        const data = await response.json()
        handleChiTamFiles(MSNV, Files)
        // clearTimeout(timmy);
        setHrTamAlert(true)
        setHrTamAlertType('alert-sucess')
        setHrTamAlertText(data.message)
        setTimeout(() => setHrTamAlert(false),5000)
    }
    } catch (err) {
      console.log(err)
    }
  }


  const fetchNhanVien = async () => {

    const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/msnv_ten_records.json')

    const data = await response.json()

    SetNhanVien(data)
  }



  // Fetch feedback
  const fetchFeedback = () => {
    // setManv(localStorage.getItem("manv"))
    // console.log("useEffect manv", manv)
    let storage_manv = JSON.parse(localStorage.getItem("manv"))
    // console.log("storage manv", storage_manv)
    // console.log("feedbackdata", FeedbackData.filter((item) => { return item.rating === storage_manv.text }))

    if (storage_manv) {
      console.log("context storage_manv", storage_manv)
      setFeedback(FeedbackData.filter((item) => { return item.rating === storage_manv.text }))
      setManv(storage_manv)
      // setFeedback(FeedbackData)
    } else {void(0)}
  }

  // Add feedback
  const addFeedback = (newFeedback) => {
    
    {newFeedback.text === "" ? void(0) : localStorage.setItem("manv", JSON.stringify(newFeedback))}
    {newFeedback.text === "" ? void(0) : setManv(newFeedback)}
    console.log("manv in context", newFeedback.text)
    setFeedback(FeedbackData.filter((item) => { return item.rating === newFeedback.text }))
    // console.log("feedback context is", feedback)
    // feedback.map((i) => console.log(i))
    // console.log("feedback is", feedback)
    console.log("filter feedback add localstorage")

  }

  // Delete feedback
  const deleteFeedback = () => {
    // if (window.confirm('Are you sure you want to delete?')) {
    // }
    window.localStorage.removeItem('manv')
    setManv(localStorage.getItem("manv"))
    setFeedback(FeedbackData)
    console.log("deleted localstorage and setFeedback")
  }
  

  // Update feedback item
  // const updateFeedback = (id, updItem) => {
  //   setFeedback(
  //     feedback.map((item) => (item.id === id ? { ...item, ...updItem } : item))
  //   )
    
  // }

  // Set item to be updated
  // const editFeedback = (item) => {
  //   setFeedbackEdit({
  //     item,
  //     edit: true,
  //   })
  // }

  // update for login

    // Add feedback
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
      // `${URL}/chitamform/`
      const response = await fetch(`${URL}/changepass/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changedata),
      })
  
      const data = await response.json()
      // console.log("changed", data)
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
    setUserInfo('')
    setLoginText('')
    setReports([])
    setFilterReports('')

  }

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
        deleteFeedback,
        addFeedback,
        fetchFeedback,
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
        phongban,
        fetchNhanVien,
        NhanVien,
        handleChiTamData,
        HrTamAlert,
        HrTamAlertType,
        HrTamAlertText,
        HrTamLoading,

        //report
        fetchReport,
        fetchReports,
        Reports,
        LoginText,
        LoginLoading,
        FilterReports,
        fetchFilerReports,
        fetchFilerReportsExist,
        clearFilterReport,
        ReportParam,
        shared,
        vw,
        userLogger
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
