var router = require('express').Router();

router.use('/users', require('./user'));
router.use('/site', require('./site'));

module.exports = router;