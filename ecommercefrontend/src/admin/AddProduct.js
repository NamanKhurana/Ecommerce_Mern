import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from './apiAdmin';

const AddProduct = () => {

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [], //TODO this is going to be a list of categories. We will bring all the categories from the backend and populate them while creating a new product
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '', //TODO Once we create a new product, we'll inform the user about the created product
        redirectToProfile: false,
        formData: ''
    })

    const { user, token } = isAuthenticated()

    const { name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData } = values

    //load categories and set form data
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, categories: data, formData: new FormData() })
            }
        })
    }

    //We will send form data in the backend instead of json. So we will use formdata api available in the browsers
    //We want the formdata as soon as the component mounts so will will use 'useEffect hook' 
    //It is a replacement to class based life cycle methods
    //The callback function runs when the component mounts and anytime the values change
    //Everything in the state will go into the formdata and this is the data(product) that we will send to the backend
    //Here formdata is initialised using init function
    useEffect(() => {
        // setValues({ ...values, formData: new FormData() })
        init()
        // eslint-disable-next-line
    }, [])

    //higher order function used to handle input change event
    const handleChange = name => event => {
        //if name = 'photo' then it be a target file at 0th index in array and target value otherwise
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        formData.set(name, value) // Here we are setting corresponding values to each argument i.e name,description,price etc when something is entered in the form
        setValues({ ...values, [name]: value,error:false,createdProduct:false })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, error: '', loading: true })

        createProduct(user._id, token, formData)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        photo: '',
                        price: '',
                        quantity: '',
                        loading: false,
                        createdProduct: data.name,
                        formData: new FormData()
                    })
                }
            })
    }

    const newPostForm = () => {
        return (
            <form className="mb-3" onSubmit={clickSubmit}>
                <h4>Post Photo</h4>
                <div className="form-group">
                    <label className="btn btn-secondary"><input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" /></label>
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Description</label>
                    <textarea onChange={handleChange('description')} type="text" className="form-control" value={description} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Price</label>
                    <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Category</label>
                    <select onChange={handleChange('category')} className="form-control">
                        <option>Select one Category ...</option>
                        {categories && categories.map((category, index) => {
                            return <option key={index} value={category._id}>{category.name}</option>
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <label className="text-muted">Shipping</label>
                    <select onChange={handleChange('shipping')} className="form-control">
                        <option>Do you want it to be shipped ?</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="text-muted">Quantity</label>
                    <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
                </div>
                <button className="btn btn-outline-primary">Create Product</button>
            </form>
        )
    }

    const showError = () => {
        return <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>{error}</div>
    }

    const showSuccess = () => {
        return <div className="alert alert-info" style={{ display: createdProduct ? '' : 'none' }}>{`${createdProduct} is created`}</div>
    }

    const showLoading = () => {
        return loading && (<div className="alert alert-success"><h2>Loading...</h2></div>)
    }

    return (
        <Layout title="Add a new Product" description={`Hey ${user.name} :), ready to add a new Product ?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    )
}

export default AddProduct;