import React from 'react'
import { useEffect } from 'react'


import { useNavigate } from 'react-router-dom';

function HomeScreen() {
    const navigate = useNavigate();

    useEffect(() => {
    navigate("/reports");
    // console.log("Data")
	}, [navigate]);
  return (
    <div className='container'>HomeScreen</div>
  )
}

export default HomeScreen