const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');



const cors = require('cors');
dotenv.config();
const app = express();


// Database:
mongoose.connect(process.env.MONGODB_STRING);

// Status of the connection:
let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", ()=> console.log("Now connected to MongoDB Atlas."));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const corsOptions = {
	origin: ['http://localhost:3000'],
	// methods: ['GET'] //allow only specified HTTP methods //optional only if you want to restrict methods
	// allowHeaders: ['Content-Type', "Authorization"], //allow specified
	credentials: true, //allow credentials example cookis, authorization headers
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// [SECTION] Google Login
// Creates a session with the given data
// app.use(session({
// 	secret: process.env.clientSecret,
// 	resave: false,
// 	saveUninitialized: false
// }));


// Backend route for the users request:
app.use("/b5/users", userRoutes);
app.use("/b5/products", productRoutes);
app.use('/b5/orders', orderRoutes);
app.use('/b5/cart', cartRoutes);





if(require.main === module){
	app.listen(process.env.PORT || 3000, ()=> {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = {app, mongoose};