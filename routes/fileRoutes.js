const express = require('express');
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/:id/download', fileController.downloadFile);

module.exports = router;
