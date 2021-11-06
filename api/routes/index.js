var router = require('express').Router();

router.use('/users', require('./user'));
router.use('/sites', require('./site'));

module.exports = router;