var router = require('express').Router();

router.use('/users', require('./user'));
router.use('/sites', require('./site'));
router.use('/tags', require("./tags"));

module.exports = router;