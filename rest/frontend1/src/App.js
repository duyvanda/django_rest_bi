// eslint-disable-next-line
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
// import { MYVNPProvider } from "./context/MYVNPContext";
import ReportList from "./components/ReportList";
import TestScreenSize from "./components/TestScreenSize.jsx";
// MAPS
import Maps from "./components/Maps.jsx";
// import MapBox from "./components/MapBox.jsx";
import RoutesComponent from "./components/RoutesComponent.jsx"; // Renamed to avoid conflict
import SalesRoutes from "./components/SalesRoutes.jsx";
//REALTIME
import Ton_Kho_Va_Toc_Do_Ban from "./realtime/Ton_Kho_Va_Toc_Do_Ban";
import Ton_phan_bo_hang_hoa from "./realtime/Ton_phan_bo_hang_hoa";
import Realtime from "./realtime/Realtime";

//FORMCONTROL
// import Theo_doi_bb_giao_nhan_hang_hoa from "./formcontrol/theo_doi_bb_giao_nhan_hang_hoa";
// import Theo_doi_bb_giao_nhan_hang_hoa_mds from "./formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds";
import template from "./formcontrol/template";
import TemplateSimple from "./formcontrol/template_simple";
// import Danh_muc_dau_thau from "./formcontrol/danh_muc_dau_thau";
import Tracking_chi_phi_hcp_qua_tang from "./formcontrol/tracking_chi_phi_hcp_qua_tang";
import Tracking_chi_phi_hcp from "./formcontrol/tracking_chi_phi_hcp";
import Tracking_chi_phi_hcp_qua_tang_crm from "./formcontrol/tracking_chi_phi_hcp_qua_tang_crm";
import Tracking_chi_phi_hcp_qua_tang_bc from "./formcontrol/tracking_chi_phi_hcp_qua_tang_bc";
import Dang_ky_hcp_tham_du_hoi_nghi from "./formcontrol/dang_ky_hcp_tham_du_hoi_nghi";
import Dang_ky_hcp_tham_du_hoi_nghi_crm from "./formcontrol/dang_ky_hcp_tham_du_hoi_nghi_crm";
import FormSeminarHco from "./formcontrol/form_seminar_hco";

import Tracking_chi_phi_hcp_bc from "./formcontrol/tracking_chi_phi_hcp_bc";
// import Wps_dang_ky_vpp from "./formcontrol/wps_dang_ky_vpp";
import Thi_cmsp from "./formcontrol/thi_cmsp";
import Thi_cmsp_hcp from "./formcontrol/thi_cmsp_hcp";
import Thi_cmsp_fmcg from "./formcontrol/thi_cmsp_fmcg";
// import Thi_cmsp_hcp_test from "./formcontrol/thi_cmsp_hcp_test";
import Tao_hcp_bv from "./formcontrol/tao_hcp_bv";
import Tao_hcp_pcl from "./formcontrol/tao_hcp_pcl";
import Tao_hcp_bc from "./formcontrol/tao_hcp_bc";
import Mds_bbgh_bo_sung from "./formcontrol/mds_bbgh_bo_sung";
// import Qua_tri_an_tet_2024 from "./formcontrol/qua_tri_an_tet_2024";
// import Hr_nguoi_phu_thuoc from "./formcontrol/hr_nguoi_phu_thuoc";
import Mds_tra_thuong_cmm_q12025 from "./formcontrol/mds_tra_thuong_cmm_q12025";
import Form_log_checkin_nhan_hang from  "./formcontrol/form_log_checkin_nhan_hang";
import Form_claim_chi_phi_ctp from "./formcontrol/form_claim_chi_phi_ctp";
import Form_claim_chi_phi from  "./formcontrol/form_claim_chi_phi";
import Form_claim_chi_phi_crm from  "./formcontrol/form_claim_chi_phi_crm";
import Form_claim_chi_phi_claimed from  "./formcontrol/form_claim_chi_phi_claimed";
import Form_claim_chi_phi_crm_claimed from  "./formcontrol/form_claim_chi_phi_crm_claimed";

