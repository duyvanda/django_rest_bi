import React from 'react'
import {Button, Dropdown, DropdownButton} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useContext, useState, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { Spinner } from "react-bootstrap";


function HrFormCapNhatCCCD() {

  const noiCap = [
    {
        "id":1,
        "data": "Cục cảnh sát ĐKQL Cư trú và DLQG về dân cư"
    },
    {
        "id":2,
        "data": "Cục cảnh sát quản lý hành chính về trật tự xã hội"
    },
]
  // FROM CONTEXT
  const { phongban, handleChiTamData, HrTamAlert, HrTamAlertType, HrTamAlertText, HrTamLoading } = useContext(FeedbackContext)
  // STATES
  const [NhanVien, setNhanVien] = useState([]);
  const [FilterNhanVien, setFilterNhanVien] = useState([]);
  const [Search, setSearch] = useState('');
  const [MSNV, setMsnv] = useState('');
  const [HoVaTen, setHoVaTen] = useState('empty');
  const [PhongBan, setPhongBan] = useState('');
  const [CCCD, setCCCD] = useState('');
  const [NgayCap, setNgayCap] = useState('');
  const [NoiCap, setNoiCap] = useState('');
  const [SoNha, setSoNha] = useState('');
  const [Tinh, setTinh] = useState('');
  const [Quan, setQuan] = useState('');
  const [Phuong, setPhuong] = useState('');
  const [SoNha2, setSoNha2] = useState('');
  const [Tinh2, setTinh2] = useState('');
  const [Quan2, setQuan2] = useState('');
  const [Phuong2, setPhuong2] = useState('');
  const [SDT, setSDT] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    fetchNhanVien()
  }, [])

  const fetchNhanVien = async () => {

    const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/msnv_ten_records.json')

    const data = await response.json()

    setNhanVien(data)

  }

  const handleSearchParam=(e)=>{

    setFilterNhanVien(NhanVien.filter(el => el.name
      .includes(removeAccents(e.target.value.toLowerCase())))
      .slice(0, 20))
  }
