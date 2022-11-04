import React from 'react'
import FeedbackContext from '../context/FeedbackContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

function ProductList() {

  const { products } = useContext(FeedbackContext)

  console.log("products", products)
  return (
    <div className="container">
      <div className="row row-cols-sm-2 row-cols-md-4 row-cols-lg-6">
        {products.map((product) =>
          
            < div className="col" key={product._id}>
              <div className="card" style={{ background: "#f7f7f9", fontFamily: "Arial", border: "none", height: "400px" }}>
                <div className="card-body">
                <Link to={`/product/${product._id}`} ><img className="img-fluid" src={product.image}></img></Link>
                <Link className="text-decoration-none text-dark" to={`/product/${product._id}`} ><h4 className="card-title ">{product.name}</h4> </Link>
                  <h6 className="text-muted card-subtitle mb-2 mt-2">{product.brand}</h6>
                  <p className="card-text">Rating {product.rating}</p>
                  <p className="card-text">$ Price {product.price}</p>
                </div>
              </div>
            </div >
          
        )}
      </div>
    </div>
  )
}

export default ProductList

