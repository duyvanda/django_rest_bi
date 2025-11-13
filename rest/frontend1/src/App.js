import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import Navbar1 from "./components/Navbar.jsx";
import Navbar_NVBC from './components/Navbar_nvbc';
import Login from "./components/Login";
import ReportScreen from "./components/ReportScreen";
import PageNotFound from "./components/404Page.jsx";
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
// import MapBox from "./components/MapBox.jsx";
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
// import Theo_doi_dccn from "./formcontrol/theo_doi_dccn";
// import Scn_quan_ly_ncc from "./formcontrol/scn_quan_ly_ncc";
// import Scn_quan_ly_nvl from "./formcontrol/scn_quan_ly_nvl";
// import Scn_quan_ly_dmnvl from "./formcontrol/scn_quan_ly_dmnvl";
// import Chuong_trinh_dau_tu_hcp_test from "./formcontrol/chuong_trinh_dau_tu_hcp_test";
import Tracking_chi_phi_hco from "./formcontrol/tracking_chi_phi_hco";
// import Tracking_chi_phi_hco_crm from "./formcontrol/tracking_chi_phi_hco_crm";

import Tracking_chi_phi_hcp_qua_tang from "./formcontrol/tracking_chi_phi_hcp_qua_tang";

import Tracking_chi_phi_hcp from "./formcontrol/tracking_chi_phi_hcp";
import Tracking_chi_phi_hcp_qua_tang_crm from "./formcontrol/tracking_chi_phi_hcp_qua_tang_crm";
import Tracking_chi_phi_hcp_qua_tang_bc from "./formcontrol/tracking_chi_phi_hcp_qua_tang_bc";


import Tracking_chi_phi_hcp_bc from "./formcontrol/tracking_chi_phi_hcp_bc";
// import Tracking_chi_phi_pcl from "./formcontrol/tracking_chi_phi_pcl";
// import MdsXuanThinhVuong from "./formcontrol/mds_xuan_thinh_vuong";
import Wps_dang_ky_vpp from "./formcontrol/wps_dang_ky_vpp";
import Thi_cmsp from "./formcontrol/thi_cmsp";
import Thi_cmsp_hcp from "./formcontrol/thi_cmsp_hcp";
import Thi_cmsp_fmcg from "./formcontrol/thi_cmsp_fmcg";
import Thi_cmsp_hcp_test from "./formcontrol/thi_cmsp_hcp_test";
import Tao_hcp_bv from "./formcontrol/tao_hcp_bv";
import Tao_hcp_pcl from "./formcontrol/tao_hcp_pcl";
import Tao_hcp_bc from "./formcontrol/tao_hcp_bc";
import Mds_bbgh_bo_sung from "./formcontrol/mds_bbgh_bo_sung";
import Qua_tri_an_tet_2024 from "./formcontrol/qua_tri_an_tet_2024";
import Hr_nguoi_phu_thuoc from "./formcontrol/hr_nguoi_phu_thuoc";
import Mds_tra_thuong_cmm_q12025 from "./formcontrol/mds_tra_thuong_cmm_q12025";
import Form_log_checkin_nhan_hang from  "./formcontrol/form_log_checkin_nhan_hang";
import Cong_tac_phi from "./formcontrol/cong_tac_phi";
import Form_claim_chi_phi from  "./formcontrol/form_claim_chi_phi";
import Form_claim_chi_phi_crm from  "./formcontrol/form_claim_chi_phi_crm";
import Form_claim_chi_phi_claimed from  "./formcontrol/form_claim_chi_phi_claimed";
import Form_claim_chi_phi_crm_claimed from  "./formcontrol/form_claim_chi_phi_crm_claimed";

import Get_new_upload_files from  "./formcontrol/get_new_upload_files";

import Tinh_diem_van_nghe from  "./formcontrol/tinh_diem_van_nghe";
import Dang_ky_nghi_phep_pkh from  "./formcontrol/dang_ky_nghi_phep_pkh";
import Dang_ky_nghi_phep_pkh_ncrm from  "./formcontrol/dang_ky_nghi_phep_pkh_ncrm";
import CrmHome from  "./formcontrol/crmhome";

import Workflow from  "./formcontrol/workflow";
import Excel_kh_bi_thu_hoi_gpp from  "./formcontrol/excel_kh_bi_thu_hoi_gpp";

import Excel_thu_hoi_hd_clc from  "./formcontrol/excel_thu_hoi_hd_clc";

import Test from  "./formcontrol/test";
import Duckdb from  "./formcontrol/duckdb";
import Postgres from  "./formcontrol/postgres";

import Nvbc_login from  "./formcontrol/nvbc_login";
import Nvbc_introduction from  "./formcontrol/nvbc_introduction";
import Nvbc_mainpage from  "./formcontrol/nvbc_mainpage";
import Nvbc_view_pdf from  "./formcontrol/nvbc_view_pdf";
import Nvbc_view_video from  "./formcontrol/nvbc_view_video";

// import Introduction from  "./formcontrol/introduction";

