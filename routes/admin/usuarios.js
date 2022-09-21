var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var USUARIO = require('../../mod/usuario');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					USUARIO.get_a_usuarios(conexion_db_ON,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							res.render('admin/usuarios.jade', {
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
	if(req.session.id_perfil && req.session.id_perfil==1 ){
		console.log(req.body);	
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;
	    		USUARIO.editar(conexion_db_ON,req.body,function (err) {
			        if(err)
			        {
			        	DBCONEXION.cerrar_conexion(conexion_db_ON);
			            res.json(err);
			        }else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.json({
	    					error : false,
	    					mensaje : "Datos editados"
	    				});
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

router.post('/asignar_steem_power_voto', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 ){
		console.log(req.body);
		if ( req.body.si_tiene && (req.body.si_menor || req.body.si_mayor)) {
			res.json({
				mensaje : "Esa combinación no es posible, vuelva a la administración"
			});
		}else{
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
		    		USUARIO.cfg_auto_usuario_admin(conexion_db_ON,req.body,function (err) {
				        if(err)
				        {
				        	DBCONEXION.cerrar_conexion(conexion_db_ON);
				            res.json(err);
				        }else{
							DBCONEXION.cerrar_conexion(conexion_db_ON);
							res.redirect('/admin/usuarios');
						};
					});
				}
			});
		}
	}else{
		res.json({
			mensaje : "No posee la permisologia"
		});
	}
});


module.exports = router;
