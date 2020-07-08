// import React, { useState } from 'react';
// import { Link, Redirect } from 'react-router-dom';
// import ShowImage from './ShowImage';
// import moment from 'moment';
// import { addItem, updateItem,removeItem } from './cartHelpers';


// const Card = ({ product, showViewProductsButton = true, showAddToCartButton = true, cartUpdate = false, showRemoveProductButton = false }) => {

//     const [redirect, setRedirect] = useState(false)
//     const [count, setCount] = useState(product.count)

//     const showViewProducts = (showViewProductsButton) => {
//         return (
//             showViewProductsButton && (<Link to={`/product/${product._id}`} className="mr-2">
//                 <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
//                     View Product
//             </button>
//             </Link>)
//         )
//     }

//     const addToCart = () => {
//         addItem(product, () => {
//             setRedirect(true)
//         })
//     }

//     const shouldRedirect = (redirect) => {
//         if (redirect) {
//             return <Redirect to="/cart" />
//         }
//     }

//     const showAddToCart = (showAddToCartButton) => {
//         return showAddToCartButton && (
//             <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
//                 Add to Cart
//                     </button>
//         )
//     }

//     const showRemoveButton = (showRemoveProductButton) => {
//         return showRemoveProductButton && (
//             <button onClick={() => removeItem(product._id)} className="btn btn-outline-danger mt-2 mb-2">
//                 Remove Product
//                     </button>
//         )
//     }

//function to check if product is in stock or not (quantity > 0 or not)
//     const showStock = quantity => {
//         return quantity > 0 ? (
//             <span className="badge badge-primary badge-pill">In Stock</span>
//         ) : (
//                 <span className="badge badge-primary badge-pill">Out of Stock</span>
//             )
//     }

//     const handleChange = productId => event => {
//         setCount(event.target.value < 1 ? 1 : event.target.value)
//         if (event.target.value > 1) {
//             updateItem(productId, event.target.value)
//         }
//     }

//     const showCartUpdateOptions = cartUpdate => {
//         return cartUpdate && <div>
//             <div className="input-group mb-3">
//                 <div className="input-group-prepend">
//                     <span className="input-group-text">
//                         Adjust Quantity
//                     </span>
//                 </div>
//                 <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
//             </div>
//         </div>
//     }

//     return (
//         <div className="card">
//             <div className="card-header name">{product.name}</div>
//             <div className="card-body">
//                 {shouldRedirect(redirect)}
//                 <ShowImage item={product} url="product" />
//                 {/**substring method is used to trim(or shorten) the length of description of a product */}
//                 <p className="lead mt-2">{product.description.substring(0, 100)}</p>
//                 <p className="black-10">₹ {product.price}</p>
//                 <p className="black-9">
//                     Category : {product.category && product.category.name}
//                 </p>
//                 {/**Here raw date won't look good so for styling the date , npm module 'moment' will be used  */}
//                 <p className="black-8">Added {moment(product.createdAt).fromNow()}</p>
//                 {showStock(product.quantity)}
//                 <br />
//                 {showViewProducts(showViewProductsButton)}
//                 {showAddToCart(showAddToCartButton)}
//                 {showRemoveButton(showRemoveProductButton)}
//                 {showCartUpdateOptions(cartUpdate)}
//             </div>
//         </div>)
// }

// export default Card;

import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { addItem, updateItem, removeItem } from './cartHelpers';

import '../styles.css';

// using a default value of true for 'showViewProductsButton' and 'showAddToCartButton' prop
// using a default value of false for 'cartUpdate' prop (this prop is there for incrementing/decrementing product count in 'cart' component)
const Card = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = f => f,// default value of function
    run = undefined // default value of undefined
    // changeCartSize
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = showViewProductButton => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
                </Link>
            )
        );
    };

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true)
        })
    }
    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart" />;
        }
    };

    const showAddToCartBtn = showAddToCartButton => {
        return (
            showAddToCartButton && (
                <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
                    Add to cart
        </button>
            )
        );
    };

    //function to check if product is in stock or not (quantity > 0 or not)
    const showStock = quantity => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In Stock </span>
        ) : (
                <span className="badge badge-primary badge-pill">Out of Stock </span>
            );
    };

    const handleChange = productId => event => {
        setRun(!run); // run useEffect in parent 'Cart.js' whenever quantity is increased/decreased
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    };

    const showCartUpdateOptions = cartUpdate => {
        return (
            cartUpdate && (
                <div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Adjust Quantity</span>
                        </div>
                        <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
                    </div>
                </div>
            )
        );
    };
    const showRemoveButton = showRemoveProductButton => {
        return (
            showRemoveProductButton && (
                <button
                    onClick={() => {
                        removeItem(product._id);
                        setRun(!run); // run useEffect in parent 'Cart.js' whenever item is removed from localstorage
                    }}
                    className="btn btn-outline-danger mt-2 mb-2"
                >
                    Remove Product
        </button>
            )
        );
    };
    return (
        <div className="card ">
            <div className="card-header card-header-1 ">{product.name}</div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                {/**substring method is used to trim(or shorten) the length of description of a product */}
                <p className="card-p  mt-2">{product.description.substring(0, 100)} </p>
                <p className="card-p black-10">$ {product.price}</p>
                <p className="black-9">Category: {product.category && product.category.name}</p>
                {/**Here raw date won't look good so for styling the date , npm module 'moment' will be used  */}
                <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p>
                {showStock(product.quantity)}
                <br />

                {showViewButton(showViewProductButton)}

                {showAddToCartBtn(showAddToCartButton)}

                {showRemoveButton(showRemoveProductButton)}

                {showCartUpdateOptions(cartUpdate)}
            </div>
        </div>
    );
};

export default Card;