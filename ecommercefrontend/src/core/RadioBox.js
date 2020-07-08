// eslint-disable-next-line 
import React, { useState, useEffect, Fragment } from 'react';

const RadioBox = ({ prices,handleFilters }) => {
    // eslint-disable-next-line 
    const [value, setValue] = useState(0);

    const handleChange = (event) => {
        //event.target.value can take any value from 0 to 5
        //'event.target.value' parameter is acting as the 'filters' parameter in the handleFilters method  in Shop component and this method is passed to the child component(RadioBox) as a prop
        handleFilters(event.target.value)
        setValue(event.target.value)
    }

    return (
        prices.map((price, index) => {
            return (
                <div key={index}>
                    {/**The name attribute will allow only one of the radio buttons to be checked */}
                    <input onChange={handleChange} value={`${price._id}`} name = {price} type="radio" className="mr-2 ml-4" />
                    <label className="form-check-label">{price.name}</label>
                </div>
            )
        })
    )
}

export default RadioBox;