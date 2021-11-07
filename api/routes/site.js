var router = require('express').Router();
const siteController = require("../controllers/siteController");


router.post('/create', siteController.createSite);
router.post('/getbypath', siteController.getSiteByPath);
router.get('*', siteController.getSiteContent);

module.exports = router;