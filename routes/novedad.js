var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var NOVEDAD = require('../mod/novedad');

var express = require('express');
var router = express.Router();
 
/* GET home page. */
router.get('/', function(req, res) {

	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			NOVEDAD.all_web(conexion_db_ON,{desde:0,limite:6},function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{			
					res.render('novedad.jade', {
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
			console.log(req.body);
			NOVEDAD.all_web(conexion_db_ON,req.body,function(err_0,result_0){
				console.log(err_0,result_0);
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

router.get('/:enlace_permanente/@:usuario', function(req_, res_) {
	
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			NOVEDAD.get_disponibilidad_web(conexion_db_ON,req_.params,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res_.json(err_0);
				}else{
				    res_.render('novedad_publicacion.jade',{
				    	result_disponibilidad : (result_0)?true:false,
				    	etiquera_url : req_.params.etiqueta,
				    	usuario_url : req_.params.usuario,
				    	enlace_permanente : req_.params.enlace_permanente,
				    });
				}
			});
		};
	});

});

module.exports = router;
