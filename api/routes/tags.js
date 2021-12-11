var router = require('express').Router();
const tagController = require("../controllers/tagController");


router.post('/create', tagController.createNewTag);
router.post('/get', tagController.getAllTags);
router.post('/modifysite', tagController.modifySiteTags);

module.exports = router;