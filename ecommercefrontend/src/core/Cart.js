import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { getCart } from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout';

const Cart = () => {
    //get items from localstorage and add in 'items' state
    const [items, setItems] = useState([]);
    // const [cartSize, setCartSize] = useState([]);

    //'run' state is used to tell the parent component (in this case 'cart.js') when to run the useEffect hook again .
    const [run, setRun] = useState(false);

    useEffect(() => {
        console.log('MAX DEPTH ...');
        setItems(getCart());
    }, [run]); //whenever 'run'state will change, useEffect hook will run

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr />
                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun} //setRun function (used to change the state of 'run' is sent as a prop to Card component)
                        run={run} //'run' state is sent as a prop to Card component
                    // changeCartSize={changeCartSize}
                    />
                ))}
            </div>
        );
    };

    const noItemsMessage = () => (
        <h2>
            Your Cart is empty. <br />
            <Link to="/shop"> Continue shopping. </Link>
        </h2>
    );

    return (
        <Layout title="Shopping Cart" description="Checkout now!" className="container-fluid">
            <div className="row">
                <div className="col-6">{items.length > 0 ? showItems(items) : noItemsMessage()}</div>
                <div className="col-6">
                    <h2 className="mb-4">Your Cart Summary</h2>
                    <hr />
                    <Checkout products={items} setRun = {setRun} run = {run}/>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;