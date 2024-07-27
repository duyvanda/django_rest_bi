/* eslint-disable */
import React from "react";
import VNPContext from "../context/VNPContext";
import { useContext, useState, useEffect } from "react";
// import { Link } from 'react-router-dom'
import { Spinner, Form, Button, Modal, Dropdown, DropdownButton } from "react-bootstrap";

function ProductList({ history }) {
  const {
    chiNhanh,
    fetchKHVNP,
    khvnp,
    fetchTinhThanh,
    handleSaveForm,
    alert,
    alertType,
    alertText,
    loading,
  } = useContext(VNPContext);

  const [maChiNhanh, SetMaChiNhanh] = useState("");
  const [maChiNhanh1, SetMaChiNhanh1] = useState("");
  const [SenderTel, SetSenderTel] = useState("");
  const [SenderFullname, SetSenderFullname] = useState("");
  const [SenderAddress, SetSenderAddress] = useState("");
  const [SenderWardId, SetSenderWardId] = useState("");
  const [SenderDistrictId, SetSenderDistrictId] = useState("");
  const [SenderProvinceId, SetSenderProvinceId] = useState("");

  const [maTinhThanh, SetMaTinhThanh] = useState("");
  const [maQuanHuyen, SetMaQuanHuyen] = useState("");
  const [maPhuongXa, SetMaPhuongXa] = useState("");
  const [tenNT, SetTenNT] = useState("");
  const [diaChi, SetDiaChi] = useState("");
  const [bbnh, SetBBNH] = useState("");
  const [SDT, SetSDT] = useState("");
  const [MKH, SetMKH] = useState("");
  const [Kien, setKien] = useState(1);
  // const [alert, SetALert] = useState(false)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    fetchKHVNP(MKH);
  };
  useEffect(() => {
    fetchTinhThanh();
    // writelogs()
    // getUserInfo()
    // fetchTinhThanh()
    // fetchReports()
    // SetChiNhanh(ChiNhanh)
    // SetPhongBan(PhongBan)
    // console.log("URL",URL)
    // console.log("window.location.host ",window.location.host, window.location.host==="localhost:3000")
  }, []);

  const handleChangeCN = (e) => {
    // const id = e.target.value.split('-')[1]
    // console.log("handleChangeTT ", id)

    const data_arr = e.target.value.split(",");
    console.log(data_arr);
    SetMaChiNhanh1(e.target.value);
    SetMaChiNhanh(data_arr[0]);
    SetSenderTel(data_arr[1]);
    SetSenderFullname(data_arr[2]);
    SetSenderAddress(data_arr[3]);
    SetSenderWardId(data_arr[4]);
    SetSenderDistrictId(data_arr[5]);
    SetSenderProvinceId(data_arr[6]);
  };
  // const handleChangeTT = (e) => {
  //   const id = e.target.value.split('-')[1]
  //   console.log("handleChangeTT ", id)
  //   fetchQuanHuyen(id)
  //   SetMaTinhThanh(e.target.value)
  // }
  // const handleChangeQH = (e) => {
  //   const id = e.target.value.split('-')[1]
  //   fetchPhuongXa(id)
  //   SetMaQuanHuyen(e.target.value)
  // }
  // const handleChangePX = (e) => {
  //   const data = e.target.value.split('-')[1]
  //   SetMaPhuongXa(e.target.value)
  // }

  // const handleTenNT = (e) => {
  //   const data = e.target.value
  //   SetTenNT(data)
  // }

  // const handleDiaChi = (e) => {
  //   const data = e.target.value
  //   SetDiaChi(data)
  // }

  const handleBBNH = (e) => {
    const data = e.target.value
      .split(" ")
      .join("")
      .split("-")
      .join("")
      .toUpperCase();
    SetBBNH(data);
  };
  // const handleSDT = (e) => {
  //   const data = e.target.value
  //   SetSDT(data)
  // }

  const handleMKH = (e) => {
    const data = e.target.value;
    SetMKH(data);
  };

  const handleKien = (e) => {
    const data = e.target.value;
    data > 20
      ? window.alert(`So Kien Qua Nhieu: ${data}, Vui Long Check Lai Thong Tin`)
      : void 0;
    setKien(data);
  };

  const handleSave = () => {
    const data = {
      maChiNhanh: maChiNhanh.split("-")[1],
      SenderTel,
      SenderFullname,
      SenderAddress,
      SenderWardId,
      SenderDistrictId,
      SenderProvinceId,
      maTinhThanh: khvnp.codetinhkh.trimEnd().trimStart(),
      maQuanHuyen: khvnp.codequanhuyen.trimEnd().trimStart(),
      maPhuongXa: khvnp.codephuongxa.trimEnd().trimStart(),
      tenNT: khvnp.tenkhachhang.trimEnd().trimStart(),
      diaChi: khvnp.diachikh.trimEnd().trimStart(),
      bbnh: bbnh.trimEnd().trimStart(),
      SDT: khvnp.sodienthoai.trimEnd().trimStart(),
      Kien: Number(Kien),
    };
    console.log(data);

    handleSaveForm(data);
    // console.log(data)
    // SetMaChiNhanh('')
    SetMaTinhThanh("");
    SetMaQuanHuyen("");
    SetMaPhuongXa("");
    SetTenNT("");
    SetDiaChi("");
    SetBBNH("");
    SetSDT("");
    setKien(1);
    setShow(false);
    // SetALert(true)
    // setTimeout(() => SetALert(false),2000)
    history.push("/formmdsvnpost");
  };
  return (
    <div className="container mt-5">
        <div className="row">
          <div className="col-md-8 offset-md-2 text-bg-success">
              <h1 className="text-center mt-3">VN POST INPUT FORM</h1>
              <form className="mt-2"><label className="form-label text-white" style={{fontWeight: "bold"}}>CHỌN CHI NHÁNH</label>

                <Form.Select className="mt-2" required style={{fontStyle: "bold"}} onChange={handleChangeCN} value={maChiNhanh1} disabled={false} size='sm'>
                      <option>Vui Lòng Chọn Chi Nhánh</option>
                        {chiNhanh
                        .map(el =><option key={el.id} value={[el.chinhanh, el.SenderTel, el.SenderFullname, el.SenderAddress, el.SenderWardId, el.SenderDistrictId, el.SenderProvinceId]}> {el.chinhanh} </option>
                        )}
                </Form.Select>

                  <label className="form-label" style={{fontWeight: "bold"}} >MÃ CN THEO ĐƠN + BBNH</label>
                  <input className="form-control" type="text" onChange={handleBBNH} value={bbnh} placeholder="Ví dụ MR0001PBNH09202200511"></input>
                  <label className="form-label" style={{fontWeight: "bold"}} >Mã KH DMS</label>
                  <input className="form-control" type="text" onChange={handleMKH} value={MKH} placeholder="Ví dụ 000012"></input>
                  <label className="form-label" style={{fontWeight: "bold"}}>Số Kiện</label>
                  <Form.Control type="number" onChange={handleKien} value={Kien} placeholder="Số Kiện" disabled={false}></Form.Control>
              </form>
              <Button className="mt-2 mb-2" variant="warning" onClick={handleShow} style={{width: "100%"}}>Post Đơn</Button>
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

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Thông Tin Đơn Sắp POST</Modal.Title>
            </Modal.Header>
              <Modal.Body>
                <p>Mã KH DMS: {khvnp.makhdms}</p>
                <p>Ma Tinh Thanh: {khvnp.codetinhkh}</p>
                <p>Ma Quan Huyen: {khvnp.codequanhuyen}</p>
                <p>Ma Phuong Xa: {khvnp.codephuongxa}</p>
                <p>Ten Nha Thuoc: {khvnp.tenkhachhang}</p>
                <p>Dia Chi: {khvnp.diachikh}</p>
                <p>CN + BBNH: {bbnh}</p>
                <p>SDT: {khvnp.sodienthoai}</p>
                <p>SoKien: {Kien}</p>
              </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          <footer className="text-center">
              <div className="container text-muted py-4 py-lg-5">
                  <p className="mb-0">Copyright © 2022 MerapGroup</p>
              </div>
          </footer>
    </div>
  );
}

