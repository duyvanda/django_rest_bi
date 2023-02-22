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
  const { TinhThanh, QuanHuyen, handleChiTamData, HrTamAlert, HrTamAlertType, HrTamAlertText, HrTamLoading } = useContext(FeedbackContext)
  // STATES
  const [NhanVien, setNhanVien] = useState([]);
  const [FilterNhanVien, setFilterNhanVien] = useState([]);
  const [MSNV, setMsnv] = useState('');
  const [HoVaTen, setHoVaTen] = useState('empty');
  const [PhongBan, setPhongBan] = useState('empty');
  const [CCCD, setCCCD] = useState('');
  const [NgayCap, setNgayCap] = useState('');
  const [NoiCap, setNoiCap] = useState('');
  const [SoNha, setSoNha] = useState('');
  const [Tinh, setTinh] = useState('');
  const [SearchTinh, setSearchTinh] = useState("");
  const [MaTinhThanh, setMaTinhThanh] = useState('');
  const [Quan, setQuan] = useState('');
  const [SearchQuan, setSearchQuan] = useState("");
  const [LoadingPX, setLoadingPX] = useState(true)
  const [PhuongXa, setPhuongXa] = useState([]);
  const [SearchPhuong, setSearchPhuong] = useState("");
  const [Phuong, setPhuong] = useState('');
  const [SoNha2, setSoNha2] = useState('');
  const [Tinh2, setTinh2] = useState('');
  const [SearchTinh2, setSearchTinh2] = useState("");
  const [MaTinhThanh2, setMaTinhThanh2] = useState('');
  const [Quan2, setQuan2] = useState('');
  const [SearchQuan2, setSearchQuan2] = useState("");
  const [LoadingPX2, setLoadingPX2] = useState(true)
  const [PhuongXa2, setPhuongXa2] = useState([]);
  const [Phuong2, setPhuong2] = useState('');
  const [SearchPhuong2, setSearchPhuong2] = useState("");
  const [SDT, setSDT] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    fetchNhanVien()
  }, [])


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

  const fetchNhanVien = async () => {

    const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/msnv_ten_records.json')

    const data = await response.json()

    setNhanVien(data)

    // console.log("DATAPRODUCTS", products)
  }

  const handleSearchParam=(e)=>{
    setFilterNhanVien(NhanVien.filter(el => el.name
      .includes(removeAccents(e.target.value.toLowerCase())))
      .slice(0, 20)) // select top 20
  }
  const handleSearchTinh=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchTinh(data1)
  }
  const handleSearchQuan=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchQuan(data1)
  }
  const handleSearchPhuong=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchPhuong(data1)
  }
  const handleSearchTinh2=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchTinh2(data1)
  }
  const handleSearchQuan2=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchQuan2(data1)
  }
  const handleSearchPhuong2=(e)=>{
    let data = e.target.value.toLowerCase()
    let data1 = removeAccents(data)
    setSearchPhuong2(data1)
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
    const bol00 = MSNV.includes('-')
    const bol01 = data.CCCD.length === 12
    const bol1 = data.Phuong.includes('-')
    const bol2 = data.Phuong2.includes('-')
    
    if (!bol00) {window.alert("Vui Lòng Chọn Lại Mã Nhân Viên")}
    else if (!bol01) {window.alert("Vui Lòng Nhập Đủ 12 Ký Tự CCCD")}
    else if (bol1 && bol2) {handleChiTamData(data, selectedFile)}
    else window.alert("Vui Lòng Chọn Lại Phường Xã")
    
}

const handleChangeQH = async (e) => {
  setLoadingPX(true)
  setQuan(e);
  setPhuong('');
  const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/thue_hr_phuongxa_2.json')
  const data = await response.json()
  const px=data.filter(el => el.maquanhuyen === Number(e.split('-')[0]))
  setPhuongXa(px)
  setLoadingPX(false)

  }
