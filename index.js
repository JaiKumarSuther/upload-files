// create app
const express = require('express');
const app = express();

// find port
require('dotenv').config();
const PORT = process.env.PORT;

// add middleware
app.use(express.json());

// middleware for uploading files
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));

// db connect
const db = require('./config/database');
db.connectDB();

// connect with cloudary
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// define api routes
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload', Upload);

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
})
