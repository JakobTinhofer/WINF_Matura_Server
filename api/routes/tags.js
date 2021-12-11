var router = require('express').Router();
const tagController = require("../controllers/tagController");


router.post('/create', tagController.createNewTag);
router.post('/get', tagController.getAllTags);

module.exports = router;