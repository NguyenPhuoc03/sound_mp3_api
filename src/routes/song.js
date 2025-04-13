const express = require('express');
const router = express.Router();

const songController = require("../app/controllers/songController");



router.post('/create', songController.createSong);
router.get('/get-all', songController.getSongs);
router.get('/:songId', songController.getSongById);
router.patch('/:songId', songController.updateSongById);
router.delete('/:songId', songController.deleteSongById);

module.exports = router;