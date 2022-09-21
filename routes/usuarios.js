var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var USUARIO = require('../mod/usuario');

var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res) {

	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			USUARIO.get_usuarios_activos(conexion_db_ON,{desde:0,limite:380},function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{			
					res.render('usuarios.jade', {
						datos : { result : result_0 },
					});
				}
			});
		};
	});

});

router.post('/list_page', function(req, res) {

	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			//console.log(req.body);
			USUARIO.get_usuarios_activos(conexion_db_ON,req.body,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json({
						error : true,
						mensaje_e : err_0,
					});
				}else{	
					res.json({
						error : false,
						datos : result_0,
					});
				}
			});
		};
	});

});

module.exports = router;
