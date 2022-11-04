import React from 'react'
import { useState, useContext, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { Link } from 'react-router-dom'
import { Spinner, Form } from "react-bootstrap";


function Login({history, location}) {
    const { loginUser, userInfo, LoginText, LoginLoading } = useContext(FeedbackContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        
		if (userInfo.length > 0) {
			history.push(redirect);
		} else {
            void(0)       
        }

	}, [history, userInfo, redirect]);

    const handleTextChange = (e) => {
        setEmail(e.target.value.toUpperCase())
      }
    
    const handlePassChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const logindata = {
            email,
            password}
        // console.log(logindata)
        loginUser(logindata)
        // console.log(LoginText)
        // LoginText ==="Ma NV & Password khong dung" ? void(0) : console.log(LoginText); 
        setEmail(''); 
        setPassword('');
        // history.push(redirect)
        // setEmail('')
        // setPassword('')
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