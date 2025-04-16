const express = require('express');
const router = express.Router();

const userController = require("../app/controllers/userController");



router.get('/profile', userController.profile);
router.patch('/update-user', userController.updateUser);
router.delete('/delete-user', userController.deleteUser);

module.exports = router;