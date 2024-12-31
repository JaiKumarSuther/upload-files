const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

exports.localFileUpload = async (req, res) => {
    try {

        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // fetch file
        const file = req.files.file;
        console.log('file-> ', file);

        const path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("path -> ", path);

        file.mv(path, (err) => {
            console.log(err);
        });

        res.json({
            file,
            success: true,
            message: "local file upload successfully"
        });

    } catch(error) {
        console.log(error);
    }
}

isFileTypeSupported = (type, supportedTypes) => {
    return supportedTypes.includes(type);
}

uploadFileToCloudinary = async (file, folder, quality) => {
    const options = {folder};
    options.resource_type = 'auto';
    if(quality) {
        options.quality = quality;
    }
    console.log('temp file path ->', file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload to cloudinary
exports.imageUpload = async (req, res) => {
    try {
        // fetch the data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        // validation
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            res.status(400).json({
                success: false,
                message: 'File format not supported'
            });
        }
        if (file.size > 5242880) {
            return res.status(400).json({
                success: false,
                message: 'Too large, please upload less than 5MB file'
            });
        }
 

        // upload to cloudinary
        const response = await uploadFileToCloudinary(file, "CodeHelp");
        console.log('response: ',response);

        // save entry in the db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image Successfully Uploaded'
        })

    } catch(error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

// video upload karni hai
exports.videoUpload = async (req, res) => {
    try {
        // fetch the data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

       // validation
       const supportedTypes = ['mp4', 'mov'];
       const fileType = file.name.split('.')[1].toLowerCase();

       // todo: add a upper limiit of 5MB for video

       if(!isFileTypeSupported(fileType, supportedTypes)) {
           res.status(400).json({
               success: false,
               message: 'File format not supported'
           });
       }

       // upload to cloudinary
       const response = await uploadFileToCloudinary(file, "CodeHelp");
       console.log('response: ',response);

        // save entry in the db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });


        res.json({
            success: true,
            videoUrl: response.secure_url,
            message: 'Video Successfully Uploaded'
        })


    } catch(error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'something went wrong'
        });
    }
}

exports.imageSizeReducer = async (req, res) => {
    try {
        // fetch the data
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        // validation
        const supportedTypes = ['jpg', 'jpeg', 'png'];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            res.status(400).json({
                success: false,
                message: 'File format not supported'
            });
        }

        // upload to cloudinary
        const response = await uploadFileToCloudinary(file, "CodeHelp", 100);
        console.log('response: ',response);

        // save entry in the db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: 'Image Successfully Uploaded'
        })

    } catch(error) {
        
    }
}