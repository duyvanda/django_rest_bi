import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'leaflet/dist/leaflet.css'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar1 from "./components/Navbar.jsx";
import Login from "./components/Login";
import ReportScreen from "./components/ReportScreen";
// import FormScreen from "./components/FormScreen";
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
import { VNPProvider } from "./context/VNPContext";
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
import Scn_quan_ly_ncc from "./formcontrol/scn_quan_ly_ncc";
import Scn_quan_ly_nvl from "./formcontrol/scn_quan_ly_nvl";
import Scn_quan_ly_dmnvl from "./formcontrol/scn_quan_ly_dmnvl";
import Chuong_trinh_dau_tu_hcp_test from "./formcontrol/chuong_trinh_dau_tu_hcp_test";
import Tracking_chi_phi_hco from "./formcontrol/tracking_chi_phi_hco";
import Crm_tracking_chi_phi_hco from "./formcontrol/crm_tracking_chi_phi_hco";
import Tracking_chi_phi_hcp from "./formcontrol/tracking_chi_phi_hcp";
import Tracking_chi_phi_pcl from "./formcontrol/tracking_chi_phi_pcl";
import MdsXuanThinhVuong from "./formcontrol/mds_xuan_thinh_vuong";
import Wps_dang_ky_vpp from "./formcontrol/wps_dang_ky_vpp";

function App() {
  return (
    <FeedbackProvider>
      <MapProvider>
          <MYVNPProvider>
            <Router>
              <Navbar1 />
              <>
                <Route exact path="/" component={HomeScreen} />
                {/* MYVNP */}
                {/* <Route path="/formmdsvnpost" component={FormScreen} /> */}
                <Route exact path="/myvnpost" component={VnpHome} />
                <Route path="/myvnpost/editkh" component={VnpEditKH} />
                <Route path="/myvnpost/createkh" component={VnpCreateKH} />
                <Route path="/myvnpost/editcn" component={VnpEditCN} />
                <Route path="/myvnpost/createcn" component={VnpCreateCN} />
                <Route path="/myvnpost/createorder" component={VnpCreateOrder} />
                {/* Tồn Kho Và Tốc Độ Bán */}
                <Route path="/realtime/ton_kho_va_toc_do_ban/:id" component={Ton_Kho_Va_Toc_Do_Ban} />
                <Route path="/realtime/ton_phan_bo_hang_hoa/:id" component={Ton_phan_bo_hang_hoa} />
                <Route exact path="/realtime/:id" component={Realtime} />
                {/* Form Control */}
                <Route path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa" component={Theo_doi_bb_giao_nhan_hang_hoa} />
                <Route path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds" component={Theo_doi_bb_giao_nhan_hang_hoa_mds} />
                <Route path="/formcontrol/danh_muc_dau_thau" component={Danh_muc_dau_thau} />
                <Route path="/formcontrol/template" component={template} />
                <Route path="/formcontrol/template_simple" component={TemplateSimple} />
                <Route path="/formcontrol/theo_doi_dccn" component={Theo_doi_dccn} />
                <Route path="/formcontrol/scn_quan_ly_ncc" component={Scn_quan_ly_ncc} />
                <Route path="/formcontrol/scn_quan_ly_nvl" component={Scn_quan_ly_nvl} />
                <Route path="/formcontrol/scn_quan_ly_dmnvl" component={Scn_quan_ly_dmnvl} />
                <Route path="/formcontrol/mds_xuan_thinh_vuong" component={MdsXuanThinhVuong} />
                <Route path="/formcontrol/chuong_trinh_dau_tu_hcp_test" component={Chuong_trinh_dau_tu_hcp_test} />
                <Route path="/formcontrol/tracking_chi_phi_hco" component={Tracking_chi_phi_hco} />
                <Route path="/formcontrol/crm_tracking_chi_phi_hco" component={Crm_tracking_chi_phi_hco} />
                <Route path="/formcontrol/tracking_chi_phi_hcp" component={Tracking_chi_phi_hcp} />
                <Route path="/formcontrol/tracking_chi_phi_pcl" component={Tracking_chi_phi_pcl} />
                <Route path="/formcontrol/wps_dang_ky_vpp" component={Wps_dang_ky_vpp} />
                {/* REPORT */}
                <Route path="/login" component={Login} />
                <Route path="/reports" component={ReportList} />
                <Route path="/reportscreen/:id" component={ReportScreen} />
                <Route path="/testscreensize" component={TestScreenSize} />
                {/* MAPS */}
                <Route path="/maps/sales" component={Maps} />
                <Route path="/maps/routes" component={Routes} />
                <Route path="/maps/salesroutes" component={SalesRoutes} />
                <Route path="/mapbox" component={MapBox} />
              </>
            </Router>
          </MYVNPProvider>
      </MapProvider>
    </FeedbackProvider>
  );
}

export default App;

{/* <Route path="/realtime/don_treo_cxs/:id" component={Don_treo_cxs} />
<Route path="/realtime/thu_hoi_bb_giao_hang/:id" component={Thu_hoi_bb_giao_hang} />
<Route path="/realtime/voucher_du_lich/:id" component={Voucher_du_lich} />
<Route path="/realtime/thu_hoi_bbgh/:id" component={Thu_hoi_bbgh} /> */}

// import Don_treo_cxs from "./realtime/Don_treo_cxs";
// import Thu_hoi_bb_giao_hang from "./realtime/Thu_hoi_bb_giao_hang";
// import Voucher_du_lich from "./realtime/Voucher_du_lich";
// import Thu_hoi_bbgh from "./realtime/Thu_hoi_bbgh";