// import Kt_de_xuat_chi_phi from  "./formcontrol/kt_de_xuat_chi_phi";



import Chat from "./biagent/chat";
import Elevenlabs from "./biagent/elevenlabs";
import Diaflow from "./biagent/diaflow";
import Qr_scan_quan_ly_tai_san from "./formcontrol/qr_scan_quan_ly_tai_san";
import Qr_scan_quan_ly_tai_san_v2 from "./formcontrol/qr_scan_quan_ly_tai_san_v2";

// BOOTSTRAP
// import Spacing from "./bootstrap/spacing";
// import Display from "./bootstrap/display";
// import EbookProject from "./bootstrap/EbookProject.jsx";


function AppContent() {
  const location = useLocation();

  const path = location.pathname;

  const isLogin = path === '/loginabc';
  const noNavbarPaths = ['/formcontrol/nvbc_introduction', '/formcontrol/nvbc_login', '/formcontrol/nvbc_view_video', '/formcontrol/nvbc_mainpage','/formcontrol/nvbc_view_pdf', '/biagent'];

  // Explanation:
  // noNavbarPaths is a list of paths that should show no nav at all.
  // Then we use .includes() to check if the current path is in that list.
  const showNavbar1 = !['/loginabc', ...noNavbarPaths].includes(path);
  
  const showNavbar2 = isLogin; // ONLY show Navbar2 on /login

  return (
    <>
      {showNavbar1 && <Navbar1 />}
      {showNavbar2 && <Navbar_NVBC />}

      <Switch>
                <Route exact path="/" component={HomeScreen} />
                {/* MYVNP */}
                {/* <Route path="/formmdsvnpost" component={FormScreen} /> */}
                {/* <Route exact path="/myvnpost" component={VnpHome} />
                <Route exact path="/myvnpost/editkh" component={VnpEditKH} />
                <Route exact path="/myvnpost/createkh" component={VnpCreateKH} />
                <Route exact path="/myvnpost/editcn" component={VnpEditCN} />
                <Route exact path="/myvnpost/createcn" component={VnpCreateCN} />
                <Route exact path="/myvnpost/createorder" component={VnpCreateOrder} /> */}
                {/* Tồn Kho Và Tốc Độ Bán */}
                <Route exact path="/ctrlscreen/ton_kho_va_toc_do_ban/:id" component={Ton_Kho_Va_Toc_Do_Ban} />
                <Route exact path="/ctrlscreen/ton_phan_bo_hang_hoa/:id" component={Ton_phan_bo_hang_hoa} />
                <Route exact path="/realtime/:id" component={Realtime} />
                {/* Form Control */}
                <Route exact path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa" component={Theo_doi_bb_giao_nhan_hang_hoa} />
                <Route exact path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds" component={Theo_doi_bb_giao_nhan_hang_hoa_mds} />
                <Route exact path="/formcontrol/danh_muc_dau_thau" component={Danh_muc_dau_thau} />
                <Route exact path="/formcontrol/test" component={Test} />
                <Route exact path="/formcontrol/template" component={template} />
                <Route exact path="/formcontrol/template_simple" component={TemplateSimple} />
                {/* <Route exact path="/formcontrol/theo_doi_dccn" component={Theo_doi_dccn} />
                {/* <Route exact path="/formcontrol/scn_quan_ly_ncc" component={Scn_quan_ly_ncc} />
                <Route exact path="/formcontrol/scn_quan_ly_nvl" component={Scn_quan_ly_nvl} />
                <Route exact path="/formcontrol/scn_quan_ly_dmnvl" component={Scn_quan_ly_dmnvl} /> */}
                {/* <Route exact path="/formcontrol/mds_xuan_thinh_vuong" component={MdsXuanThinhVuong} /> */}
                {/* <Route exact path="/formcontrol/chuong_trinh_dau_tu_hcp_test" component={Chuong_trinh_dau_tu_hcp_test} /> */}
                {/* <Route path="/formcontrol/tracking_chi_phi_hco" component={Tracking_chi_phi_hco} /> */}
                
                <Route path="/formcontrol/excel_kh_bi_thu_hoi_gpp" component={Excel_kh_bi_thu_hoi_gpp} />
                <Route path="/formcontrol/excel_thu_hoi_hd_clc" component={Excel_thu_hoi_hd_clc} />
                <Route path="/workflow" component={Workflow} />
                <Route path="/crmhome" component={CrmHome} />
                <Route path="/formcontrol/tracking_chi_phi_hcp_qua_tang" component={Tracking_chi_phi_hcp_qua_tang} />
                <Route exact path="/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" component={Tracking_chi_phi_hcp_qua_tang_crm} />
                <Route exact path="/formcontrol/Tracking_chi_phi_hcp_qua_tang_bc" component={Tracking_chi_phi_hcp_qua_tang_bc} />
                
                {/* <Route path="/formcontrol/tracking_chi_phi_hco_crm" component={Tracking_chi_phi_hco_crm} /> */}
                <Route exact path="/formcontrol/tracking_chi_phi_hcp" component={Tracking_chi_phi_hcp} />

                <Route exact path="/formcontrol/tracking_chi_phi_hcp_bc" component={Tracking_chi_phi_hcp_bc} />
                {/* <Route exact path="/formcontrol/tracking_chi_phi_pcl" component={Tracking_chi_phi_pcl} /> */}
                <Route exact path="/formcontrol/tao_hcp_bv" component={Tao_hcp_bv} />
                <Route exact path="/formcontrol/tao_hcp_pcl" component={Tao_hcp_pcl} />
                <Route exact path="/formcontrol/tao_hcp_bc" component={Tao_hcp_bc} />
                <Route exact path="/formcontrol/mds_bbgh_bo_sung" component={Mds_bbgh_bo_sung} />
                <Route exact path="/formcontrol/wps_dang_ky_vpp" component={Wps_dang_ky_vpp} />
                {/* THI CMSP */}
                <Route exact path="/formcontrol/thi_cmsp_tp" component={Thi_cmsp} />
                <Route exact path="/formcontrol/thi_cmsp_hcp" component={Thi_cmsp_hcp} />
                <Route exact path="/formcontrol/thi_cmsp_fmcg" component={Thi_cmsp_fmcg} />
                <Route path="/formcontrol/thi_cmsp_hcp_test" component={Thi_cmsp_hcp_test} />
                <Route path="/formcontrol/qua_tri_an_tet_2024" component={Qua_tri_an_tet_2024} />
                <Route path="/formcontrol/hr_nguoi_phu_thuoc" component={Hr_nguoi_phu_thuoc} />
                <Route path="/formcontrol/mds_tra_thuong_cmm_q12025" component={Mds_tra_thuong_cmm_q12025} />
                <Route path="/formcontrol/form_ghi_nhan_hang_log" component={Form_log_checkin_nhan_hang} />
                <Route path="/formcontrol/cong_tac_phi" component={Cong_tac_phi} />
                <Route path="/formcontrol/form_claim_chi_phi" component={Form_claim_chi_phi} />
                <Route path="/formcontrol/form_claim_chi_phi_crm" component={Form_claim_chi_phi_crm} />
                <Route path="/formcontrol/form_claim_chi_phi_claimed" component={Form_claim_chi_phi_claimed} />
                <Route path="/formcontrol/form_claim_chi_phi_crm_claimed" component={Form_claim_chi_phi_crm_claimed} />
                <Route path="/formcontrol/get_new_upload_files" component={Get_new_upload_files} />
                <Route path="/formcontrol/tinh_diem_van_nghe" component={Tinh_diem_van_nghe} />
                <Route path="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh" component={Dang_ky_nghi_phep_pkh} />
                <Route path="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh_ncrm" component={Dang_ky_nghi_phep_pkh_ncrm} />
                <Route path="/formcontrol/duckdb" component={Duckdb} />
                <Route path="/formcontrol/postgres" component={Postgres} />

                <Route path="/formcontrol/qr_scan_quan_ly_tai_san" component={Qr_scan_quan_ly_tai_san} />
                <Route path="/formcontrol/qr_scan_quan_ly_tai_san_v2" component={Qr_scan_quan_ly_tai_san_v2} />         

                <Route exact path="/formcontrol/nvbc_login" component={Nvbc_login} />
                <Route exact path="/formcontrol/nvbc_introduction" component={Nvbc_introduction} />
                <Route exact path="/formcontrol/nvbc_mainpage" component={Nvbc_mainpage} />
                <Route exact path="/formcontrol/nvbc_view_pdf" component={Nvbc_view_pdf} />
                <Route exact path="/formcontrol/nvbc_view_video" component={Nvbc_view_video} />


                {/* <Route exact path="/formcontrol/introduction" component={Introduction} /> */}
                {/* <Route path="/formcontrol/tinh_diem_van_nghe" component={Tinh_diem_van_nghe} /> */}
                {/* REPORT */}
                <Route exact path="/login" component={Login} />
                <Route exact path="/reports" component={ReportList} />
                <Route exact path="/reportscreen/:id" component={ReportScreen} />
                <Route exact path="/testscreensize" component={TestScreenSize} />
                {/* MAPS */}
                <Route exact path="/maps/sales" component={Maps} />
                <Route exact path="/maps/routes" component={Routes} />
                <Route exact path="/maps/salesroutes" component={SalesRoutes} />
                {/* <Route exact path="/maps/mapbox" component={MapBox} /> */}
                
                <Route exact path="/biagent" component={Chat} />
                <Route exact path="/elevenlabs" component={Elevenlabs} />
                <Route exact path="/diaflow" component={Diaflow} />

                {/* BOOTSTRAP */}
                {/* <Route exact path="/bootstrap/spacing" component={Spacing} /> */}
                <Route component={ PageNotFound } />

                
              </Switch>
    </>
  );
}

function App() {
  return (
    <FeedbackProvider>
      <MapProvider>
          {/* <MYVNPProvider> */}
            <Router>
              <AppContent />
            </Router>
          {/* </MYVNPProvider> */}
      </MapProvider>
    </FeedbackProvider>
  );
}

export default App;
