const s3 = require('../config/s3');
const File = require('../models/file');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');

// Upload File
exports.uploadFile = (req, res) => {
    const file = req.file;
    const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: file.filename,
        Body: fs.createReadStream(file.path)
    };
    s3.upload(uploadParams, async (err, data) => {
        if (err) return res.status(500).send(err);
        await File.create({ name: file.originalname, url: data.Location, size: file.size });
        fs.unlinkSync(file.path); // Remove temp file
        res.json({ message: 'File uploaded', data });
    });
};

// Download File
exports.downloadFile = async (req, res) => {
    const file = await File.findById(req.params.id);
    const downloadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: file.key
    };
    s3.getObject(downloadParams).createReadStream().pipe(res);
};
