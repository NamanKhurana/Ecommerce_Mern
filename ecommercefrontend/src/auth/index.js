import { API } from '../config';

export const signup = (user) => {
    // console.log(name,email,password)
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

export const signin = (user) => {
    // console.log(name,email,password)
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}

//function to save user data in localstorage for future use
export const authenticate = (data,next) => {

    if(typeof window !=='undefined'){
        localStorage.setItem('jwt',JSON.stringify(data))
        next() //this is a callback function which can be used to update the state or redirect the user ...
    }
}

export const signout = (next) => {

    if(typeof window !== 'undefined'){
        localStorage.removeItem('jwt')
        next()
        return fetch(`${API}/signout`,{
            method:'GET'
        })
        .then(response => {
            console.log("signout",response)
        })
        .catch(err => console.log(err))
    }
}

export const isAuthenticated = () => {
    if(typeof window == 'undefined'){
        return false
    }

    if(localStorage.getItem('jwt')){
        return JSON.parse(localStorage.getItem("jwt"))
    }else{
        return false
    }
}