const handleChangeQH2 = async (e) => {
  setLoadingPX2(true)
  setQuan2(e);
  setPhuong2('');
  const response = await fetch('https://storage.googleapis.com/django_media_biteam/public/thue_hr_phuongxa_2.json')
  const data = await response.json()
  const px=data.filter(el => el.maquanhuyen === Number(e.split('-')[0]))
  setPhuongXa2(px)
  setLoadingPX2(false)
  }

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

    {/* <label className="form-label" style={{fontWeight: "bold"}}>Chọn Phòng Ban *</label>
    <Form.Select required style={{ fontStyle: "normal" }} onChange={e => setPhongBan(e.target.value)} value={PhongBan} disabled={false}>
        <option ></option>
        {phongban.map(el =>
          <option key={el.id} value={el.phongban}> {el.phongban} </option>
        )}
    </Form.Select> */}
    
    <label className="form-label" style={{fontWeight: "bold"}} >Số CCCD <span style={{color: "red"}}>(Phải Đúng 12 Ký Tự)</span> *</label>
    <Form.Control required minLength={12} maxLength={12} type="text" onChange={e => setCCCD(e.target.value)} value={CCCD} placeholder="Ví dụ 070091011832"></Form.Control>
    <label className="form-label" style={{fontWeight: "bold"}} >Ngày Cấp *</label>
    <Form.Control required type="date" onChange={e => setNgayCap(e.target.value)} value={NgayCap}></Form.Control>

    <label className="form-label" style={{fontWeight: "bold"}}>Nơi Cấp *</label>
    <Form.Select className="text-white" required style={{ fontStyle: "normal", backgroundColor: "#00A79D" }} onChange={e => setNoiCap(e.target.value)} value={NoiCap} disabled={false}>
        <option></option>
        {noiCap.map(el =>
          <option key={el.id} value={el.data}> {el.data} </option>
        )}
    </Form.Select>

    <label className="form-label" style={{fontWeight: "bold"}} >Số nhà/Đường Phố, Thôn, Xóm <span style={{color: "orange"}}>(theo hộ khẩu)</span> </label>
    <Form.Control  type="text" onChange={e => setSoNha(e.target.value)} value={SoNha} placeholder=""></Form.Control>
    
    {/* Tinh Deleted*/}
    {/* <label className="form-label" style={{fontWeight: "bold"}} >Tỉnh / TP <span style={{color: "orange"}}>(theo hộ khẩu)</span> *</label>    
    <Form.Select required style={{ fontStyle: "normal" }} onChange={ e => {setTinh(e.target.value); setMaTinhThanh(e.target.value.split('-')[0])} } value={Tinh} disabled={false}>
        <option></option>
        {TinhThanh.map(el =>
          <option key={el.matinhthanh} value={el.matinhthanh+'-'+el.tentinhthanh}> {el.matinhthanh+'-'+el.tentinhthanh} </option>
        )}
    </Form.Select> */}

    {/* Tinh */}
    <label className="form-label" style={{fontWeight: "bold"}} >Tỉnh / TP <span style={{color: "orange"}}>(theo hộ khẩu)</span> *</label>
    <Dropdown required disabled={false} block="true" onSelect = {e => {setTinh(e); setMaTinhThanh(e.split('-')[0]); setQuan(''); {/* Bam chon lai Tinh thi Quan phai set lai tu dau */}}}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{Tinh ==="" ? "Bấm Để Chọn": Tinh}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchTinh} placeholder="Tìm Tỉnh" />
    <Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
        {TinhThanh.filter(el => removeAccents(el.tentinhthanh.toLowerCase()).includes(SearchTinh))
        .map(el =><Dropdown.Item key={el.matinhthanh} eventKey={el.matinhthanh+' - '+el.tentinhthanh}> {el.matinhthanh+' - '+el.tentinhthanh} </Dropdown.Item>)
        }
      </Dropdown.Menu>
    </Dropdown>


    {/* Quan */}
    <label className="form-label" style={{fontWeight: "bold"}} >Quận / Huyện <span style={{color: "orange"}}>(theo hộ khẩu)</span> *</label>
    <Dropdown required style={{ fontStyle: "normal" }} onSelect={ handleChangeQH } disabled={false}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{Quan ==="" ? "Bấm Để Chọn": Quan}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchQuan} placeholder="Tìm Quận" />
    <Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
    {QuanHuyen.filter(el => el.matinhthanh===Number(MaTinhThanh))
    .filter(el=> removeAccents(el.tenquanhuyen.toLowerCase()).includes(SearchQuan))
    .map(el =><Dropdown.Item key={el.maquanhuyen} eventKey={el.maquanhuyen+'-'+el.tenquanhuyen}> {el.maquanhuyen+'-'+el.tenquanhuyen} </Dropdown.Item>)
    }
    </Dropdown.Menu>
    </Dropdown>

    {/* Phuong */}
    <label className="form-label" style={{fontWeight: "bold"}} >Phường/ Xã <span style={{color: "orange"}}>(theo hộ khẩu)</span>*</label>
    <Dropdown required style={{ fontStyle: "normal" }} onSelect={e => setPhuong(e)} disabled={false}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{LoadingPX ? "Loading": Phuong}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchPhuong} placeholder="Tìm Phường" />
        {PhuongXa
        .filter(el => removeAccents(el.tenphuongxa.toLowerCase()).includes(SearchPhuong))
        .map(el => <Dropdown.Item key={el.maphuongxa} eventKey={el.maphuongxa+'-'+el.tenphuongxa}> {el.maphuongxa+'-'+el.tenphuongxa} </Dropdown.Item>
        )}
    </Dropdown.Menu>
    </Dropdown>
    
    {/* SoNha 2 */}
    <label className="form-label" style={{fontWeight: "bold"}} >Số nhà/Đường Phố, Thôn, Xóm <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span></label>
    <Form.Control type="text" onChange={e => setSoNha2(e.target.value)} value={SoNha2} placeholder=""></Form.Control>
    
    {/* Tinh 2 */}
    <label className="form-label" style={{fontWeight: "bold"}} >Tỉnh / TP <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span> *</label>
    <Dropdown required disabled={false} block="true" onSelect = {e => {setTinh2(e); setMaTinhThanh2(e.split('-')[0]); setQuan2(''); {/* Bam chon lai Tinh thi Quan phai set lai tu dau */}}}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{Tinh2 ==="" ? "Bấm Để Chọn": Tinh2}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchTinh2} placeholder="Tìm Tỉnh" />
    <Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
        {TinhThanh.filter(el => removeAccents(el.tentinhthanh.toLowerCase()).includes(SearchTinh2))
        .map(el =><Dropdown.Item key={el.matinhthanh} eventKey={el.matinhthanh+' - '+el.tentinhthanh}> {el.matinhthanh+' - '+el.tentinhthanh} </Dropdown.Item>)
        }
      </Dropdown.Menu>
    </Dropdown>
    
    {/* Quan 2 */}
    <label className="form-label" style={{fontWeight: "bold"}} >Quận / Huyện <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span> *</label>
    <Dropdown required style={{ fontStyle: "normal" }} onSelect={ handleChangeQH2 } disabled={false}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{Quan2 ==="" ? "Bấm Để Chọn": Quan2}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchQuan2} placeholder="Tìm Quận" />
    <Dropdown.Divider style={{height: 5, backgroundColor: 'steelblue'}}></Dropdown.Divider>
    {QuanHuyen.filter(el => el.matinhthanh===Number(MaTinhThanh2))
    .filter(el=> removeAccents(el.tenquanhuyen.toLowerCase()).includes(SearchQuan2))
    .map(el =><Dropdown.Item key={el.maquanhuyen} eventKey={el.maquanhuyen+'-'+el.tenquanhuyen}> {el.maquanhuyen+'-'+el.tenquanhuyen} </Dropdown.Item>)
    }
    </Dropdown.Menu>
    </Dropdown>
    
    {/* Phuong 2 */}
    <label className="form-label" style={{fontWeight: "bold"}} >Phường/ Xã <span style={{color: "yellow"}}>(theo địa chỉ đang ở)</span>*</label>
    <Dropdown required style={{ fontStyle: "normal" }} onSelect={e => setPhuong2(e)} disabled={false}>
    <Dropdown.Toggle className="text-start border-0" style={{width: "100%", backgroundColor: "#00A79D"}} block="true">{LoadingPX2 ? "Loading": Phuong2}</Dropdown.Toggle>
    <Dropdown.Menu style={{width: "100%"}}>
    <Form.Control className='border-0' type="text" style={{}} onChange={handleSearchPhuong2} placeholder="Tìm Phường" />
        {PhuongXa2
        .filter(el => removeAccents(el.tenphuongxa.toLowerCase()).includes(SearchPhuong2))
        .map(el => <Dropdown.Item key={el.maphuongxa} eventKey={el.maphuongxa+'-'+el.tenphuongxa}> {el.maphuongxa+'-'+el.tenphuongxa} </Dropdown.Item>
        )}
    </Dropdown.Menu>
    </Dropdown>


    <label className="form-label" style={{fontWeight: "bold"}} >Điện Thoại Liên Hệ *</label>
    <Form.Control type="number" onChange={e => setSDT(e.target.value)} value={SDT} placeholder=""></Form.Control>

    <label className="form-label" style={{fontWeight: "bold"}}>Upload Hình Ảnh CCCD *</label>
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
          <span><strong>Thông Báo  </strong>{HrTamAlertText}</span>
        </div>
      }
    </Form>
    </div>
    </div>
    </div>
    <footer className="text-center">
        <div className="container text-muted py-4 py-lg-5">
            <p className="mb-0">Copyright © 11/10/2022 MerapGroup</p>
        </div>
    </footer>
    </div>
  )
}

export default HrFormCapNhatCCCD

