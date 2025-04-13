const express = require('express');
const router = express.Router();

const albumController = require("../app/controllers/albumController");
const auth = require("../middlewares/authMiddleware");

//router.use(auth);

router.post('/create', albumController.createAlbum);
router.get('/get-all', albumController.getAlbums);
router.get('/:albumId', albumController.getAlbumById);
router.patch('/:albumId', albumController.updateAlbumById);
router.delete('/:albumId', albumController.deleteAlbumById);

module.exports = router;