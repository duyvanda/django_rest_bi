import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'leaflet/dist/leaflet.css'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar1 from "./components/Navbar.jsx";
// import Navbar_2 from "./components/Navbar_2.jsx";
import Login from "./components/Login";
import ReportScreen from "./components/ReportScreen";
// import FormScreen from "./components/FormScreen";
import PageNotFound from "./components/404Page.jsx";
//MYVNPOST
import VnpHome from "./myvnpost/VnpHome";
import VnpEditKH from "./myvnpost/VnpEditKH";
import VnpCreateKH from "./myvnpost/VnpCreateKH";
import VnpEditCN from "./myvnpost/VnpEditCN";
import VnpCreateCN from "./myvnpost/VnpCreateCN";
import VnpCreateOrder from "./myvnpost/VnpCreateOrder";
//REPORT
import HomeScreen from "./components/HomeScreen";
import { FeedbackProvider } from "./context/FeedbackContext";
import { MapProvider } from "./context/MapContext";
// import { VNPProvider } from "./context/VNPContext";
import { MYVNPProvider } from "./context/MYVNPContext";
import ReportList from "./components/ReportList";
import TestScreenSize from "./components/TestScreenSize.jsx";
// MAPS
import Maps from "./components/Maps.jsx";
import MapBox from "./components/MapBox.jsx";
import Routes from "./components/Routes.jsx";
import SalesRoutes from "./components/SalesRoutes.jsx";
//REALTIME
import Ton_Kho_Va_Toc_Do_Ban from "./realtime/Ton_Kho_Va_Toc_Do_Ban";
import Ton_phan_bo_hang_hoa from "./realtime/Ton_phan_bo_hang_hoa";
import Realtime from "./realtime/Realtime";

//FORMCONTROL
import Theo_doi_bb_giao_nhan_hang_hoa from "./formcontrol/theo_doi_bb_giao_nhan_hang_hoa";
import Theo_doi_bb_giao_nhan_hang_hoa_mds from "./formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds";
import template from "./formcontrol/template";
import TemplateSimple from "./formcontrol/template_simple";
import Danh_muc_dau_thau from "./formcontrol/danh_muc_dau_thau";
import Theo_doi_dccn from "./formcontrol/theo_doi_dccn";
// import Scn_quan_ly_ncc from "./formcontrol/scn_quan_ly_ncc";
// import Scn_quan_ly_nvl from "./formcontrol/scn_quan_ly_nvl";
// import Scn_quan_ly_dmnvl from "./formcontrol/scn_quan_ly_dmnvl";
// import Chuong_trinh_dau_tu_hcp_test from "./formcontrol/chuong_trinh_dau_tu_hcp_test";
import Tracking_chi_phi_hco from "./formcontrol/tracking_chi_phi_hco";
// import Tracking_chi_phi_hco_crm from "./formcontrol/tracking_chi_phi_hco_crm";
import Tracking_chi_phi_hcp from "./formcontrol/tracking_chi_phi_hcp";
import Tracking_chi_phi_hcp_crm from "./formcontrol/tracking_chi_phi_hcp_crm";
// import Tracking_chi_phi_pcl from "./formcontrol/tracking_chi_phi_pcl";
import MdsXuanThinhVuong from "./formcontrol/mds_xuan_thinh_vuong";
import Wps_dang_ky_vpp from "./formcontrol/wps_dang_ky_vpp";
import Thi_cmsp from "./formcontrol/thi_cmsp";
import Thi_cmsp_hcp from "./formcontrol/thi_cmsp_hcp";
import Thi_cmsp_fmcg from "./formcontrol/thi_cmsp_fmcg";

// BOOTSTRAP
import Spacing from "./bootstrap/spacing";
import Display from "./bootstrap/display";

