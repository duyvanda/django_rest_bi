import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import template from "./formcontrol/template";
import TemplateSimple from "./formcontrol/template_simple";
import Duckdb from  "./formcontrol/duckdb";
import Test from  "./formcontrol/test";
import Postgres from  "./formcontrol/postgres";
import HomeScreen from "./components/HomeScreen";
import PageNotFound from "./components/404Page.jsx";
import { FeedbackProvider } from "./context/FeedbackContext";


function AppContent() {
  // const location = useLocation();
  // const path = location.pathname;
  // const isLogin = path === '/loginabc';
  // const noNavbarPaths = ['/formcontrol/nvbc_introduction', '/formcontrol/nvbc_login', '/formcontrol/nvbc_view_video', '/formcontrol/nvbc_mainpage','/formcontrol/nvbc_view_pdf', '/biagent'];
  // const showNavbar1 = !['/loginabc', ...noNavbarPaths].includes(path);
  // const showNavbar2 = isLogin;

  return (
    <>
      {/* {showNavbar1 && <Navbar1 />}
      {showNavbar2 && <Navbar_NVBC />} */}

      <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route exact path="/formcontrol/test" component={Test} />
          <Route exact path="/formcontrol/template" component={template} />
          <Route exact path="/formcontrol/template_simple" component={TemplateSimple} />
          <Route path="/formcontrol/duckdb" component={Duckdb} />
          <Route path="/formcontrol/postgres" component={Postgres} />
          <Route component={ PageNotFound } />      
      </Switch>
    </>
  );
}

function App() {
  return (
    <FeedbackProvider>
      {/* <MapProvider> */}
          {/* <MYVNPProvider> */}
            <Router>
              <AppContent />
            </Router>
          {/* </MYVNPProvider> */}
      {/* </MapProvider> */}
    </FeedbackProvider>
  );
}

export default App;
