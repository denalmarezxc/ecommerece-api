const express = require("express");
const productController = require('../controllers/productController.js');
const { verify, verifyAdmin} = require("../auth.js");

// Router
const router = express.Router();


// create product (Admin only)
router.post(`${"/"}`, verify, verifyAdmin, verify, verifyAdmin, productController.addProduct); 

// retrieve all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// retrieve all active products
router.get("/active", productController.getAllActive);

// retrieve a product using id
router.get("/:productId", productController.getProduct);

// update product information (Admin only)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// archive product (Admin only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// activate product (Admin only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

//search product by name
router.post("/search-by-name", productController.getProductByName);

//search products by price range
router.post("/search-by-price", productController.getProductByPrice);


// Export the router
module.exports = router;