function App() {
  return (
    <FeedbackProvider>
      <MapProvider>
          <MYVNPProvider>
            <Router>
              <Navbar1 />
              <Switch>
                <Route exact path="/" component={HomeScreen} />
                {/* MYVNP */}
                {/* <Route path="/formmdsvnpost" component={FormScreen} /> */}
                <Route exact path="/myvnpost" component={VnpHome} />
                <Route exact path="/myvnpost/editkh" component={VnpEditKH} />
                <Route exact path="/myvnpost/createkh" component={VnpCreateKH} />
                <Route exact path="/myvnpost/editcn" component={VnpEditCN} />
                <Route exact path="/myvnpost/createcn" component={VnpCreateCN} />
                <Route exact path="/myvnpost/createorder" component={VnpCreateOrder} />
                {/* Tồn Kho Và Tốc Độ Bán */}
                <Route exact path="/realtime/ton_kho_va_toc_do_ban/:id" component={Ton_Kho_Va_Toc_Do_Ban} />
                <Route exact path="/realtime/ton_phan_bo_hang_hoa/:id" component={Ton_phan_bo_hang_hoa} />
                <Route exact path="/realtime/:id" component={Realtime} />
                {/* Form Control */}
                <Route exact path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa" component={Theo_doi_bb_giao_nhan_hang_hoa} />
                <Route exact path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds" component={Theo_doi_bb_giao_nhan_hang_hoa_mds} />
                <Route exact path="/formcontrol/danh_muc_dau_thau" component={Danh_muc_dau_thau} />
                <Route exact path="/formcontrol/template" component={template} />
                <Route exact path="/formcontrol/template_simple" component={TemplateSimple} />
                <Route exact path="/formcontrol/theo_doi_dccn" component={Theo_doi_dccn} />
                {/* <Route exact path="/formcontrol/scn_quan_ly_ncc" component={Scn_quan_ly_ncc} />
                <Route exact path="/formcontrol/scn_quan_ly_nvl" component={Scn_quan_ly_nvl} />
                <Route exact path="/formcontrol/scn_quan_ly_dmnvl" component={Scn_quan_ly_dmnvl} /> */}
                <Route exact path="/formcontrol/mds_xuan_thinh_vuong" component={MdsXuanThinhVuong} />
                {/* <Route exact path="/formcontrol/chuong_trinh_dau_tu_hcp_test" component={Chuong_trinh_dau_tu_hcp_test} /> */}
                <Route path="/formcontrol/tracking_chi_phi_hco" component={Tracking_chi_phi_hco} />
                {/* <Route path="/formcontrol/tracking_chi_phi_hco_crm" component={Tracking_chi_phi_hco_crm} /> */}
                <Route exact path="/formcontrol/tracking_chi_phi_hcp" component={Tracking_chi_phi_hcp} />
                <Route exact path="/formcontrol/tracking_chi_phi_hcp_crm" component={Tracking_chi_phi_hcp_crm} />
                {/* <Route exact path="/formcontrol/tracking_chi_phi_pcl" component={Tracking_chi_phi_pcl} /> */}
                <Route exact path="/formcontrol/wps_dang_ky_vpp" component={Wps_dang_ky_vpp} />
                {/* THI CMSP */}
                <Route exact path="/formcontrol/thi_cmsp_tp" component={Thi_cmsp} />
                <Route exact path="/formcontrol/thi_cmsp_hcp" component={Thi_cmsp_hcp} />
                <Route exact path="/formcontrol/thi_cmsp_fmcg" component={Thi_cmsp_fmcg} />
                {/* <Route path="/formcontrol/thi_cmsp_tp_v2" component={Thi_cmsp_tp_v2} /> */}
                {/* REPORT */}
                <Route exact path="/login" component={Login} />
                <Route exact path="/reports" component={ReportList} />
                <Route exact path="/reportscreen/:id" component={ReportScreen} />
                <Route exact path="/testscreensize" component={TestScreenSize} />
                {/* MAPS */}
                <Route exact path="/maps/sales" component={Maps} />
                <Route exact path="/maps/routes" component={Routes} />
                <Route exact path="/maps/salesroutes" component={SalesRoutes} />
                <Route exact path="/maps/mapbox" component={MapBox} />

                {/* BOOTSTRAP */}
                <Route exact path="/bootstrap/spacing" component={Spacing} />
                <Route exact path="/bootstrap/display" component={Display} />
                <Route component={ PageNotFound } />

                
              </Switch>
            </Router>
          </MYVNPProvider>
      </MapProvider>
    </FeedbackProvider>
  );
}

export default App;
