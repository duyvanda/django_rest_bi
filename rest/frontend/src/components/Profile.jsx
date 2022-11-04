import React from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

function Profile() {

    const { userInfo } = useContext(FeedbackContext)
    return (
    <div>
        <Link to="/"> Go Back </Link>
        <p>{userInfo[0].name}</p>
        <p>{userInfo[0].is_Admin.toString()}</p>
        <p>{userInfo[0].email}</p>
        <p>{userInfo[0]._id}</p>
    </div>
    )
    }

    export default Profile