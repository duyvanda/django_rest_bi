import React from 'react'
import { useState, useContext, useEffect } from 'react'
import FeedbackContext from '../context/FeedbackContext'


function Cart() {
  const { items, OrderCreate } = useContext(FeedbackContext)
  // console.log("items", items)

  const [Address, SetAddress] = useState('')
  const [City, SetCity] = useState('')
  const [PCode, SetPCode] = useState('')
  const [Country, SetCountry] = useState('')
  const [alert, SetALert] = useState(false)

  const totalPrice = items.reduce((acc, item) => acc + Number(item.price), 0)

  const handleAddressChange = (e) => {
    SetAddress(e.target.value)
  };
  const handleCityChange = (e) => {
    SetCity(e.target.value)
  };
  const handlePCodeChange = (e) => {
    SetPCode(e.target.value)
  };
  const handleCountryChange = (e) => {
    SetCountry(e.target.value)
  };
  // const handleCheckOut = () => {
  //   const FullAddress = {
  //     Address,
  //     City,
  //   }
  //   OrderCreate({
	// 		orderItems: items,
	// 		shippingAddress: FullAddress,
	// 		totalPrice: totalPrice,
	// 	})
  // }

  const handleCheckOut = () => {
    SetALert(true)
    setTimeout(() => SetALert(false),2000)
    SetAddress('')
    SetCity('')
    SetPCode('')
    SetCountry('')
    OrderCreate('')

  }
  return (
    <div className="container" >
      
      { alert &&
      <div className="alert alert-success alert-dismissible mt-2" role="alert" >
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
        <span><strong>Alert  </strong>SUCCESS</span>
      </div>
      }
      <h1>SHOPPING CART</h1>
      <div className="row">
        <div className="col-md-8">
          <ul className="list-group">

          {items.map((item) => 
            <li className="list-group-item" key={item.product}>
              <div className="row">
                <div className="col-md-2"><img className="img-fluid" src={item.image}></img></div>
                <div className="col-md-3 text-break fs-6 text-start"><strong>{item.name}</strong></div>
                <div className="col-md-2"><span>{item.price}</span></div>
                <div className="col-md-2"><span>{item.qty}</span></div>
                <div className="col-md-1"><button className="btn btn-dark" type="button"><i className="fas fa-trash"></i></button></div>
              </div>
            </li>
            )}
          
          </ul>
        </div>
        <div className="col-md-4">
          <ul className="list-group">
            <li className="list-group-item">
              <h3>Subtotal</h3>
            </li>
            <li className="list-group-item"><span>Price: {Number(totalPrice).toFixed(0)}</span></li>
            <li className="list-group-item"><button className="btn btn-success btn-lg"  type="button" style={{ width: "100%" }} data-bs-target="#modal-1" data-bs-toggle="modal">CheckOut</button></li>
          </ul>
        </div>
      </div>
    <div>
      <form>
      <label className="form-label">Address</label>
      <input className="form-control" type="text" placeholder="Address" onChange={handleAddressChange} value = {Address}></input>
      <label className="form-label">City</label>
      <input className="form-control" type="text" placeholder="City" onChange={handleCityChange} value = {City}></input>
      <label className="form-label">Postal Code</label>
      <input className="form-control" type="text" placeholder="Postol Code" onChange={handlePCodeChange} value = {PCode}></input>
      <label className="form-label">Country</label>
      <input className="form-control" type="text" placeholder="Country" onChange={handleCountryChange} value = {Country}></input>
      </form>
    </div>
    <div className="modal fade" role="dialog" tabindex="-1" id="modal-1">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <p>BẠN CÓ CHẮC CHẮN MUỐN ĐẶT HÀNG ???</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-light" type="button" data-bs-dismiss="modal">Close</button>
                      <button className="btn btn-primary" type="button"  data-bs-dismiss="modal" onClick={handleCheckOut}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Cart

// onClick={handleCheckOut}