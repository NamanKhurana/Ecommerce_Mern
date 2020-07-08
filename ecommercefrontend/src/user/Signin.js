import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth';

const Signin = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    const { email, password, error, loading, redirectToReferrer } = values
    const { user } = isAuthenticated()

    //higher order function which returns another function
    //instead of using value and onchange attributes, we have used onchange and a higher order function so there is no need of value attribute in input tag
    const handleChange = (name) => (event) => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }


    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                    authenticate(data, () => {
                        setValues({ ...values, redirectToReferrer: true })
                    })
                }
            }) //name : name 
    }

    const signinForm = () => {
        return (<form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="text" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>)
    }

    const showError = () => {
        return <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}> {error} </div>
    }

    const showLoading = () => {
        return loading && (<div className="alert alert-info"><h2>Loading . . .</h2></div>)
    }

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to='/admin/dashboard' />
            }
            return <Redirect to='/user/dashboard' />
        }

        if(isAuthenticated()){
            return <Redirect to = "/" />
        }
    }

    return (
        <Layout title="Signin Page" description="Signin to Node React E-Commerce App" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signinForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signin;