import React from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { Link } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
function Profile({history, location}) {

    const { userInfo, changePassUser } = useContext(FeedbackContext)
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
        const changedata = {
            manv: userInfo.manv,
            email,
            password}
        changePassUser(changedata)
        console.log(changedata)
        history.push("/login")
        setEmail('')
        setPassword('')
    }
    return (
    <div className='container'>
        <Link to="/"> Go Back </Link>
        <p className='mt-2'>{userInfo.manv}</p>
        {/* <p>{userInfo.phanloai.toString()}</p> */}
        <h1>Change Pass</h1>
        <form style={{ display: "inline-block" }} onSubmit={handleSubmit}>
            <label className="form-label">Mật Khẩu Cũ</label>
            <input className="form-control" onChange={handleTextChange} defaultValue={email} type="password" placeholder="Mat Khau Cu" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></input>
            <label className="form-label">Mật Khẩu Mới</label>
            <input className="form-control" onChange={handlePassChange} defaultValue={password} type="password" placeholder="Mat Khau Moi" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none" }}></input>
            <button className="btn btn-dark mt-3" type="submit" >Đổi Mật Khẩu</button>
            <p className='mt-2'>Vui Lòng LOG IN lại sau khi đổi mật khẩu</p>
            <p className='mt-2'>Quên mật khẩu vui lòng liên hệ IT 0909419691</p>
        </form>
    </div>
    )
    }

    export default Profile