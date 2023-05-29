

import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar1 from './components/Navbar.jsx'
// import HrFormCapNhatCCCD from './components/HrFormCapNhatCCCD'
import Login from './components/Login'
import Profile from './components/Profile'
// import ProductDetail from './components/ProductDetail'
// import FeedbackList from './components/FeedbackList'
import ReportScreen from './components/ReportScreen'
import FormScreen from './components/FormScreen'
import HomeScreen from './components/HomeScreen'
import { FeedbackProvider } from './context/FeedbackContext'
import ReportList from './components/ReportList'
import TestScreenSize from './components/TestScreenSize.jsx'

function App() {
  return (
    <FeedbackProvider>
      <Router>
      <Navbar1 />
        <>
        <Route exact path='/'component={HomeScreen} />
          <Route path='/formmdsvnpost'component={FormScreen} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path='/reports' component={ReportList} />
          <Route path="/reportscreen/:id" component={ReportScreen} />
          <Route path='/testscreensize' component={TestScreenSize} />
        </>
      </Router>
    </FeedbackProvider>
  )
}

export default App
