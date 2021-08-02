const express = require('express');
const Security = require('./../../security');
const { setTime, getTime } = require('./controllers');

const router = express.Router();

router.post('/set', Security.auth(['superadmin']), setTime);
// -----------------------
router.get('/', getTime);
// -----------------------

module.exports = router;