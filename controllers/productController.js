// Dependencies and Modules
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");

const auth = require('../auth.js');
// Deconstruct errorHandler from auth
const { errorHandler } = auth;


// Add a new product (Admin only)
module.exports.addProduct = (req, res) => {
    try {
        // Create a new Product object from the request body
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            isActive: req.body.isActive || true, // Assume active by default
        });

        // Check if the product already exists
        return Product.findOne({ name: req.body.name })
            .then(existingProduct => {
                if (existingProduct) {
                    return res.status(409).send({ message: 'Product already exists' });
                } else {
                    // Save the new product
                    return newProduct.save()
                        .then(result => res.status(201).send({
                            success: true,
                            message: "Product added successfully",
                            result
                        }))
                        .catch(error => errorHandler(error, req, res));
                }
            })
            .catch(error => errorHandler(error, req, res));
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


// Get all products
module.exports.getAllProducts = (req, res) => {
    try {
        // Check if the user is authorized
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).send({ message: 'Access forbidden: insufficient permissions' });
        }

        // Fetch all products
        Product.find({})
            .then(products => {
                if (products && products.length > 0) {
                    return res.status(200).send(products);
                } else {
                    return res.status(404).send({ message: "No products found" });
                }
            })
            .catch(error => {
                console.error(error); // For debugging
                return res.status(500).send({ message: 'Server error occurred' });
            });
    } catch (error) {
        console.error(error); // Log unexpected errors
        return res.status(500).send({ message: 'Unexpected error occurred' });
    }
};


// Retrieve all active products
module.exports.getAllActive = (req, res) => {
    return Product.find({ isActive: true })
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send({ message: 'No active products found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

// Retrieve a product using id
module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (product) {
                return res.status(200).send(product);
            } else {
                return res.status(404).send({ error: 'Product not found' });
            }
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({ error: 'Server error occurred' });
        });
};

// Update a product (Admin only)
module.exports.updateProduct = (req, res) => {
    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        isActive: req.body.isActive,
    };

    Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true })
        .then(product => {
            if (product) {
                return res.status(200).send({ message: 'Product updated successfully', product });
            } else {
                return res.status(404).send({ error: 'Product not found' }); // Return structured error
            }
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({ error: 'Server error occurred' });
        });
};


// Archive a product (Admin only)
module.exports.archiveProduct = (req, res) => {
    let updateActiveField = { isActive: false };

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(product => {
            if (product) {
                return res.status(200).send({ success: true, message: 'Product archived successfully' });
            } else {
                return res.status(404).send({ message: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


// Activate a product (Admin only)
module.exports.activateProduct = (req, res) => {
    let updateActiveField = { isActive: true };

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true })
        .then(product => {
            if (product) {
                return res.status(200).send({ success: true, message: 'Product activated successfully' });
            } else {
                return res.status(404).send({ message: 'Product not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


// Get product by name
module.exports.getProductByName = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "Product name is required" });
    }

    const searchRegex = new RegExp(name, 'i'); // Case-insensitive search

    return Product.find({ name: searchRegex })
        .then(products => {
            if (products.length > 0) {
                return res.status(200).send(products);
            } else {
                return res.status(404).send({ message: "No products found matching the name" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


// Get products by price range
module.exports.getProductByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
        return res.status(400).send({ message: "Both minPrice and maxPrice are required" });
    }

    if (minPrice > maxPrice) {
        return res.status(400).send({ message: "minPrice cannot be greater than maxPrice" });
    }

    return Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
    })
        .then(products => {
            if (products.length > 0) {
                return res.status(200).send(products);
            } else {
                return res.status(404).send({ message: "No products found in the specified price range" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};