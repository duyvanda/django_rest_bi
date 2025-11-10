import React, { useState, useRef } from 'react';
import { validateExcelFile } from '../utils/excelValidator';
import * as XLSX from 'xlsx';

function Upload({ onLogout }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Vui lòng chọn file Excel (.xls hoặc .xlsx)');
      return;
    }

    setSelectedFile(file);
    setValidationResult(null);
    setUploadSuccess(false);

    validateFile(file);
  };

  const validateFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        const result = validateExcelFile(jsonData);
        setValidationResult(result);
      } catch (error) {
        setValidationResult({
          hasError: true,
          errors: [{
            row: 0,
            column: 'File',
            reason: 'Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng file.'
          }]
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Pháp nhân': 'MERAP',
        'Mã KH': '009671',
        'Tên KH': 'Tên khách hàng',
        'Số hợp đồng': '9671/2023/MR',
        'Ngày HL theo Hợp đồng': '2/1/24',
        'Ngày hết HL theo Hợp đồng': '31/12/30',
        'Ngày gia hạn Hợp đồng': '',
        'HL kết thúc hợp đồng sau gia hạn nếu có': '',
        'NGÀY GỞI': '19/1/23',
        'HÌNH THỨC GỞI': 'EMS',
        'NGƯỜI NHẬN': 'CRS Hoàng',
        'NGÀY THU HỒI': 2,
        'THÁNG THU HỒI': 2,
        'NĂM THU HỒI': 2024,
        'THỜI HẠN NỢ': 'Gối 30 ngày',
        'GHI CHÚ': '',
        'MÃ CVBH': 'MR1451',
        'TÊN CVBH': 'Võ Thanh Hoàng',
        'GÍA TRỊ HỢP ĐỒNG': 'Hợp đồng',
        'LINK FILE SCAN HỢP ĐỒNG ĐÃ THU HỒI': 'MR0310'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mẫu dữ liệu');

    XLSX.writeFile(wb, 'Mau_Hop_Dong_Thu_Hoi.xlsx');
  };

  const handleDownloadErrorFile = () => {
    if (!selectedFile || !validationResult || !validationResult.hasError) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      const errorsByRow = {};
      validationResult.errors.forEach(error => {
        const excelRow = error.row; // Đã +2 trong validator (index + header)
        if (!errorsByRow[excelRow]) {
          errorsByRow[excelRow] = [];
        }
        errorsByRow[excelRow].push(`${error.column}: ${error.reason}`);
      });

      if (jsonData.length > 0) {
        jsonData[0].push('LỖI VALIDATION');
      }

      for (let i = 1; i < jsonData.length; i++) {
        const excelRowNumber = i + 1; // +1 vì row 1 là header
        if (errorsByRow[excelRowNumber]) {
          jsonData[i].push(errorsByRow[excelRowNumber].join(' | '));
        } else {
          jsonData[i].push('');
        }
      }

      const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);

      const range = XLSX.utils.decode_range(newWorksheet['!ref']);
      for (let R = 1; R <= range.e.r; R++) {
        const excelRowNumber = R + 1;
        if (errorsByRow[excelRowNumber]) {
          for (let C = range.s.c; C <= range.e.c; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!newWorksheet[cellAddress]) {
              newWorksheet[cellAddress] = { t: 's', v: '' };
            }
            
            newWorksheet[cellAddress].s = {
              fill: {
                fgColor: { rgb: "FFCCCC" } // Màu đỏ nhạt
              },
              font: {
                color: { rgb: "CC0000" } // Chữ đỏ đậm
              }
            };
          }
        }
      }

      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Kết quả kiểm tra');

      const fileName = selectedFile.name.replace(/\.(xlsx|xls)$/i, '_KiemTraLoi.xlsx');
      XLSX.writeFile(newWorkbook, fileName, { cellStyles: true });
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file để tải lên');
      return;
    }

    if (validationResult && validationResult.hasError) {
      alert('File có lỗi. Vui lòng sửa các lỗi trước khi tải lên.');
      return;
    }

    setUploading(true);

    try {
      const manv = localStorage.getItem('employeeCode') || 'MR0310';

      const formData = new FormData();
      formData.append("excelFile", selectedFile);
      formData.append("data", JSON.stringify({ "manv": manv }));

      const response = await fetch("https://bi.meraplion.com/local/upload_excel_thu_hoi_hd_clc/", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();

      const newHistoryItem = {
        id: Date.now(),
        fileName: selectedFile.name,
        uploadDate: new Date().toLocaleString('vi-VN'),
        recordCount: validationResult.validatedData.length,
        fileSize: selectedFile.size,
        fileData: selectedFile,
        manv: manv
      };
      setUploadHistory(prev => [newHistoryItem, ...prev]);

      setUploadSuccess(true);
      setUploading(false);

      alert(`✅ Upload thành công lên Meraplion BI!\n\nFile: ${selectedFile.name}\nSố dòng: ${validationResult.validatedData.length}\nMã NV: ${manv}`);

      setUploadSuccess(true);
      
    } catch (error) {
      console.error('Lỗi khi upload:', error);
      alert(`❌ Có lỗi xảy ra khi upload file lên Meraplion BI.\n\nLỗi: ${error.message}\n\nVui lòng thử lại hoặc liên hệ IT.`);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-container">
      {/* Header với nút đăng xuất */}
      <nav className="navbar navbar-expand-lg navbar-dark mb-3 py-2" style={{ backgroundColor: '#1B2D5A' }}>
        <div className="container">
          <span className="navbar-brand d-flex align-items-center">
            <span className="me-2" style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#00A19A', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-check-lg text-white" style={{ 
                fontSize: '1.2rem',
                display: 'flex'
              }}></i>
            </span>
            Hệ thống Upload Hợp Đồng
          </span>
          <div className="d-flex align-items-center gap-3">
            <div className="text-white">
              <small className="d-inline-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                </svg>
                Mã NV: <strong>{localStorage.getItem('employeeCode') || 'N/A'}</strong>
              </small>
            </div>
            <button 
              className="btn btn-outline-light btn-sm d-inline-flex align-items-center" 
              onClick={onLogout}
              style={{ opacity: 0.7 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          {/* Cột trái: Form upload */}
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header text-white py-2" style={{ backgroundColor: '#00A19A' }}>
                <h5 className="mb-0">Upload File Hợp Đồng Thu Hồi</h5>
              </div>
              <div className="card-body py-3">
                
                {/* Khu vực 1: Drag & Drop Zone */}
                <div className="mb-3">
                  <h6 className="mb-2">1. Chọn file Excel</h6>
                  <div
                    className={`drag-drop-zone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="d-none"
                      accept=".xls,.xlsx"
                      onChange={handleFileChange}
                    />
                    
                    {selectedFile ? (
                      <div className="text-center">
                        <div style={{
                          width: '60px',
                          height: '60px',
                          margin: '0 auto 1rem',
                          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                          animation: 'pulse 2s infinite'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
                          </svg>
                        </div>
                        <div style={{ maxWidth: '280px', margin: '0 auto' }}>
                          <p className="mb-1 fw-bold" style={{ 
                            color: 'var(--meraplion-navy)',
                            wordBreak: 'break-word'
                          }}>
                            {selectedFile.name}
                          </p>
                          <p className="text-muted small mb-3">
                            <i className="bi bi-hdd me-1"></i>
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                          <button 
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                            style={{ 
                              borderRadius: '8px',
                              padding: '0.4rem 1rem',
                              fontSize: '0.875rem'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReset();
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                            </svg>
                            <span>Xóa file</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div style={{
                          width: '60px',
                          height: '60px',
                          margin: '0 auto 1rem',
                          background: 'linear-gradient(135deg, var(--meraplion-teal) 0%, var(--meraplion-dark-teal) 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0, 161, 154, 0.3)'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        </div>
                        <p className="mb-1 fw-semibold" style={{ color: 'var(--meraplion-navy)' }}>
                          Kéo thả file vào đây
                        </p>
                        <p className="text-muted small mb-0">
                          hoặc click để chọn file • 
                          <span className="text-success fw-semibold"> .xls, .xlsx</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Khu vực 2: File mẫu */}
                <div className="mb-3">
                  <h6 className="mb-2">2. Tải file mẫu</h6>
                  <div className="alert alert-info py-2 mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-info-circle me-2"></i>
                        <small>Tải file Excel mẫu để biết cấu trúc dữ liệu cần thiết</small>
                      </div>
                      <button 
                        className="btn btn-sm btn-primary d-inline-flex align-items-center"
                        onClick={handleDownloadTemplate}
                        style={{ 
                          borderRadius: '8px',
                          padding: '0.4rem 1rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                          <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708"/>
                        </svg>
                        <span>Tải file mẫu</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hiển thị kết quả validation */}
                {validationResult && (
                  <div className="mb-3">
                    <h5 className="mb-3">Kết quả kiểm tra</h5>
                    
                    {validationResult.hasError ? (
                      <div className="alert alert-danger py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <small className="mb-0 fw-bold">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            File có lỗi!
                          </small>
                          <div className="d-flex gap-2 align-items-center">
                            <span className="badge bg-danger">
                              {Object.keys(
                                validationResult.errors.reduce((acc, error) => {
                                  acc[error.row] = true;
                                  return acc;
                                }, {})
                              ).length} dòng lỗi
                            </span>
                            <button
                              className="btn btn-sm btn-danger bg-white text-danger border-danger d-inline-flex align-items-center"
                              onClick={handleDownloadErrorFile}
                              title="Tải về file Excel có đánh dấu lỗi"
                              style={{ 
                                borderRadius: '8px',
                                padding: '0.4rem 1rem',
                                fontSize: '0.875rem'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708"/>
                              </svg>
                              <span>Tải file check lỗi</span>
                            </button>
                          </div>
                        </div>
                        <div className="error-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {(() => {
                            const errorsByRow = {};
                            validationResult.errors.forEach(error => {
                              if (!errorsByRow[error.row]) {
                                errorsByRow[error.row] = {
                                  errors: [],
                                  maKH: error.maKH || 'N/A'
                                };
                              }
                              errorsByRow[error.row].errors.push(error);
                            });

                            return Object.entries(errorsByRow).map(([row, data]) => (
                              <div key={row} className="error-item p-2 mb-2 rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-danger" style={{ fontSize: '0.75rem', padding: '0.4em 0.6em' }}>
                                      <i className="bi bi-exclamation-circle me-1"></i>
                                      Dòng {row}
                                    </span>
                                    {data.maKH && data.maKH !== 'N/A' && (
                                      <span className="badge" style={{ 
                                        fontSize: '0.7rem',
                                        backgroundColor: 'var(--meraplion-navy)',
                                        padding: '0.4em 0.6em'
                                      }}>
                                        {data.maKH}
                                      </span>
                                    )}
                                  </div>
                                  <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem' }}>
                                    {data.errors.length} lỗi
                                  </span>
                                </div>
                                <div className="ms-2 mt-1">
                                  {data.errors.map((error, idx) => (
                                    <div key={idx} className="mb-1" style={{ fontSize: '0.85rem' }}>
                                      <i className="bi bi-x-circle text-danger me-1" style={{ fontSize: '0.75rem' }}></i>
                                      <span className="fw-bold">{error.column}:</span>
                                      <span className="text-muted ms-1">{error.reason}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-success">
                        <h6 className="alert-heading">
                          <i className="bi bi-check-circle me-2"></i>
                          ✅ File hợp lệ!
                        </h6>
                        <p className="mb-0">
                          Tổng số dòng dữ liệu: <strong>{validationResult.validatedData.length}</strong>
                        </p>
                        <p className="mb-0 small text-muted mt-1">
                          File đã được xử lý và sẵn sàng để tải lên
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Thông báo thành công */}
                {uploadSuccess && (
                  <div className="alert alert-success" style={{
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    border: 'none',
                    borderLeft: '4px solid #28a745',
                    borderRadius: '12px',
                    animation: 'slideIn 0.5s ease-out'
                  }}>
                    <div className="d-flex align-items-center mb-2">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        <i className="bi bi-check-lg text-white" style={{ 
                          fontSize: '1.5rem',
                          display: 'flex'
                        }}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold" style={{ color: '#155724' }}>
                          Upload thành công lên server!
                        </h6>
                        <small className="text-muted">
                          <i className="bi bi-server me-1"></i>
                          Backend: http://localhost:5001
                        </small>
                      </div>
                    </div>
                    <p className="mb-0">File đã được tải lên server và email thông báo đã được gửi.</p>
                  </div>
                )}

                {/* Khu vực 3: Nút Submit */}
                <div className="text-center">
                  <button
                    className="btn btn-primary btn-lg px-5 fw-bold"
                    style={{ minWidth: '250px' }}
                    onClick={handleSubmit}
                    disabled={!selectedFile || (validationResult && validationResult.hasError) || uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                          <path fillRule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0"/>
                        </svg>
                        Tải lên
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Cột phải: Lịch sử upload */}
          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-header text-white py-2" style={{ backgroundColor: '#00A19A' }}>
                <h6 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Lịch sử Upload
                </h6>
              </div>
              <div className="card-body p-0">
                {uploadHistory.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <i className="bi bi-inbox" style={{ 
                      fontSize: '3rem', 
                      color: '#c5d0de',
                      display: 'block',
                      marginBottom: '1rem'
                    }}></i>
                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>Chưa có file nào được upload</p>
                    <small className="text-muted">Lịch sử sẽ xuất hiện tại đây</small>
                  </div>
                ) : (
                  <div className="upload-history-list">
                    {uploadHistory.map((item) => (
                      <div key={item.id} className="upload-history-item p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <i className="bi bi-file-earmark-excel-fill" style={{ 
                                fontSize: '1.2rem',
                                color: 'var(--meraplion-teal)'
                              }}></i>
                              <strong className="text-truncate" style={{ 
                                maxWidth: '180px',
                                fontSize: '0.9rem'
                              }}>
                                {item.fileName}
                              </strong>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'linear-gradient(135deg, var(--meraplion-teal) 0%, var(--meraplion-dark-teal) 100%)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '8px',
                              padding: '0.25rem 0.5rem',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => {
                              const url = URL.createObjectURL(item.fileData);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = item.fileName;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            title="Tải lại file"
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 161, 154, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        </div>
                        <div className="small text-muted">
                          <div className="d-flex gap-2">
                            <span>
                              <i className="bi bi-calendar3 me-1"></i>
                              {item.uploadDate}
                            </span>
                            <span>|</span>
                            <span>
                              <i className="bi bi-file-text me-1"></i>
                              {item.recordCount} dòng
                            </span>
                            <span>|</span>
                            <span>
                              <i className="bi bi-hdd me-1"></i>
                              {(item.fileSize / 1024).toFixed(2)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Upload;
