const express = require("express");
const mongoose = require("mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");

require('dotenv').config();

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const brainTreeRoutes = require('./routes/braintree');
const orderRoutes = require("./routes/order");

//app
const app = express();

//connect to mongodb
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => console.log("DB CONNECTED"));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// //routes
// app.get('/',(req,res) => {
//     res.send("HELLO WORLD");
// })

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', brainTreeRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port,() => {
    console.log("Node server started at localhost:8000");
})