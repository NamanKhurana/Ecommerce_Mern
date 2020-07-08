import React, { useState, useEffect } from 'react';
import { getCategories, list } from './apiCore';
import Card from './Card';

const Search = () => {

    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    })

    const { categories, category, search, results, searched } = data

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setData({ ...data, categories: data })
            }
        })
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const searchData = () => {
        //console.log(search,category)
        if (search) {
            list({ search: search || undefined, category: category })
                .then((response) => {
                    if (data.error) {
                        console.log(response.error)
                    } else {
                        setData({ ...data, results: response, searched: true })
                    }
                })
        }
    }

    const searchSubmit = (event) => {
        event.preventDefault()

        searchData()
    }

    const handleChange = name => (event) => {
        //searched option/state will be used to determine if the user has already searched
        //if the user has searched but nothing was found in the database then we can show a msg 'Product not found'
        setData({ ...data, [name]: event.target.value, searched: false })
    }

    const searchedMessage = (searched,results) => {
        if(searched && results.length > 0){
            return `Found ${results.length} products`
        }
        if(searched && results.length < 1){
            return `No products Found`
        }
    }

    const searchedProducts = (results = []) => {
        return (<div>
            <h2 className = "mt-4 mb-4">{searchedMessage(searched,results)}</h2>
            <div className="row">
                {results.map((product, index) => <Card key={index} product={product} />)}
            </div>
        </div>)
    }

    const searchForm = () => {
        return (<form onSubmit={searchSubmit}>
            {/**To make the form inline or in a single line, we have used span tag */}
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange("category")}>
                            <option value="All">All</option>
                            {categories.map((category, index) => {
                                return (
                                    <option key={index} value={category._id}>{category.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <input type="search" className="form-control" onChange={handleChange("search")} placeholder="Search By Name" />
                </div>
                <div className="btn input-group-append" style={{ border: 'none' }}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>)
    }

    return (<div className="row">
        <div className="container mb-3">
            {searchForm()}
            {/* {JSON.stringify(results)} */}
        </div>
        <div className="container-fluid mb-3">
            {searchedProducts(results)}
        </div>
    </div>)
}

export default Search;