import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HrFormCapNhatCCCD from './components/HrFormCapNhatCCCD'
// import Profile from './components/Profile'
// import Cart from './components/Cart'
// import ProductDetail from './components/ProductDetail'
// import ProductList from './components/ProductList'
// import ReportScreen from './components/ReportScreen'
import FormScreen from './components/FormScreen'
import AboutPage from './components/AboutPage'
import { FeedbackProvider } from './context/FeedbackContext'

function App() {
  return (
    <FeedbackProvider>
      <Router>
      <Navbar />
        <>
          <Route exact path='/'component={HrFormCapNhatCCCD} />
          <Route path='/about' component={AboutPage} />
        </>
      </Router>
    </FeedbackProvider>
  )
}

export default App
