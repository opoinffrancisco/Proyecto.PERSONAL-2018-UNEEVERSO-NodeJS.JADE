var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var GESTION_URL = require('../../mod/gestion_url');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					GESTION_URL.get_a_url_votacion(conexion_db_ON,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							res.render('admin/auto_votacion.jade', {
								dias_auto : 7,
								datos : { result : result_0 },
								id_perfil: req.session.id_perfil
							});
						}
					});
				};
			});

	}else{
		res.redirect('/admin');
	}
});
router.post('/buscar', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					GESTION_URL.get_a_url_votacion_buscar(conexion_db_ON, req.body,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							res.render('admin/auto_votacion.jade', {
								dias_auto : (req.body.dias_post=="")? 7 : req.body.dias_post,								
								datos : { result : result_0 },
								id_perfil: req.session.id_perfil
							});
						}
					});
				};
			});
	}else{
		res.redirect('/admin');
	}
});
router.post('/editar', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1){
		//console.log(req.body);	
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
	    		GESTION_URL.editar_url(conexion_db_ON,req.body,function (err) {
			        if(err)
			        {
			        	DBCONEXION.cerrar_conexion(conexion_db_ON);
			            res.json(err);
			        }else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.redirect('/admin/auto_votacion');
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
