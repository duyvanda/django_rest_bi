import { createContext, useState, useEffect } from 'react'
import FeedbackData from '../data/FeedbackData'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([])
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [product, setProduct] = useState("")
  const [manv, setManv] = useState("")
  const [userInfo, setUserInfo] = useState([])
  // const [cartItems, setCartItems] = useState(
  //   localStorage.getItem("cartItems")
	// ? JSON.parse(localStorage.getItem("cartItems"))
	// : []
  // )
  // const [feedbackEdit, setFeedbackEdit] = useState({
  //   item: {},
  //   edit: false,
  // })

  useEffect(() => {
    fetchFeedback()
    getUserInfo()
    fetchProducts()
    getCartInfo()
  }, [])

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
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logindata),
      })
  
      const data = await response.json()
      localStorage.setItem("userInfo", JSON.stringify(data))
      setUserInfo([JSON.parse(localStorage.getItem("userInfo"))])
      }

  const getUserInfo = () => {
    if (JSON.parse(localStorage.getItem("userInfo")))
    setUserInfo([JSON.parse(localStorage.getItem("userInfo"))])
    else setUserInfo([])
  }

  const logoutUser = () => {
    window.localStorage.removeItem('userInfo')
    setUserInfo([])
  }

  const fetchProducts = async () => {

    const response = await fetch('http://127.0.0.1:8000/auth/products/')

    const data = await response.json()

    setProducts(data)

    console.log("DATAPRODUCTS", products)
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
        logoutUser,
        product,
        fetchProductById,
        addCartItemToCart,
        items,
        // totalPrice,
        OrderCreate,
        // updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
