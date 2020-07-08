const formidable = require("formidable");
const _ = require("lodash");
const fs = require('fs');
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {

    Product.findById(id).populate('category').exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            })
        }

        req.product = product;
        next();
    })

}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.create = (req, res) => {

    //Using formidable module to parse the incoming req.body which includes a photo as well 

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({
            error: "Image could not be uploaded"
        })

        //check for all the fields (doesn't include photo)
        const { name, description, price, category, quantity, shipping } = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All the fields are required"
            })
        }

        // console.log("HELLP")
        let product = new Product(fields)
        // console.log(product)

        //files contain the photo
        if (files.photo) {
            console.log("FILES PHOTO", files.photo)

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1mb in size"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(result);
        })
    })

}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deleteProduct) => {
        console.log(deleteProduct)
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            deleteProduct,
            "message": "Product deleted successfully"
        })
    })
}

exports.update = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({
            error: "Image could not be uploaded"
        })

        //check for all the fields 
        const { name, description, price, category, quantity, shipping } = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All the fields are required"
            })
        }

        let product = req.product;

        //(extend() method => Shallowly copy all of the properties in the source objects over to the destination object, and return //the destination object. It's in-order, so the last source (fields) will override properties of the same name in previous arguments.(product)
        product = _.extend(product, fields)

        if (files.photo) {
            console.log("FILES PHOTO", files.photo)

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1mb in size"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(result);
        })
    })

}

/**
 * sell/arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * 
 * !if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    //Here photo is excluded
    Product.find({}, { photo: 0 }).populate("category").sort([[sortBy, order]]).limit(limit).exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        res.json(products)
    })
}

/**
 * This method finds the related products based on req.product.category
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    //The product with given id will be excluded from the products that will be returned
    //All the products that match the current product's category (req.product.category) will be returned 
    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) return res.status(400).json({
                error: 'Products not found'
            })

            res.json(products)
        })
}

exports.listCategories = (req, res) => {
    //distinct method is used to find (and return ) different product categories
    //2nd parameter is a query obeject which is empty in this case
    Product.distinct("category", {}, (err, categories) => {
        if (err) return res.status(400).json({
            error: 'Products not found'
        })

        res.json(categories)
    })
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

/**
 * !This method will be useful when we build react app frontend
 */
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip); //it will be used to "view more" products
    let findArgs = {}; //this object will contain category ids and price range

    // console.log(order, sortBy, limit, skip, req.body.filters);
    //Here 'key' is the key in key : value pair in an object , i.e category and price
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            //Here, For example, if we take price as [0,10] (it means price range from 0 to 10)
            if (key === "price") {
                // gte -  greater than price 
                // lte - less than price
                findArgs[key] = {
                    $gte: req.body.filters[key][0], //it will be 0
                    $lte: req.body.filters[key][1]  //it will be 10
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    // console.log("findArgs", findArgs);
    //findArgs is an object which contains the keys 'catgory' in the form of an array and 'price' in the form 
    //of an object ==> findArgs = {category:[categoryids],price:{$gte:0,$lte:10}}

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

//separate request for getting product photo
exports.photo = (req, res) => {
    if (req.product.photo.data) {
        //the response is not going to be json response
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }

    next();
}

exports.listSearch = (req, res) => {
    //create query object to hold search value and and category value
    const query = {}
    //assign search value to query.name
    if (req.query.search) {
        //Here we are using a regular expression ($regex) and $options:'i' is for case insensitivity (it doesn't matter if req.query.search is in uppercase or lowercase)
        query.name = { $regex: req.query.search, $options: 'i' }
        //assign category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category
        }
        //find the product based on query object with 2 properties 'search' and 'category'
        Product.find(query, (err, products) => {
            if (err) return res.status(400).json({
                error: errorHandler(err)
            })
            res.json(products)
        }).select('-photo')

    }
}

//method to decrease the 'quantity' after a product is sold and increase the 'sold' value by 1
exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id }, //filter based on the incoming id
                update: { $inc: { quantity: -item.count, sold: +item.count } } //update the 'quantity' and 'sold' properties of product which is orderd by the user
            }
        };
    });

    //bulkwrite method is provided by mongoose to update a model in bulk and it takes 'bulOps' as one of the arguments
    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};