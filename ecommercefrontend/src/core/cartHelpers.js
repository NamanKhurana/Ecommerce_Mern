//function to add item to localstorage
//next is a callback function which will run after adding item to localstorage
export const addItem = (item, next) => {
    let cart = []

    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            //if cart item is there in localstorage , then populate that item to the cart variable
            cart = JSON.parse(localStorage.getItem('cart')) //JSON.parse => to convert json to object
        }

        //extra 'count' key is added to increment/decrement product quantity
        cart.push({
            ...item,
            count: 1
        })


        // remove duplicates (localstorage will have not have two products with same name, in that case the quantity of that product will be increased afterwards instead of adding a new item in the cart)
        
        // build an Array from new Set and turn it back into array using Array.from
        // so that later we can re-map it
        // new set will only allow unique values in it
        // so pass the ids of each object/product
        // If the loop tries to add the same value again, it'll get ignored
        // ...with the array of ids we got on when first map() was used
        // run map() on it again and return the actual product from the cart

        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id);
        });

        localStorage.setItem("cart",JSON.stringify(cart));
        next()
    }
}

//function to show total items in the cart
export const itemTotal = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')).length;
        }
    }
    return 0;
};

//get all items from localstorage to display in 'cart' component
export const getCart = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'));
        }
    }
    return [];
};

//function to increment/decrement product count in 'cart' component
export const updateItem = (productId, count) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        cart.map((product, i) => {
            if (product._id === productId) {
                cart[i].count = count;
            }
        });

        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

//function to removeItem from cart(by removing it from 'cart' array in the localstorage)
export const removeItem = productId => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        cart.map((product, i) => {
            if (product._id === productId) {
                cart.splice(i, 1);
            }
        });

        localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
};

//function to empty the cart (by removing 'cart' array from localstorage)
export const emptyCart = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        next();
    }
};