var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('seguidores.jade');
});
/* GET home page. */
router.get('/:user/seguidores', function(req, res) {
    res.render('seguidores.jade');
});

router.get('/:page.html', function(req, res) {
    res.render(req.param('page'));
});


router.get('/:dir/:page.html', function(req, res) {
    res.render(req.param('dir')+'/'+req.param('page'));//.replace(".html", ""));
});

module.exports = router;
