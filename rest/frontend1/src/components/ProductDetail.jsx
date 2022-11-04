import React from 'react'
import { Link } from 'react-router-dom'
import FeedbackContext from '../context/FeedbackContext'
import { useContext, useEffect, useState } from 'react'

function ProductDetail({match, history}) {

const [text, setText] = useState(1)
const { product, fetchProductById, addCartItemToCart } = useContext(FeedbackContext)

useEffect(() => {
    fetchProductById(match.params.id)
}, []);

const handleTextChange = (e) => {
    setText(e.target.value)
}

const addToCart = () => {
    const cartItem = {
        product: product._id,
        name: product.name,
        qty: text,
        image: product.image,
        price: (Number(text)*Number(product.price)).toFixed(0),
        countInStock: product.countInStock
    }
    // console.log(cartItem)
    addCartItemToCart(cartItem)
    history.push("/cart")
}
return (
<div className="container mt-2"><Link className="btn btn-primary bg-dark" role="button" to="/">Go Back</Link>
    <div className="row mt-2">
        <div className="col-md-6"><img className="img-fluid" src={product.image}></img></div>
        <div className="col" style={{background: "#f7f7f9"}}>
            <ul className="list-group">
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold", paddingBottom : "0px"}}><strong><span style={{color: "rgb(85, 89, 92)"}}>{product.name}</span></strong><br></br></p>
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold", paddingBottom : "0px"}}>Number of Reviews: {product.numReviews}</p>
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold", paddingBottom : "0px"}}>Price: ${product.price}</p>
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold", paddingBottom : "0px"}}>Description: Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div className="col" style={{background: "#f7f7f9"}}>
            <ul className="list-group">
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold"}}>Price:</p>
                        </div>
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold"}}>{Number(text)*product.price}</p>
                        </div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="row">
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold"}}>Status:</p>
                        </div>
                        <div className="col">
                            <p className="text-center" style={{fontWeight: "bold"}}>In-Stock</p>
                        </div>
                    </div>
                </li>

                    <li className="list-group-item">
                        <form>
                            <label className="form-label text-center d-block">Qty</label>
                            <input className="form-control" type="number" value={Number(text)} onChange={handleTextChange}></input>
                        </form>
                    </li>
                <li className="list-group-item"><button className="btn btn-primary bg-dark" type="button" style={{width: "100%"}} onClick={addToCart}>Add To Cart</button></li>
            </ul>
        </div>
    </div>
</div>
  )
}

export default ProductDetail

