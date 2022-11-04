import React from 'react'
import { useState, useContext, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'


function Login({history, location}) {
    const { loginUser, userInfo } = useContext(FeedbackContext)
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
        console.log(logindata)
        history.push(redirect)
        setEmail('')
        setPassword('')
    }
return (
    <div className="container">
        <h1>Sign In</h1>
        <form style={{ display: "inline-block" }} onSubmit={handleSubmit}>
            <label className="form-label">Email</label>
            <input className="form-control" onChange={handleTextChange} defaultValue={email} type="email" placeholder="Enter Your Email" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></input>
            <label className="form-label">Password</label>
            <input className="form-control" onChange={handlePassChange} defaultValue={password} type="password" placeholder="Enter your password" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></input>
            <button className="btn btn-dark mt-3" type="submit" >Sign In</button>
        </form>
    </div>
  )
}
export default Login

// use defaultValue instead of value
// <label className="form-label">Password</label>
// <input className="form-control" type="password" placeholder="Enter your password" style={"border-style: none;background: #f7f7f9;"}></input>