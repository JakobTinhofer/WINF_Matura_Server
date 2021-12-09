var router = require('express').Router();
const siteController = require("../controllers/siteController");


router.post('/create', siteController.createSite);
router.post('/getbypath', siteController.getSiteByPath);
router.post('/getvisible', siteController.getVisibleSitesByFilter);
router.post('/geteditfields', siteController.getEditFields);
router.post('/editsite', siteController.editSite);
router.post('/deletesite', siteController.deleteSite);
router.post('/setcustompath', siteController.setCustomPath);
router.get('*', siteController.getSiteContent);

module.exports = router;