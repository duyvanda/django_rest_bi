/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
// Mock FeedbackContext for demonstration
const FeedbackContext = React.createContext({
  SetALert: () => {},
  SetALertText: () => {},
  SetALertType: () => {},
  SetLoading: () => {}
});

export default function PriorSelectionComponent() {
  const { SetALert, SetALertText, SetALertType, SetLoading } = useContext(FeedbackContext);
  
  const [priors, setPriors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rules, setRules] = useState('');
  const [programName, setProgramName] = useState('');
  const [moLink, setMoLink] = useState(0);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedPrior, setSelectedPrior] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoadingState] = useState(true);
  const [activeTab, setActiveTab] = useState('offline');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate API call with fake data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fakeData = {
        list_prior: [
          { stt: 1, ten_lua_chon: "Ưu tiên 1" },
          { stt: 2, ten_lua_chon: "Ưu tiên 2" },
          { stt: 3, ten_lua_chon: "Ưu tiên 3" }
        ],
        lst_doctors: [
          { check: false, clean_ten_hcp: "Bác sĩ Nguyễn Văn A", ma_hcp_2: "HCP00022558-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Trần Thị B", ma_hcp_2: "HCP00022559-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Lê Văn C", ma_hcp_2: "HCP00022560-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Phạm Thị D", ma_hcp_2: "HCP00022561-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Hoàng Văn E", ma_hcp_2: "HCP00022562-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Đỗ Thị F", ma_hcp_2: "HCP00022563-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Vũ Văn G", ma_hcp_2: "HCP00022564-H" },
          { check: false, clean_ten_hcp: "Bác sĩ Bùi Thị H", ma_hcp_2: "HCP00022565-H" }
        ],
        quy_tac: `QUY TẮC CHƯƠNG TRÌNH GIÁNG SINH 2024

        1. Điều kiện tham gia:
          - Chỉ áp dụng cho các bác sĩ trong danh sách
          - Mỗi bác sĩ chỉ được chọn một mức ưu tiên
          - Thời gian áp dụng: từ 01/12/2024 đến 24/12/2024

        2. Quy định về ưu tiên:
          - Ưu tiên 1: Ưu tiên cao nhất
          - Ưu tiên 2: Ưu tiên trung bình
          - Ưu tiên 3: Ưu tiên thấp

        3. Lưu ý:
          - Không được thay đổi sau khi đã gửi
          - Mọi thắc mắc liên hệ bộ phận hỗ trợ
          - Chương trình có thể kết thúc sớm nếu hết quà`,
        ten_chuong_trinh: "QUÀ TẶNG GIÁNG SINH 24/12/2024",
        mo_link: 1
      };
      
      setPriors(fakeData.list_prior || []);
      setDoctors(fakeData.lst_doctors || []);
      setRules(fakeData.quy_tac || '');
      setProgramName(fakeData.ten_chuong_trinh || '');
      setMoLink(fakeData.mo_link || 0);
      setLoadingState(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadingState(false);
    }
  };

  const handleDoctorToggle = (maHcp2) => {
    if (selectedDoctors.includes(maHcp2)) {
      setSelectedDoctors(selectedDoctors.filter(id => id !== maHcp2));
    } else {
      setSelectedDoctors([...selectedDoctors, maHcp2]);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.clean_ten_hcp.toLowerCase().includes(searchDoctor.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedDoctors.length === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một bác sĩ.');
      return;
    }
    
    if (!selectedPrior) {
      alert('⚠️ Vui lòng chọn ưu tiên.');
      return;
    }

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccessMessage(`Đã gửi thành công ${selectedDoctors.length} bác sĩ với mức ưu tiên "${selectedPrior}"!`);
    setShowSuccessModal(true);
    setSelectedPrior('');
    setSelectedDoctors([]);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="container py-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="card-title text-primary mb-2">{programName}</h3>
          </div>
        </div>
        
        {/* Tabs */}
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'offline' ? 'active' : ''}`}
              onClick={() => setActiveTab('offline')}
              type="button"
            >
              📋 Offline
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'online' ? 'active' : ''}`}
              onClick={() => setActiveTab('online')}
              type="button"
            >
              🌐 Online
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
              type="button"
            >
              ⚙️ Khác
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="card shadow-sm">
          <div className="card-body">
            {activeTab === 'offline' && (
              <div>
                {moLink !== 1 && (
                  <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img">
                      <use xlinkHref="#exclamation-triangle-fill"/>
                    </svg>
                    <div>Link hiện đã đóng</div>
                  </div>
                )}
                
                {/* Search Box */}
                <div className="mb-4">
                  <label htmlFor="searchDoctor" className="form-label fw-bold">
                    🔍 Tìm kiếm bác sĩ
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="searchDoctor"
                    placeholder="Nhập tên bác sĩ..."
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                  />
                </div>

                {/* Doctor List */}
                <div className="mb-4">
                  <label className="form-label fw-bold">👨‍⚕️ Chọn bác sĩ</label>
                  <div className="list-group" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {filteredDoctors.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <p>Không tìm thấy bác sĩ nào</p>
                      </div>
                    ) : (
                      filteredDoctors.map((doc, idx) => (
                        <label 
                          key={idx}
                          className={`list-group-item list-group-item-action d-flex align-items-center ${
                            selectedDoctors.includes(doc.ma_hcp_2) ? 'active' : ''
                          }`}
                          style={{cursor: 'pointer'}}
                        >
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            checked={selectedDoctors.includes(doc.ma_hcp_2)}
                            onChange={() => handleDoctorToggle(doc.ma_hcp_2)}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{doc.clean_ten_hcp}</div>
                            <small className="text-muted">{doc.ma_hcp_2}</small>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {selectedDoctors.length > 0 && (
                    <div className="alert alert-info mt-3 mb-0">
                      <strong>✓ Đã chọn:</strong> {selectedDoctors.length} bác sĩ
                    </div>
                  )}
                </div>

                {/* Priority Dropdown */}
                <div className="mb-4">
                  <label htmlFor="prioritySelect" className="form-label fw-bold">
                    ⭐ Chọn ưu tiên
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="prioritySelect"
                    value={selectedPrior}
                    onChange={(e) => setSelectedPrior(e.target.value)}
                  >
                    <option value="">-- Chọn ưu tiên --</option>
                    {priors.map((prior) => (
                      <option key={prior.stt} value={prior.ten_lua_chon}>
                        {prior.ten_lua_chon}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex">
                  <button
                    type="button"
                    className="btn btn-info btn-lg flex-fill"
                    onClick={() => setShowRulesModal(true)}
                  >
                    📖 Xem quy tắc chương trình
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg flex-fill"
                    onClick={handleSubmit}
                  >
                    📤 Gửi
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'online' && (
              <div className="text-center py-5">
                <div style={{fontSize: '4rem'}}>🌐</div>
                <h4 className="text-muted mt-3">Chức năng Online đang được phát triển</h4>
                <p className="text-muted">Vui lòng quay lại sau</p>
              </div>
            )}

            {activeTab === 'other' && (
              <div className="text-center py-5">
                <div style={{fontSize: '4rem'}}>⚙️</div>
                <h4 className="text-muted mt-3">Nội dung khác</h4>
                <p className="text-muted">Chức năng bổ sung sẽ có sớm</p>
              </div>
            )}
          </div>
        </div>

        {/* Rules Modal */}
        {showRulesModal && (
          <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">📖 Quy tắc chương trình</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowRulesModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{rules}</pre>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowRulesModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">✅ Thành công</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowSuccessModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <div style={{fontSize: '4rem'}}>🎉</div>
                  <p className="lead mt-3">{successMessage}</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-success" 
                    onClick={() => setShowSuccessModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}