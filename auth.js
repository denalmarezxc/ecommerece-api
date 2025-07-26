const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// to use environment variables in this file
dotenv.config();


// Create access token
module.exports.createAccessToken = (user) => {	
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {
		expiresIn: "1d"
	});

}

// Verify user
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ auth: "Failed", message: "No token provided" });
    }
    token = token.slice(7, token.length);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                auth: "Failed",
                message: "Invalid or expired token",
                details: err.message
            });
        }
        req.user = decodedToken; // Attach decoded token to request
        next(); // Proceed to next middleware or route handler
    });
};


// Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
	console.log("This is from verifyAdmin");
	console.log(req.user);
	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Fobidden"
		})
	}
}

// Error handler
module.exports.errorHandler = (err, req, res, next) => {
	console.error(err.code);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})

}