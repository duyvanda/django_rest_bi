import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Login from './components/Login'
import Profile from './components/Profile'
import Cart from './components/Cart'
import ProductDetail from './components/ProductDetail'
import ProductList from './components/ProductList'
import ReportScreen from './components/ReportScreen'
import AboutPage from './pages/AboutPage'
import { FeedbackProvider } from './context/FeedbackContext'

function App() {
  return (
    <FeedbackProvider>
      <Router>
      <Navbar />
        <>
          <Route exact path='/'component={ProductList} />
          <Route path='/cart' component={Cart} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path="/item/:id" component={ReportScreen} />
          <Route path="/product/:id" component={ProductDetail} />
        </>
      </Router>
    </FeedbackProvider>
  )
}

export default App
