const Product = require("../models/ProductModel.js");
const Order = require("../models/OrderModel.js");
const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

// to use the methods in auth.js
const auth = require('../auth.js');

//deconstruct errrorHandler from auth
const { errorHandler } = auth;


// Register new user
module.exports.registerUser = (req, res) => {
    // Checks if the email is in the right format
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ message: 'Mobile number invalid' });
    }
    // Checks if the password has at least 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters' });
    } else {
        // Check if email already exists
        User.findOne({ email: req.body.email })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).send({ message: 'Email is already registered' });
                } else {
                    // If email is unique, create a new user
                    let newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        mobileNo: req.body.mobileNo,
                        password: bcrypt.hashSync(req.body.password, 10)
                    });

                    return newUser.save()
                        .then((result) => res.status(201).send({ message: 'Registered Successfully', user: result }))
                        .catch(error => errorHandler(error, req, res));
                }
            })
            .catch(error => errorHandler(error, req, res));
    }
};


// Log-in user
module.exports.loginUser = (req, res) => {
    if (req.body.email.includes('@')) {
        return User.findOne({ email: req.body.email })
            .then(result => {
                if (result === null) {
                    // Return 404 for no email found
                    return res.status(404).send({ message: 'No email found' });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(200).send({ access: auth.createAccessToken(result) });
                    } else {
                        return res.status(401).send({ message: 'Email and password do not match' });
                    }
                }
            })
            .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid Email' });
    }
};


// Get user details
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .select('-password') // Exclude the password field
        .then(user => {
            if (!user) {
                // Return 404 for user not found
                return res.status(404).send({ message: 'User not found' });
            } else {
                return res.status(200).send({ user });
            }
        })
        .catch(error => errorHandler(error, req, res));
};



// Update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Update user to Admin
module.exports.updateUserToAdmin = async (req, res) => {
     try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user role to admin
        user.isAdmin = true;
        const updatedUser = await user.save();

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed in Find', details: error.message });
    }
};
