import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card';
import { getCategories, getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { prices } from './fixedPrices';

const Shop = () => {

    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    })
    const [categories, setCategories] = useState([])
    // eslint-disable-next-line 
    const [error, setError] = useState(false)
    // eslint-disable-next-line 
    const [limit, setLimit] = useState(6)
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(0) //this will be used to render more products after clicking load more button
    const [filteredResults, setFilteredResults] = useState([])

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setCategories(data)
            }
        })
    }

    const loadFilteredResults = (newFilters) => {
        // console.log(newFilters)
        getFilteredProducts(skip, limit, newFilters)
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setFilteredResults(data.data)
                    setSize(data.size)
                    setSkip(0) //we set skip to 0 becoz it will be used later to load more products
                }
            })
    }

    //!This function needs attention (Not able to understand it)
    const loadMore = () => {
        let toSkip = skip + limit
        // console.log(newFilters)
        getFilteredProducts(toSkip, limit, myFilters.filters)
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    //Here we have old data as filteredResults and we add new data to it
                    setFilteredResults([...filteredResults, ...data.data])
                    setSize(data.size)
                    setSkip(toSkip)
                }
            })
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">Load More</button>
            )
        )
    }

    useEffect(() => {
        init()
        loadFilteredResults(skip, limit, myFilters.filters)
    }, [])

    //Function to get categoryids from child component (checkbox) to parent component (shop)
    //filters arg can contain array of category ids or price range
    //filterby arg tells to filter by category or by price
    const handleFilters = (filters, filterby) => {
        // console.log(filters,filterby)
        const newFilters = { ...myFilters }
        newFilters.filters[filterby] = filters

        if (filterby == 'price') {
            //Here filters argument contains any value from 0 to 5
            let priceValues = handlePrice(filters)
            newFilters.filters[filterby] = priceValues
        }

        loadFilteredResults(myFilters.filters)

        setMyFilters(newFilters)
    }

    //This method will extract array value from the key
    const handlePrice = (value) => {
        //return prices[parseInt(value)].array

        const data = prices
        let array = []

        //Here if we use 'in' keyword, then 'key' will take values from 0 - 5 (which is the index of the array elements)
        //But if we use 'of' keyword, then 'key' will be a price object from 'prices' array
        for (let key in data) {
            //console.log(key)
            if (data[key]._id === parseInt(value)) {
                array = data[key].array
            }
        }

        return array
    }

    return (
        <Layout title="Shop Page" description="You are not a shop-o-holic , You are just helping the economy 😃" className="container-fluid">
            <div className="row">
                <div className="col-4">
                    <h4>Filter by Categories</h4>
                    <ul>
                        <Checkbox categories={categories} handleFilters={filters => handleFilters(filters, "category")} />
                    </ul>
                    <h4>Filter by Price Range</h4>
                    <div>
                        <RadioBox prices={prices} handleFilters={filters => handleFilters(filters, "price")} />
                    </div>
                </div>
                <div className="col-8">
                    {/* {JSON.stringify(filteredResults)} */}
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, index) => {
                            return (
                                <div key={index} className="col-4 mb-3">
                                    <Card product={product} />
                                </div>)
                        })}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>

        </Layout>
    )
}

export default Shop;