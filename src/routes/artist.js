const express = require("express");
const router = express.Router();

const artistController = require("../app/controllers/artistController");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // phân quyền

router.get("/get-all", artistController.getArtists);
router.get("/:artistId", artistController.getArtistById);

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
