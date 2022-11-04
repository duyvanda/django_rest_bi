import React from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from "react-bootstrap";



function ProductList({history}) {

    const { chiNhanh, tinhthanh, fetchQuanHuyen, quanhuyen, fetchPhuongXa, phuongxa, handleSaveForm, alert, alertType, alertText, loading } = useContext(FeedbackContext)
  
    const [maChiNhanh, SetMaChiNhanh] = useState('MR0010-11001A04000013000')
    const [maTinhThanh, SetMaTinhThanh] = useState('Hà Nội-10')
    const [maQuanHuyen, SetMaQuanHuyen] = useState('Cầu Giấy-1220')
    const [maPhuongXa, SetMaPhuongXa] = useState('Yên Hòa-12260')
    const [tenNT, SetTenNT] = useState('')
    const [diaChi, SetDiaChi] = useState('')
    const [bbnh, SetBBNH] = useState('')
    // const [alert, SetALert] = useState(false)

    const handleChangeCN = (e) => {
      // const id = e.target.value.split('-')[1]
      // console.log("handleChangeTT ", id)
      // fetchQuanHuyen(id)
      SetMaChiNhanh(e.target.value)
    }
    const handleChangeTT = (e) => {
      const id = e.target.value.split('-')[1]
      console.log("handleChangeTT ", id)
      fetchQuanHuyen(id)
      SetMaTinhThanh(e.target.value)
    }
    const handleChangeQH = (e) => {
      const id = e.target.value.split('-')[1]
      fetchPhuongXa(id)
      SetMaQuanHuyen(e.target.value)
    }
    const handleChangePX = (e) => {
      const data = e.target.value.split('-')[1]
      // fetchPhuongXa(data)
      SetMaPhuongXa(e.target.value)
    }

    const handleTenNT = (e) => {
      const data = e.target.value
      SetTenNT(data)
      // console.log(data)
    }

    const handleDiaChi = (e) => {
      const data = e.target.value
      SetDiaChi(data)
      // console.log(data)
    }
    const handleBBNH = (e) => {
      const data = e.target.value.split(" ").join("").split("-").join("").toUpperCase();
      SetBBNH(data)
      // console.log(data)
    }
    const handleSave = () => {
      
      const data = {
        'maChiNhanh':maChiNhanh.split('-')[1],
        'maTinhThanh':maTinhThanh.split('-')[1],
        'maQuanHuyen':maQuanHuyen.split('-')[1],
        'maPhuongXa':maPhuongXa.split('-')[1],
        tenNT: tenNT.trimEnd(),
        diaChi: diaChi.trimEnd(),
        bbnh: bbnh.trimEnd()
      }
      console.log(data)
      
      handleSaveForm(data)
      // console.log(data)
      // SetMaChiNhanh('')
      // SetMaTinhThanh('')
      // SetMaQuanHuyen('')
      // SetMaPhuongXa('')
      SetTenNT('')
      SetDiaChi('')
      SetBBNH('')
      // SetALert(true)
      // setTimeout(() => SetALert(false),2000)
      history.push("/")
    
    }
    return (
      <div className="container mt-5">
        <div className="container">
        <div className="row">
            <div className="col-md-8 offset-md-2 text-bg-success">
              {alert &&
                <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                  </button>
                  <span><strong>Cảnh Báo  </strong>{alertText}</span>
                </div>
              }
                <h1 className="text-center mt-3">VN POST INPUT FORM (v1.1)</h1>
                <form className="mt-2"><label className="form-label text-white" style={{fontWeight: "bold"}}>CHỌN CHI NHÁNH</label>
                  <select className="form-select" style={{fontStyle: "italic"}} onChange={handleChangeCN} value={maChiNhanh} disabled={true}>
                        <optgroup label="">
                        <option >MR0010-11001A04000013000</option>
                          {chiNhanh.map(el =>
                            <option key={el.id} value={el.chinhanh}> {el.chinhanh} </option>
                          )}
                        </optgroup>
                    </select>
                  <label className="form-label" style={{fontWeight: "bold"}}>CHỌN TỈNH THÀNH</label>
                  <select className="form-select " style={{fontStyle: "italic", textDecoration: "line-through"}} onChange={handleChangeTT} value={maTinhThanh} disabled={true}>
                        <optgroup label="">
                        <option style={{fontWeight: "bold"}}>Hà Nội-10</option>
                          {tinhthanh.map((el) =>
                            <option key={el} value={el} >{el}</option>
                          )}
                        </optgroup>
                    </select>

                    <label className="form-label" style={{fontWeight: "bold"}}>CHỌN QUẬN HUYỆN</label>

                    <select className="form-select" style={{fontStyle: "italic", textDecoration: "line-through"}} onChange={handleChangeQH} value={maQuanHuyen} disabled={true}>
                        <optgroup label="Chọn Quận Huyện">
                        <option >Cầu Giấu-1220</option>
                        {quanhuyen.map((el) =>
                            <option key={el} value={el} >{el}</option>
                          )}
                        </optgroup>
                    </select>
                    
                    <label className="form-label" style={{fontWeight: "bold"}}>CHỌN PHƯỜNG XÃ</label>
                    <select className="form-select" style={{fontStyle: "italic", textDecoration: "line-through"}} onChange={handleChangePX} value={maPhuongXa} disabled={true}>
                        <optgroup label="Chọn Quận Huyện">
                        <option >Yên Hòa-12260</option>
                        {phuongxa.map((el) =>
                            <option key={el} value={el} >{el}</option>
                          )}
                        </optgroup>
                    </select>
                    <label className="form-label" style={{fontWeight: "bold"}}>Tên Khách Hàng</label>
                    <input className="form-control" onChange={handleTenNT} value={tenNT} type="text" placeholder="Tên Khách Hàng"></input>
                    <label className="form-label" style={{fontWeight: "bold"}}>ĐỊA CHỈ GIAO HÀNG</label>
                    <textarea className="form-control" onChange={handleDiaChi} value={diaChi}></textarea>
                    <label className="form-label" style={{fontWeight: "bold"}} >MÃ CN THEO ĐƠN + BBNH</label>
                    <input className="form-control" type="text" onChange={handleBBNH} value={bbnh} placeholder="MR0001PBNH09202200511"></input>
                    <button className="btn btn-warning mt-2 mb-2" type="button" style={{width: "100%"}} data-bs-target="#modal-1" data-bs-toggle="modal">Submit</button>
                </form>
                    {loading &&
                      <Spinner animation="border" role="status" style={{ height: "100px", width: "100px", margin: "auto", display: "block" }}>
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    }
                    {alert &&
                      <div className={`alert ${alertType} alert-dismissible mt-2`} role="alert" >
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                        </button>
                        <span><strong>Cảnh Báo  </strong>{alertText}</span>
                      </div>
                    }
            </div>
        </div>
        <div className="modal fade" role="dialog" tabIndex="-1" id="modal-1">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Xác Nhận Gửi Đơn</h4>
                    </div>
                    <div className="modal-body">
                        <p>Ma Tinh Thanh: {maTinhThanh}</p>
                        <p>Ma Quan Huyen: {maQuanHuyen}</p>
                        <p>Ma Phuong Xa: {maPhuongXa}</p>
                        <p>Ten Nha Thuoc: {tenNT}</p>
                        <p>Dia Chi: {diaChi}</p>
                        <p>CN + BBNH: {bbnh}</p>
                    </div>
                    <div className="modal-footer"><button className="btn btn-light" type="button" data-bs-dismiss="modal">Close</button>
                    <button className="btn btn-primary" type="button" data-bs-dismiss="modal" onClick={handleSave}>Save</button></div>
                </div>
            </div>
        </div>
    </div>
    <footer className="text-center">
        <div className="container text-muted py-4 py-lg-5">
            <p className="mb-0">Copyright © 2022 MerapGroup</p>
        </div>
    </footer>
        </div>
  )}
  
  export default ProductList