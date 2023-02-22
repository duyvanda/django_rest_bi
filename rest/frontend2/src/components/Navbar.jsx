import React from 'react'
import { Link } from 'react-router-dom'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'


function Navbar() {
    const { userInfo, logoutUser } = useContext(FeedbackContext)

    const handleClick = () => {
        logoutUser()}

    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-md bg-dark">
                <div className="container"> <Link to="/" className="navbar-brand">HR FORM</Link> <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navcol-1">
                    <ul className="navbar-nav text-start me-auto">
                            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
  )
}

export default Navbar



//<li className="nav-item"><Link className="nav-link" to="/profile">{userInfo[0] ? "Profile" : "A"}</Link></li>
//<li className="nav-item"><Link className="nav-link" onClick={handleClick} to="/">{userInfo[0] ? "Logout" : "B"}</Link></li>