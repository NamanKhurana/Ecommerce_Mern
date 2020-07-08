import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

const PrivateRoute = ({ children, ...rest }) => {

    return (
        <Route {...rest} render={props => isAuthenticated() ? (
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

export default PrivateRoute;