import Get_new_upload_files from  "./formcontrol/get_new_upload_files";

// import Tinh_diem_van_nghe from  "./formcontrol/tinh_diem_van_nghe";
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

import Chat from "./biagent/chat";
import Elevenlabs from "./biagent/elevenlabs";
import Diaflow from "./biagent/diaflow";
// import Qr_scan_quan_ly_tai_san from "./formcontrol/qr_scan_quan_ly_tai_san";
// import Qr_scan_quan_ly_tai_san_v2 from "./formcontrol/qr_scan_quan_ly_tai_san_v2";

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

      <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/crmhome" element={<CrmHome />} />
                <Route path="/login" element={<Login />} />
                {/* REPORT */}
                <Route path="/reports" element={<ReportList />} />
                <Route path="/reportscreen/:id" element={<ReportScreen />} />
                <Route path="/testscreensize" element={<TestScreenSize />} />

                {/* Tồn Kho Và Tốc Độ Bán */}
                <Route path="/ctrlscreen/ton_kho_va_toc_do_ban/:id" element={<Ton_Kho_Va_Toc_Do_Ban />} />
                <Route path="/ctrlscreen/ton_phan_bo_hang_hoa/:id" element={<Ton_phan_bo_hang_hoa />} />
                <Route path="/realtime/:id" element={<Realtime />} />
                {/* Form Control */}
                {/* <Route path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa" element={<Theo_doi_bb_giao_nhan_hang_hoa />} />
                <Route path="/formcontrol/theo_doi_bb_giao_nhan_hang_hoa_mds" element={<Theo_doi_bb_giao_nhan_hang_hoa_mds />} /> */}
                {/* <Route path="/formcontrol/danh_muc_dau_thau" element={<Danh_muc_dau_thau />} /> */}
                <Route path="/formcontrol/test" element={<Test />} />
                <Route path="/formcontrol/template" element={<template />} />
                <Route path="/formcontrol/template_simple" element={<TemplateSimple />} />
                
                <Route path="/formcontrol/excel_kh_bi_thu_hoi_gpp" element={<Excel_kh_bi_thu_hoi_gpp />} />
                <Route path="/formcontrol/excel_thu_hoi_hd_clc" element={<Excel_thu_hoi_hd_clc />} />
                {/* Forms HCP */}
                <Route path="/formcontrol/tracking_chi_phi_hcp_qua_tang" element={<Tracking_chi_phi_hcp_qua_tang />} />
                <Route path="/formcontrol/tracking_chi_phi_hcp_qua_tang_crm" element={<Tracking_chi_phi_hcp_qua_tang_crm />} />
                <Route path="/formcontrol/Tracking_chi_phi_hcp_qua_tang_bc" element={<Tracking_chi_phi_hcp_qua_tang_bc />} />
                
                <Route path="/formcontrol/dang_ky_hcp_tham_du_hoi_nghi" element={<Dang_ky_hcp_tham_du_hoi_nghi />} />                
                <Route path="/formcontrol/dang_ky_hcp_tham_du_hoi_nghi_crm" element={<Dang_ky_hcp_tham_du_hoi_nghi_crm />} />
                <Route path="/formcontrol/form_seminar_hco" element={<FormSeminarHco />} />
                <Route path="/formcontrol/tracking_chi_phi_hcp" element={<Tracking_chi_phi_hcp />} />

                <Route path="/formcontrol/tracking_chi_phi_hcp_bc" element={<Tracking_chi_phi_hcp_bc />} />
                <Route path="/formcontrol/tao_hcp_bv" element={<Tao_hcp_bv />} />
                <Route path="/formcontrol/tao_hcp_pcl" element={<Tao_hcp_pcl />} />
                <Route path="/formcontrol/tao_hcp_bc" element={<Tao_hcp_bc />} />

                <Route path="/formcontrol/form_claim_chi_phi_ctp" element={<Form_claim_chi_phi_ctp />} />
                <Route path="/formcontrol/form_claim_chi_phi" element={<Form_claim_chi_phi />} />
                <Route path="/formcontrol/form_claim_chi_phi_crm" element={<Form_claim_chi_phi_crm />} />
                <Route path="/formcontrol/form_claim_chi_phi_claimed" element={<Form_claim_chi_phi_claimed />} />
                <Route path="/formcontrol/form_claim_chi_phi_crm_claimed" element={<Form_claim_chi_phi_crm_claimed />} />

                <Route path="/formcontrol/mds_bbgh_bo_sung" element={<Mds_bbgh_bo_sung />} />
                {/* <Route path="/formcontrol/wps_dang_ky_vpp" element={<Wps_dang_ky_vpp />} /> */}
                {/* THI CMSP */}
                <Route path="/formcontrol/thi_cmsp_tp" element={<Thi_cmsp />} />
                <Route path="/formcontrol/thi_cmsp_hcp" element={<Thi_cmsp_hcp />} />
                <Route path="/formcontrol/thi_cmsp_fmcg" element={<Thi_cmsp_fmcg />} />
                {/* <Route path="/formcontrol/thi_cmsp_hcp_test" element={<Thi_cmsp_hcp_test />} /> */}

                {/* <Route path="/formcontrol/qua_tri_an_tet_2024" element={<Qua_tri_an_tet_2024 />} /> */}
                {/* <Route path="/formcontrol/hr_nguoi_phu_thuoc" element={<Hr_nguoi_phu_thuoc />} /> */}
                <Route path="/formcontrol/mds_tra_thuong_cmm_q12025" element={<Mds_tra_thuong_cmm_q12025 />} />
                <Route path="/formcontrol/form_ghi_nhan_hang_log" element={<Form_log_checkin_nhan_hang />} />


                <Route path="/formcontrol/get_new_upload_files" element={<Get_new_upload_files />} />
                {/* <Route path="/formcontrol/tinh_diem_van_nghe" element={<Tinh_diem_van_nghe />} /> */}
                <Route path="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh" element={<Dang_ky_nghi_phep_pkh />} />
                <Route path="/formcontrol/dang_ky_nghi_phep_co_ly_do_pkh_ncrm" element={<Dang_ky_nghi_phep_pkh_ncrm />} />

                <Route path="/formcontrol/duckdb" element={<Duckdb />} />
                <Route path="/formcontrol/postgres" element={<Postgres />} />

                {/* <Route path="/formcontrol/qr_scan_quan_ly_tai_san" element={<Qr_scan_quan_ly_tai_san />} />
                <Route path="/formcontrol/qr_scan_quan_ly_tai_san_v2" element={<Qr_scan_quan_ly_tai_san_v2 />} />          */}

                <Route path="/formcontrol/nvbc_login" element={<Nvbc_login />} />
                <Route path="/formcontrol/nvbc_introduction" element={<Nvbc_introduction />} />
                <Route path="/formcontrol/nvbc_mainpage" element={<Nvbc_mainpage />} />
                <Route path="/formcontrol/nvbc_view_pdf" element={<Nvbc_view_pdf />} />
                <Route path="/formcontrol/nvbc_view_video" element={<Nvbc_view_video />} />

                {/* MAPS */}
                <Route path="/maps/sales" element={<Maps />} />
                <Route path="/maps/routes" element={<RoutesComponent />} />
                <Route path="/maps/salesroutes" element={<SalesRoutes />} />
                {/* <Route path="/maps/mapbox" element={<MapBox />} /> */}
                
                <Route path="/biagent" element={<Chat />} />
                <Route path="/elevenlabs" element={<Elevenlabs />} />
                <Route path="/diaflow" element={<Diaflow />} />

                {/* BOOTSTRAP */}
                {/* <Route path="/bootstrap/spacing" element={<Spacing />} /> */}
                <Route path="*" element={ <PageNotFound /> } />

                
              </Routes>
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
