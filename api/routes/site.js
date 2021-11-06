var router = require('express').Router();
const siteController = require("../controllers/siteController");


router.post('/create', siteController.createSite);
router.post('/getbyid', siteController.getSiteById);

module.exports = router;