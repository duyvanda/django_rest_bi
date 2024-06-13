import React from 'react'
import { useState, useContext, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { Link } from 'react-router-dom'
import { Spinner, Form } from "react-bootstrap";


function Login({history, location}) {
    const { loginUser, userInfo, LoginText, LoginLoading } = useContext(FeedbackContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const location_search = new URLSearchParams(location.search)

    useEffect(() => {

    if (userInfo && location_search.get('redirect'))
      {
        const redirect = location.search.split("&")[0].split("=")[1]
        history.push(redirect);
      }
    else if (userInfo) 
      {
        history.push("/reports");
      }

    else if (location_search.get('utm_source')) {
      const utm_source = location.search.split("&")[0].split("=")[1]
      const manv = location.search.split("&")[1].split("=")[1]
      const token = location.search.split("&")[2].split("=")[1]
      history.push("/login")
      const logindata = {
        email: manv,
        password: token}
    loginUser(logindata)
  }
  else {
    void(0)
  }

	}, [history, userInfo]);
  
  // userInfo

    const handleTextChange = (e) => {
        setEmail(e.target.value)
      }
    
    const handlePassChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const logindata = {
            email,
            password}
        loginUser(logindata)
        setEmail(''); 
        setPassword('');
    }
return (

    !userInfo ?
    <div className="container">
        <h1>Sign In</h1>
        <form style={{ display: "inline-block" }} onSubmit={handleSubmit}>
            <label className="form-label">Mã Nhân Viên</label>
            <Form.Control required onChange={handleTextChange} value={email} type="text" placeholder="Enter Mã NV" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></Form.Control>
            <label className="form-label">Password</label>
            <Form.Control required onChange={handlePassChange} value={password} type="password" placeholder="Enter your password" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></Form.Control>
            <button className="btn btn-dark mt-3" type="submit" >Sign In</button>
            <h5 className='mt-2'> VUI LÒNG ĐĂNG NHẬP BẰNG TÀI KHOẢN CLOUD / BITRIX / EOFFICE  </h5>
            <h5 className='mt-2'> MỌI THẮC MẮC VỀ TÀI KHOẢN VUI LÒNG LIÊN HỆ ANH HUY IT (0902995675 - ZALO) </h5>
            <p className='mt-2'>{LoginText}</p>
        </form>
        {LoginLoading &&
        <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      }
    </div>
    : 
    <div className="container">
    <p>Đăng Nhập Thành Công</p>
    <Link to="/reports">Đi Đến Danh Sách Reports</Link>

    </div>

  )
}
export default Login

// use defaultValue instead of value
// <label className="form-label">Password</label>
// <input className="form-control" type="password" placeholder="Enter your password" style={"border-style: none;background: #f7f7f9;"}></input>
// 1Iujws5qaz2Nl1qcZpJ%01D7%Zb8cH7Fa%ErnFG7@u!M3G$xiL_hz7A$z4L1$Y207QDWUx8TMN2g!8e43jn%zt9qFjJ5vQABwoBET_c2y7owPhZAmU4Tpn!0YbOxk!MF!SO^is8YoKLU4yaj1U$9ftBp_c2y7owPhZAmU4Tpn!0YbOxk!MF!SO^is8YoKLU4yaj1U$9ftBp