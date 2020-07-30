// eslint-disable-next-line 
import React, { useState, useEffect } from 'react';

const Checkbox = ({ categories,handleFilters }) => {

    const [checked,setChecked] = useState([])

    //Higher order function (function returning another function)
    const handleToggle = categoryId => () => {
        //Check if current category is already in the state
        const currentCategoryId = checked.indexOf(categoryId);

        const newCheckedCategoryId = [...checked]

        //if currently checked category wasn't already there in the state (array) ,then push it in the array(state) else pop it
        if(currentCategoryId === -1){
            newCheckedCategoryId.push(categoryId)
        }else{
            newCheckedCategoryId.splice(currentCategoryId,1)
        }

        //console.log(newCheckedCategoryId)
        setChecked(newCheckedCategoryId)
        //parent method called here
        //newCheckedCategoryId is the array of categoryids . This argument is acting as the filters parameter
        handleFilters(newCheckedCategoryId)
    }

    return (
        categories.map((category, index) => {
            return (
                <li key = {index} className="list-unstyled">      
                    {/**The value attribute will be used to show the checked item.
                     *We need to show checked/unchecked input field that is not just for visual purpose purpose but also to actually update the categories array in state. So indexOf will try to find that id in the array. if found it will return true so input value is checked. if not found then it will return -1 which will show input value unchecked while updating the state.*/}
                    <input onChange = {handleToggle(category._id)} value = {checked.indexOf(category._id === -1)} type="checkbox" className="form-check-input" />
                    <label className="form-check-label">{category.name}</label>
                </li>
            )
        })
    )
}

export default Checkbox;