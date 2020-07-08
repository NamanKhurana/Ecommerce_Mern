import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

const AdminRoute = ({ children, ...rest }) => {

    return (
        <Route {...rest} render={props => isAuthenticated() && isAuthenticated().user.role === 1 ? (
            children
        ) : (
                <Redirect to={{
                    pathname : '/signin',
                    state: { from: props.location }
                }} />
            )
        } />
    )
}

export default AdminRoute;