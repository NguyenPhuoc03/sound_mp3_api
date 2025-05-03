const express = require("express");
const router = express.Router();

const artistController = require("../app/controllers/artistController");
const songController = require("../app/controllers/songController");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // phân quyền

router.get("/get-all", artistController.getArtists);
router.get("/:artistId/songs", songController.getSongByArtistId);
router.get("/:artistId", artistController.getArtistById);
router.post("/:artistId/follow", artistController.followArtist);
router.post("/:artistId/unfollow", artistController.unfollowArtist);

router.post("/create", permissionMiddleware, artistController.createArtist);
router.patch(
  "/:artistId",
  permissionMiddleware,
  artistController.updateArtistById
);
router.delete(
  "/:artistId",
  permissionMiddleware,
  artistController.deleteArtistById
);

module.exports = router;