const uploadDataAndFiles = (e) => {
  e.preventDefault();
  const data = {
    MSNV: MSNV.split(' - ')[0],
    HoVaTen: MSNV.split(' - ')[1],
    PhongBan,
    CCCD,
    NgayCap,
    NoiCap,
    SoNha,
    Tinh,
    Quan,
    Phuong,
    SoNha2,
    Tinh2,
    Quan2,
    Phuong2,
    SDT}
    
    handleChiTamData(data, selectedFile)
}
function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"    
  ];
  for (var i=0; i<AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

    // const URL=process.env.REACT_APP_URL
    // for (let i of selectedFile) {
    //   const formData = new FormData();
    //   formData.append('file', i)
    //   fetch(`${URL}/uploadfile/`, {
    //   method: 'POST',
    //   body: formData,
    //   })
    //   .then((response) => response.json())
    //   .then((result) => {
    //       console.log('Success:', result);
    //   })
    //   .catch((error) => {
    //       console.error('Error:', error);
    //   });
    // }

  return (
    
    <div className="container mt-5">
      <div className="container">
      <div className="row">
    <div className="col-md-8 offset-md-2 text-bg-dark">
    <h1 className="text-center mt-3">Cập nhật CCCD vào mã số thuế</h1>
    <p>* Required</p>
    <Form className="mt-2" noValidate={false} onSubmit={uploadDataAndFiles} >
      <label className="form-label" style={{fontWeight: "bold", borderBottomStyle: "none"}} >MSNV - Họ Và Tên *</label>
      
      
      <Dropdown required disabled={false} block="true" onSelect = {e =>setMsnv(e)}>

      <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{MSNV ==="" ? "Bấm Để Chọn": MSNV}</Dropdown.Toggle>
      <Dropdown.Menu style={{width: "100%"}}>
      <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchParam} placeholder="Tìm Mã Hoặc Tên Nhân Viên" />
      <Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
          {FilterNhanVien.map(el =>
            <Dropdown.Item key={el.msnv} eventKey={el.msnv+' - '+el.hovaten}> {el.msnv+' - '+el.hovaten} </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <label className="form-label" style={{fontWeight: "bold"}}>Chọn Phòng Ban *</label>
      <Form.Select required style={{ fontStyle: "normal" }} onChange={e => setPhongBan(e.target.value)} value={PhongBan} disabled={false}>
          <option ></option>
          {phongban.map(el =>
            <option key={el.id} value={el.phongban}> {el.phongban} </option>
          )}
      </Form.Select>
      
      <label className="form-label" style={{fontWeight: "bold"}} >Số CCCD *</label>
      <Form.Control required type="text" onChange={e => setCCCD(e.target.value)} value={CCCD} placeholder="Ví dụ 070091011832"></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Ngày Cấp *</label>
      <Form.Control required type="date" onChange={e => setNgayCap(e.target.value)} value={NgayCap}></Form.Control>

      <label className="form-label" style={{fontWeight: "bold"}}>Nơi Cấp</label>
      <Form.Select required style={{ fontStyle: "normal" }} onChange={e => setNoiCap(e.target.value)} value={NoiCap} disabled={false}>
          <option ></option>
          {noiCap.map(el =>
            <option key={el.id} value={el.data}> {el.data} </option>
          )}
      </Form.Select>

      <label className="form-label" style={{fontWeight: "bold"}} >Số nhà/Đường Phố, Thôn, Xóm <span style={{color: "orange"}}>(theo hộ khẩu)</span> </label>
      <Form.Control  type="text" onChange={e => setSoNha(e.target.value)} value={SoNha} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Tỉnh / TP <span style={{color: "orange"}}>(theo hộ khẩu)</span> *</label>
      <Form.Control required type="text" onChange={e => setTinh(e.target.value)} value={Tinh} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Quận / Huyện <span style={{color: "orange"}}>(theo hộ khẩu)</span> *</label>
      <Form.Control required type="text" onChange={e => setQuan(e.target.value)} value={Quan} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Phường/ Xã <span style={{color: "orange"}}>(theo hộ khẩu)</span>*</label>
      <Form.Control required type="text" onChange={e => setPhuong(e.target.value)} value={Phuong} placeholder=""></Form.Control>

      <label className="form-label" style={{fontWeight: "bold"}} >Số nhà/Đường Phố, Thôn, Xóm <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span></label>
      <Form.Control type="text" onChange={e => setSoNha2(e.target.value)} value={SoNha2} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Tỉnh / TP <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span> *</label>
      <Form.Control required type="text" onChange={e => setTinh2(e.target.value)} value={Tinh2} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Quận / Huyện <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span> *</label>
      <Form.Control required type="text" onChange={e => setQuan2(e.target.value)} value={Quan2} placeholder=""></Form.Control>
      <label className="form-label" style={{fontWeight: "bold"}} >Phường/ Xã <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span>*</label>
      <Form.Control required type="text" onChange={e => setPhuong2(e.target.value)} value={Phuong2} placeholder=""></Form.Control>

      <label className="form-label" style={{fontWeight: "bold"}} >Điện Thoại Liên Hệ *</label>
      <Form.Control type="number" onChange={e => setSDT(e.target.value)} value={SDT} placeholder=""></Form.Control>

      <label className="form-label" style={{fontWeight: "bold"}}>Upload Hình Ảnh</label>
      <Form.Control required type="file" multiple={true} accept="image/*"  disabled={false} onChange={e => setSelectedFile(e.target.files)}></Form.Control>
      <Button className="mt-2 mb-2 border-0"  type="submit" style={{width: "100%", backgroundColor:"#00A79D"}}>Submit form</Button>

        {HrTamLoading &&
          <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        {HrTamAlert &&
          <div className={`alert ${HrTamAlertType} alert-dismissible mt-2`} role="alert" >
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
            <span><strong>Cảnh Báo  </strong>{HrTamAlertText}</span>
          </div>
        }
    </Form>
    </div>
    </div>
    </div>
    <footer className="text-center">
        <div className="container text-muted py-4 py-lg-5">
            <p className="mb-0">Copyright © 2022 MerapGroup</p>
        </div>
    </footer>
    </div>
  )
}

export default HrFormCapNhatCCCD

