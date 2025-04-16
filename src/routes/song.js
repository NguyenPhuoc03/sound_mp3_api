const express = require("express");
const router = express.Router();

const songController = require("../app/controllers/songController");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // phân quyền


router.get("/get-all", songController.getSongs);
router.get("/:songId", songController.getSongById);

router.post("/create", permissionMiddleware, songController.createSong);
router.patch("/:songId", permissionMiddleware, songController.updateSongById);
router.delete("/:songId", permissionMiddleware, songController.deleteSongById);

module.exports = router;
