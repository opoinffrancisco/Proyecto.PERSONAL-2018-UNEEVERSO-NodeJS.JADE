var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var CONFIGURACION = require('../../mod/configuracion');
var USUARIO = require('../../mod/usuario');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							USUARIO.get_usuarios_organizadores(conexion_db_ON,function(err_1,result_1){
								//console.log(err_0,result_0);
								if(err_1)
								{
									res.json(err_1);
								}else{			
									res.render('admin/configuracion.jade', {
										datos : { result : result_0 },
										datos_usuarios : { result : result_1 },
										id_perfil: req.session.id_perfil
									});
								}
							});
						}
					});
				};
			});
	}else if(req.session.id_perfil && req.session.id_perfil==2){
		res.redirect('/admin/index');
	}else{
		res.redirect('/admin');
	}
});

router.post('/guardar', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1){		
		//console.log(req.body);
		//console.log(req.query);
		//console.log(req.params);
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
	    		CONFIGURACION.guardar(conexion_db_ON,req.body,function (err) {
			        if(err)
			        {
			        	DBCONEXION.cerrar_conexion(conexion_db_ON);
			            res.json(err);
			        }else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.redirect('/admin/configuracion');
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
