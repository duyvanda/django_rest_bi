import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar1 from "./components/Navbar.jsx";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ReportScreen from "./components/ReportScreen";
import FormScreen from "./components/FormScreen";
import VnpEditKH from "./components/VnpEditKH";
import VnpCreateKH from "./components/VnpCreateKH";
import HomeScreen from "./components/HomeScreen";
import { FeedbackProvider } from "./context/FeedbackContext";
import { MapProvider } from "./context/MapContext";
import { VNPProvider } from "./context/VNPContext";
import { MYVNPProvider } from "./context/MYVNPContext";
import ReportList from "./components/ReportList";
import TestScreenSize from "./components/TestScreenSize.jsx";
import Maps from "./components/Maps.jsx";
import Routes from "./components/Routes.jsx";

function App() {
  return (
    <FeedbackProvider>
      <MapProvider>
        <VNPProvider>
          <MYVNPProvider>
            <Router>
              <Navbar1 />
              <>
                <Route exact path="/" component={HomeScreen} />
                <Route path="/formmdsvnpost" component={FormScreen} />
                <Route path="/myvnpost/editkh" component={VnpEditKH} />
                <Route path="/myvnpost/createkh" component={VnpCreateKH} />
                <Route path="/login" component={Login} />
                <Route path="/profile" component={Profile} />
                <Route path="/reports" component={ReportList} />
                <Route path="/reportscreen/:id" component={ReportScreen} />
                <Route path="/testscreensize" component={TestScreenSize} />
                <Route path="/maps/sales" component={Maps} />
                <Route path="/maps/routes" component={Routes} />
              </>
            </Router>
          </MYVNPProvider>
        </VNPProvider>
      </MapProvider>
    </FeedbackProvider>
  );
}

export default App;
