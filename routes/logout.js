const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    req.session.cookie.expires = new Date(new Date().getTime - 60).getTime();
    req.session.destroy();
    res.render('logout',{title:"Log Out"});
});

module.exports = router;