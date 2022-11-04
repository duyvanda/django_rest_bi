import React from 'react'
import { useEffect } from 'react'


function HomeScreen({history}) {

    useEffect(() => {
    history.push("/reports");
    console.log("Data")
	}, [history]);
  return (
    <div className='container'>HomeScreen</div>
  )
}

export default HomeScreen