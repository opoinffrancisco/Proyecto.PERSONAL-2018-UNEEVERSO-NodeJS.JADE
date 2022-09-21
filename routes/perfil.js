var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_blog.jade');
});

router.get('/seguidores', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_seguidores.jade');
});
router.get('/siguiendo', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_siguiendo.jade');
});

router.get('/comentarios', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_comentarios.jade');
});
router.get('/respuestas', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_respuestas.jade');
});
router.get('/recompensas-autor', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_recomensas_autor.jade');
});
router.get('/recompensas-curacion', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_recomensas_curacion.jade');
});
router.get('/monedero', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_monedero.jade');
});
router.get('/configuracion', function(req, res) {
    //res.render('perfil.jade');
    res.render('perfil_extends/perfil_configuracion.jade');
});

module.exports = router;
