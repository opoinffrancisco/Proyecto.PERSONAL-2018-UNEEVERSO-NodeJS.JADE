var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var NOVEDAD = require('../../mod/novedad');

var express = require('express');
var router = express.Router();
 
router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					NOVEDAD.all(conexion_db_ON,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							var error_bot = req.session.error_bot;
							var mensaje_error = req.session.mensaje_error;
							req.session.error_bot="";
							req.session.mensaje_error="";

							res.render('admin/novedad.jade', {
								datos : { result : result_0 },
								id_perfil: req.session.id_perfil,
								error_bot : error_bot,
								mensaje_error : mensaje_error,
							});
						}
					});
				};
			});

	}else{
		res.redirect('/admin');
	}
});
router.post('/registrar_nuevo', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 ){
		//console.log(req.body);
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
				NOVEDAD.get_existencia(conexion_db_ON,req.body,function (err_v,result_v) {
			        if(result_v==false)
			        {				
			    		NOVEDAD.registrar_nuevo(conexion_db_ON,req.body,function (result) {
					        if(result==false)
					        {
					        	DBCONEXION.cerrar_conexion(conexion_db_ON);
								res.json({
			    					error : true,
									mensaje : " No se pudo publicar la novedad ",
		    					});

					        }else{
								DBCONEXION.cerrar_conexion(conexion_db_ON);
								res.json({
			    					error : false,
									mensaje : " Novedad publicada ",
		    					});
							};
						});
					}else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.json({
	    					error : true,
							mensaje : " La novedad ya fue publicada ",
						});
					}
				});					
			}
		});
	}else{
		res.json({
			error : true,
			mensaje : "No posee la permisologia"
		});
	}
});
router.post('/editar', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 ){
		console.log(req.body);
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
				NOVEDAD.editar(conexion_db_ON,req.body,function (result) {
			        if(result==false)
			        {
			        	DBCONEXION.cerrar_conexion(conexion_db_ON);
			            //res.json(err);
			            req.session.error_bot = true,
						req.session.mensaje_error = "No se pudo editar la novedad : "+req.body.nombre_muestra;
						res.redirect('/admin/novedad');
			        }else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.redirect('/admin/novedad');
					};
				});
			}
		});
	}else{
		res.json({
			mensaje : "No posee la permisologia"
		});
	}
});
router.post('/cambiar_estado', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 ){
		//console.log(req.body);
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
	    		NOVEDAD.cambiar_estado(conexion_db_ON,req.body,function (result) {
			        if(result==false)
			        {
			        	DBCONEXION.cerrar_conexion(conexion_db_ON);
			            req.session.error_bot = true,
						req.session.mensaje_error = "No se pudo cambiar el estado ";
						res.redirect('/admin/novedad');
			        }else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.redirect('/admin/novedad');
					};
				});
			}
		});
	}else{
		res.json({
			mensaje : "No posee la permisologia"
		});
	}
});


module.exports = router;
