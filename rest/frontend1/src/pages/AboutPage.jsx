import { Link } from 'react-router-dom'
import Card from '../components/shared/Card'
import {useState, useEffect} from 'react'

function AboutPage() {

  // const [mv, SetMv] = useState("")

  // console.log(item)

  

  // const mv = localStorage.getItem("manv")

  // console.log(mv)

  // useEffect(() => {
  //   SetMv(localStorage.getItem("manv"))
	// 	if (mv) {
  //     console.log("there is a user")
	// 		history.push("/");
	// 	}
	// }, [history, mv]);
  return (
    
    <Card>
      <div className='about'>
        <h1>About This Project</h1>
        <p>This is a Static React app to show report list</p>
        <p>Version: 1.0.0</p>

        <p>
          <Link to='/'>Back To Home</Link>
        </p>
      </div>
    </Card>
  )
}

export default AboutPage