export default ProductList;

// <button className="btn btn-warning mt-2 mb-2" type="button" style={{width: "100%"}} data-bs-target="#modal-1" data-bs-toggle="modal">Submit</button>
{
  /* <div className="modal" id="modal-1">
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
                        <p>SDT: {SDT}</p>
                        <p>SoKien: {Kien}</p>
                    </div>
                    <div className="modal-footer"><button className="btn btn-light" type="button" data-bs-dismiss="modal">Close</button>
                    <button className="btn btn-primary" type="button" data-bs-dismiss="modal" onClick={handleSave}>Save</button></div>
                </div>
            </div>
        </div> */
}


{/* <DropdownButton id="dropdown-basic-button" title="Dropdown button" align="start" menuVariant="dark" variant="success">
  <Form.Check type="checkbox" id="checkbox" label="checkbox"/>
  <Form.Check type="checkbox" id="checkbox" label="checkbox"/>
  <Form.Check type="checkbox" id="checkbox" label="checkbox"/>
  <Form.Check type="checkbox" id="checkbox" label="checkbox"/>
  <Form.Check type="checkbox" id="checkbox" label="checkbox"/>
</DropdownButton> */}

                {/* <label className="form-label" style={{fontWeight: "bold"}}>CHỌN TỈNH THÀNH</label>
                <select className="form-select " style={{fontStyle: "bold"}} onChange={handleChangeTT} value={maTinhThanh} disabled={false}>
                      <optgroup label="">
                      <option style={{fontWeight: "bold"}}></option>
                        {tinhthanh.map((el) =>
                          <option key={el} value={el} >{el}</option>
                        )}
                      </optgroup>
                  </select>

                  <label className="form-label" style={{fontWeight: "bold"}}>CHỌN QUẬN HUYỆN</label>
                  
                  <select className="form-select" style={{fontStyle: "bold"}} onChange={handleChangeQH} value={maQuanHuyen} disabled={false}>
                      <optgroup label="Chọn Quận Huyện">
                      <option ></option>
                      {quanhuyen.map((el) =>
                          <option key={el} value={el} >{el}</option>
                        )}
                      </optgroup>
                  </select>
                  
                  <label className="form-label" style={{fontWeight: "bold"}}>CHỌN PHƯỜNG XÃ</label>
                  <select className="form-select" style={{fontStyle: "bold"}} onChange={handleChangePX} value={maPhuongXa} disabled={false}>
                      <optgroup label="Chọn Quận Huyện">
                      <option ></option>
                      {phuongxa.map((el) =>
                          <option key={el} value={el} >{el}</option>
                        )}
                      </optgroup>
                  </select> */}
                  {/* <label className="form-label" style={{fontWeight: "bold"}}>Tên Khách Hàng</label>
                  <input className="form-control" onChange={handleTenNT} value={tenNT} type="text" placeholder="Tên Khách Hàng"></input>
                  <label className="form-label" style={{fontWeight: "bold"}}>ĐỊA CHỈ GIAO HÀNG</label>
                  <textarea className="form-control" onChange={handleDiaChi} value={diaChi}></textarea> */}


                  {/* <label className="form-label" style={{fontWeight: "bold"}} >Số Điện Thoại Khách Hàng</label> */}
                  {/* <input className="form-control" type="text" onChange={handleSDT} value={SDT} placeholder="Ví dụ 0909555555"></input> */}



//   <DropdownButton id="dropdown-basic-button" title="Dropdown button" align="start">
//   <Form.Select multiple aria-label="Default select example">
//     <option value="1">One</option>
//     <option value="2">Two</option>
//     <option value="3">Three</option>
//   </Form.Select>
// </DropdownButton>



{/* 

<Dropdown>
<Dropdown.Toggle variant="success" id="dropdown-basic">
Dropdown Button
</Dropdown.Toggle>


<Dropdown.Menu>
  <Form.Select multiple aria-label="Default select example">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </Form.Select>
</Dropdown.Menu>
</Dropdown>

<DropdownButton id="dropdown-basic-button" title="Dropdown button" align="start">
<Form.Select multiple aria-label="Default select example">
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Form.Select>
</DropdownButton> 

*/}