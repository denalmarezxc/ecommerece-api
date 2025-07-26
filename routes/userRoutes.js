const express = require("express");
const userController = require('../controllers/userController.js');
const { verify, verifyAdmin} = require("../auth.js");

// Router
const router = express.Router();

// register a user 
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.updateUserToAdmin);
router.patch('/update-password', verify, userController.updatePassword);

// Export the router
module.exports = router;