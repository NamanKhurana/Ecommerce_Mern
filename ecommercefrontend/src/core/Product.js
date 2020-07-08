//Single Product Page

import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read,listRelated } from './apiCore';
import Card from './Card';

const Product = (props) => {

    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])
    // eslint-disable-next-line 
    const [error, setError] = useState(false)

    const loadSingleProduct = productId => {
        //method in apiCore.js to get single product from backend 
        read(productId).then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setProduct(data)
                //fetch related products
                listRelated(data._id).then(data => {
                    //console.log("Hello")
                    if(data.error){
                        setError(data.error)
                    }else {
                        setRelatedProducts(data)
                    }
                })
            }
        })
    }

    useEffect(() => {
        //Grab productId from url
        const productId = props.match.params.productId
        loadSingleProduct(productId)
    }, [props]) //useEffect will run only once if we keep our array empty but it should run whenever there is any change in props as               well (like changing the url of the page)

    return (
        <Layout title={product && product.name} description={product && product.description && product.description.substring(0, 100)} className="container-fluid">
            <div className="row">
                <div className="col-5">
                    {product && product.description && <Card product={product} showViewProductButton = {false}/>}
                </div>
                <div className = "col-7">
                    <h4>Related Products</h4>
                    {relatedProducts.map((product,index) => {
                        return (
                            <div key = {index} className = "mb-3">
                                <Card product = {product} showViewProductButton = {false}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}

export default Product; 