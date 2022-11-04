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
                <div className="container"> <Link to="/" className="navbar-brand">BI TEAM</Link> <button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navcol-1">
                        <ul className="navbar-nav text-start me-auto">
                            <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                            {userInfo[0] ?
                                <>
                                    <li className="nav-item dropdown"><Link className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" to="/"> {userInfo[0] ? userInfo[0].name : ""} </Link>
                                        <div className="dropdown-menu">
                                            <Link className="dropdown-item" to="/profile">Profile</Link>
                                            <Link className="dropdown-item" to="/profile">Products</Link>
                                            <Link className="dropdown-item" onClick={handleClick} to="/">Logout</Link>
                                        </div>
                                    </li>
                                </>
                                :
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                            }
                        </ul>
                        <form className="d-flex">
                            <input className="form-control" type="text" placeholder="Search"></input>
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
  )
}

export default Navbar



//<li className="nav-item"><Link className="nav-link" to="/profile">{userInfo[0] ? "Profile" : "A"}</Link></li>
//<li className="nav-item"><Link className="nav-link" onClick={handleClick} to="/">{userInfo[0] ? "Logout" : "B"}</Link></li>