import { createContext, useState, useEffect } from 'react'
import FeedbackData from '../data/FeedbackData'
import thue_hr_tinhthanh from '../data/thue_hr_tinhthanh'
import thue_hr_quanhuyen from '../data/thue_hr_quanhuyen'
import thue_hr_phuongxa from '../data/thue_hr_phuongxa'
import ChiNhanh from '../data/ChiNhanh'
import PhongBan from '../data/PhongBan'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  // const [feedback, setFeedback] = useState([])
  // const [products, setProducts] = useState([])
  // const [items, setItems] = useState([])
  // const [product, setProduct] = useState("")
  // const [manv, setManv] = useState("")
  // const [userInfo, setUserInfo] = useState([])
  // const [chiNhanh, SetChiNhanh] = useState([])
  // const [tinhthanh, setTinhThanh] = useState([])
  // const [quanhuyen, setQuanHuyen] = useState([])
  // const [phuongxa, setPhuongXa] = useState([])
  // const [alert, SetALert] = useState(false)
  // const [alertType, SetALertType] = useState('alert-success')
  // const [alertText, SetALertText] = useState('SUCCESS')
  // const [loading, SetLoading] = useState(false)

  
  // State Chi Tam
  // const [phongban, SetPhongBan] = useState([])

  const [NhanVien, SetNhanVien] = useState([])
  const [TinhThanh, setTinhThanh] = useState([])
  const [QuanHuyen, setQuanHuyen] = useState([])
  // const [PhuongXa, setPhuongXa] = useState([])
  const [HrTamAlert, setHrTamAlert] = useState(false)
  const [HrTamAlertType, setHrTamAlertType] = useState('alert-success')
  const [HrTamAlertText, setHrTamAlertText] = useState('Thành Công')
  const [HrTamLoading, setHrTamLoading] = useState(false)
  const URL=process.env.REACT_APP_URL
  useEffect(() => {
    fetchTinhThanh()
    // SetChiNhanh(ChiNhanh)
    // SetPhongBan(PhongBan)
    setTinhThanh(thue_hr_tinhthanh)
    setQuanHuyen(thue_hr_quanhuyen)
    // setPhuongXa(thue_hr_phuongxa)

    console.log("URL",URL)
  }, [])

  const fetchTinhThanh = async () => {
      const response = await fetch(`${URL}/tinhthanh/`)
      const data = await response.json() // or .json() or whatever
      // setTinhThanh(data.sucess)
      console.log(data.sucess)
  }

  // const fetchQuanHuyen = async (id) => {
  //     console.log(`${URL}/quanhuyen/${id}`)
  //     const response = await fetch(`${URL}/quanhuyen/${id}`)
  //     // if (!response.ok) throw new Error(response.statusText)
  //     const data = await response.json() // or .json() or whatever
  //     setQuanHuyen(data.sucess)
  //     console.log(data)
  // }

  // const fetchPhuongXa = async (id) => {
  //     const response = await fetch(`${URL}/phuongxa/${id}`)
  //     if (!response.ok) throw new Error(response.statusText)
  //     const data = await response.json() // or .json() or whatever
  //     setPhuongXa(data.sucess)
  //     console.log(data)
  // }

  // const fetchController = new AbortController();
  // const handleSaveForm = async (data) => {
  //   const { signal } = fetchController;
  //   let timmy = setTimeout(() => {
  //     fetchController.abort();
  //     SetLoading(false);
  //     SetALert(true)
  //     SetALertType('alert-danger')
  //     SetALertText('Hệ Thống Đang Quá Tải Vui Lòng Kiểm Tra Lại Xem ĐH Đã Được Tạo Chưa')
  //   }, 10000);
  //   try {
  //     SetLoading(true)
  //     // const response = await fetch(`${URL}/createorder/`)

  //     const response = await fetch(`${URL}/createorder/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //       signal
  //     })

  //     if (!response.ok) {
  //     SetLoading(false)
  //     const data = await response.json()
  //     clearTimeout(timmy);
  //     SetALert(true)
  //     SetALertType('alert-danger')
  //     SetALertText(data.message)
  //     setTimeout(() => SetALert(false),5000)
  //   } else {
  //     SetLoading(false)
  //     const data = await response.json()
  //     clearTimeout(timmy);
  //     // console.log(data)
  //     SetALert(true)
  //     SetALertType('alert-sucess')
  //     SetALertText(data.message)
  //     setTimeout(() => SetALert(false),5000)
  //     // setTimeout(() => SetALert(false),2000)
  //   }
  //     // response.statusText
  //      // or .json() or whatever
  //     // setPhuongXa(data.sucess)
  //     // console.log(data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // const fetchController = new AbortController();
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
    //   setHrTamAlertText('Hệ Thống Đang Quá Tải Vui Lòng Nhập Lại')
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
        setHrTamAlertText('Đã Tạo Form Thành Công')
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

    // console.log("DATAPRODUCTS", products)
  }



  // // Fetch feedback
  // const fetchFeedback = () => {
  //   // setManv(localStorage.getItem("manv"))
  //   // console.log("useEffect manv", manv)
  //   let storage_manv = JSON.parse(localStorage.getItem("manv"))
  //   // console.log("storage manv", storage_manv)
  //   // console.log("feedbackdata", FeedbackData.filter((item) => { return item.rating === storage_manv.text }))

  //   if (storage_manv) {
  //     console.log("context storage_manv", storage_manv)
  //     setFeedback(FeedbackData.filter((item) => { return item.rating === storage_manv.text }))
  //     setManv(storage_manv)
  //     // setFeedback(FeedbackData)
  //   } else {void(0)}
  // }

  // // Add feedback
  // const addFeedback = (newFeedback) => {
    
  //   {newFeedback.text === "" ? void(0) : localStorage.setItem("manv", JSON.stringify(newFeedback))}
  //   {newFeedback.text === "" ? void(0) : setManv(newFeedback)}
  //   console.log("manv in context", newFeedback.text)
  //   setFeedback(FeedbackData.filter((item) => { return item.rating === newFeedback.text }))
  //   // console.log("feedback context is", feedback)
  //   // feedback.map((i) => console.log(i))
  //   // console.log("feedback is", feedback)
  //   console.log("filter feedback add localstorage")

  // }

  // // Delete feedback
  // const deleteFeedback = () => {
  //   // if (window.confirm('Are you sure you want to delete?')) {
  //   // }
  //   window.localStorage.removeItem('manv')
  //   setManv(localStorage.getItem("manv"))
  //   setFeedback(FeedbackData)
  //   console.log("deleted localstorage and setFeedback")
  // }
  

  // // Update feedback item
  // // const updateFeedback = (id, updItem) => {
  // //   setFeedback(
  // //     feedback.map((item) => (item.id === id ? { ...item, ...updItem } : item))
  // //   )
    
  // // }

  // // Set item to be updated
  // // const editFeedback = (item) => {
  // //   setFeedbackEdit({
  // //     item,
  // //     edit: true,
  // //   })
  // // }

  // // update for login

  //   // Add feedback
  //   const loginUser = async (logindata) => {
  //     const response = await fetch('http://127.0.0.1:8000/auth/login/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(logindata),
  //     })
  
  //     const data = await response.json()
  //     localStorage.setItem("userInfo", JSON.stringify(data))
  //     setUserInfo([JSON.parse(localStorage.getItem("userInfo"))])
  //     }

  // const getUserInfo = () => {
  //   if (JSON.parse(localStorage.getItem("userInfo")))
  //   setUserInfo([JSON.parse(localStorage.getItem("userInfo"))])
  //   else setUserInfo([])
  // }

  // const logoutUser = () => {
  //   window.localStorage.removeItem('userInfo')
  //   setUserInfo([])
  // }

  // const fetchProducts = async () => {

  //   const response = await fetch('http://127.0.0.1:8000/auth/products/')

  //   const data = await response.json()

  //   setProducts(data)

  //   // console.log("DATAPRODUCTS", products)
  // }

  // const fetchProductById = async (id) => {

  //   const response = await fetch(`http://127.0.0.1:8000/auth/products/${id}`)

  //   const data = await response.json()

  //   setProduct(data)

  //   // console.log(data)

  // }

  // const addCartItemToCart = (cartItem) => {
  //   const appendArray = [...items, cartItem] 
  //   setItems(appendArray)
  //   localStorage.setItem("cartItems", JSON.stringify(appendArray) )
  // }

  // const getCartInfo = () => {
  //   const data = 
  //   localStorage.getItem("cartItems") ?
    
  //   JSON.parse(localStorage.getItem("cartItems"))
  //   :
  //   []

  //   setItems(data)
  // }

  // const OrderCreate = async (bodydata) => {
  //   // console.log(JSON.stringify(bodydata))
  //   // const response = await fetch('http://127.0.0.1:8000/auth/createorder/', {
  //   //     method: 'POST',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //       'Authorization': 'Bearer '+'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY0NzE5ODE0LCJpYXQiOjE2NjQ3MTk1MTQsImp0aSI6Ijk4ZGJkYWE4NWZmYjQ4Zjk4NzljMDk0NWZmMTkwNWMzIiwidXNlcl9pZCI6MX0.MssIa0HBOKTjS9soYRxBB4L8QEFuup6kKcJGsDh4ebQ'
  //   //     },
  //   //     body: JSON.stringify(bodydata),
  //   //   })
  //   //   const data = await response.json()
  //     // console.log(JSON.stringify(bodydata))
  //     localStorage.removeItem('cartItems')
  //     setItems([])
  // }


  return (
    <FeedbackContext.Provider
      value={{
        // feedback,
        // manv,
        // userInfo,
        // products,
        // feedbackEdit,
        // deleteFeedback,
        // addFeedback,
        // fetchFeedback,
        // loginUser,
        // logoutUser,
        // product,
        // fetchProductById,
        // addCartItemToCart,
        // items,
        // totalPrice,
        // OrderCreate,
        // updateFeedback,
        // chiNhanh,
        // tinhthanh,
        // fetchQuanHuyen,
        // quanhuyen,
        // fetchPhuongXa,
        // phuongxa,
        // handleSaveForm,
        // alert,
        // alertType,
        // alertText,
        // loading,

        // Chi Tam
        fetchNhanVien,
        NhanVien,
        TinhThanh,
        QuanHuyen,
        // PhuongXa,
        handleChiTamData,
        HrTamAlert,
        HrTamAlertType,
        HrTamAlertText,
        HrTamLoading,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
