import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';
import UpdateCategory from './admin/UpdateCategory';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/shop" exact component={Shop} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <PrivateRoute path="/user/dashboard" exact><Dashboard /></PrivateRoute>
                <AdminRoute path="/admin/dashboard" exact><AdminDashboard /></AdminRoute>
                <AdminRoute path="/create/category" exact><AddCategory /></AdminRoute>
                <AdminRoute path="/create/product" exact><AddProduct /></AdminRoute>
                <Route path="/product/:productId" exact component={Product} />
                <Route path="/cart" exact component={Cart} />
                <AdminRoute path="/admin/orders" exact><Orders /></AdminRoute>
                <PrivateRoute path="/profile/:userId" exact component = {Profile} />
                <AdminRoute path="/admin/products" exact><ManageProducts /></AdminRoute>
                <AdminRoute path="/admin/product/update/:productId" component = {UpdateProduct} />
                <AdminRoute path="/admin/category/update/:categoryId" exact component = {UpdateCategory} />
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;