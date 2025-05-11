const express = require("express");
const router = express.Router();

const historyController = require("../app/controllers/historyController");
const permissionMiddleware = require("../middlewares/permissionMiddleware"); // phân quyền



router.post("/create", historyController.createHistorySong);
router.delete("/:historyId", historyController.deleteHistorySong);

router.get("/get-all", historyController.getHistorySongs);

// router.patch("/:songId", permissionMiddleware, songController.updateSongById);


module.exports = router;
