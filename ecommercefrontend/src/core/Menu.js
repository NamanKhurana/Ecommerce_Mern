import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';

//helper method for highlighting the active link
const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' }
    } else {
        return { color: '#ffffff' }
    }
}

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link> {/**history.location.pathname = '/' */}
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">Shop</Link> {/**history.location.pathname = '/shop' */}
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">Cart{" "}<sup><small className = "cart-badge">{itemTotal()}</small></sup></Link> {/**history.location.pathname = '/cart' */}
            </li>
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/user/dashboard')} to="/user/dashboard">Dashboard</Link> {/**history.location.pathname = '/user/dashboard' */}
                </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, '/admin/dashboard')} to="/admin/dashboard">Dashboard</Link> {/**history.location.pathname = '/admin/dashboard' */}
                </li>
            )}
            {(!isAuthenticated()) && (
                <Fragment>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">Signin</Link> {/**history.location.pathname = '/signin' */}
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">Signup</Link> {/**history.location.pathname = '/signup' */}
                    </li>
                </Fragment>
            )}

            {(isAuthenticated()) && (
                <Fragment>
                    <li className="nav-item">
                        <span className="nav-link" style={{ cursor: 'pointer', color: '#ffffff' }} onClick={() => signout(() => {
                            history.push('/')
                        })}>Signout</span> {/**history.location.pathname = '/signup' */}
                    </li>
                </Fragment>
            )}

        </ul>
    </div>
)

//withRouter is used so that we can use "history" prop
export default withRouter(Menu);