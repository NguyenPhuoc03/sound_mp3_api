const express = require("express");
const router = express.Router();

const albumController = require("../app/controllers/albumController");
const songController = require("../app/controllers/songController");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // phân quyền

router.get("/get-all", albumController.getAlbums);
router.get("/:albumId/songs", songController.getSongByArtistId);
router.get("/:albumId", albumController.getAlbumById);

router.post("/create", permissionMiddleware, albumController.createAlbum);
router.patch(
  "/:albumId",
  permissionMiddleware,
  albumController.updateAlbumById
);
router.delete(
  "/:albumId",
  permissionMiddleware,
  albumController.deleteAlbumById
);

module.exports = router;
