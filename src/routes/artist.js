const express = require('express');
const router = express.Router();

const artistController = require("../app/controllers/artistController");



router.post('/create', artistController.createArtist);
router.get('/get-all', artistController.getArtists);
router.get('/:artistId', artistController.getArtistById);
router.patch('/:artistId', artistController.updateArtistById);
router.delete('/:artistId', artistController.deleteArtistById);

module.exports = router;