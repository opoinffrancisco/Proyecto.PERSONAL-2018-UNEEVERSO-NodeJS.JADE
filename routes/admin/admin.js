var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var USUARIO = require('../../mod/usuario');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log(req.session.id_perfil);
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
		res.redirect('/admin/index');
	}else{
		res.render('admin/login.jade');
	}	    
});
router.get('/index', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
		res.render('admin/index.jade', {id_perfil: req.session.id_perfil});
	}else{
		res.redirect('/admin');
	}
});

router.post('/iniciar_sesion', function(req_, res_) {
	//console.log(req_.body);
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			USUARIO.get_u_nombre(conexion_db_ON,req_.body,function(err_0,result_0){
				//console.log(err_0,result_0);
		        if(err_0)
		        {
		            res_.json(err_0);
		        }else{
		        	if (result_0==false) {
						res_.json({
		        					error : true,
		        					error_m : err_0,
		        					mensaje : "El usuario no existe en uneeverso"
		        				});
		        	}else{
		        		USUARIO.get_iniciar_sesion(conexion_db_ON,req_.body,function(error,result){
							//console.log(error,result);
					        if(error)
					        {
					            res_.json(error);
					        }else{

					        	if (result==false) {
					        		res_.json({
					        					error : true,
					        					error_m : error,
					        					mensaje : "Contraseña incorrecta."
					        				});
					        	}else{
									
				        			if (result.id_perfil==1 || result.id_perfil==2) {
				        				req_.session.id_perfil = result.id_perfil;
				        				req_.session.nombre_steem = result.nombre_steem;
				        				res_.json({
				        					error : false,
											mensaje : "Organizador, Inicio de sesión existoso.",
				        					datos : result,
				        					token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result))
				        				});
				        			} else{
				        				res_.json({
				        					error : true,
											mensaje : "No eres un organizador de uneeverso",
				        					datos : result,
				        					token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result))
				        				});
				        			};
					        	};
					            
					        }
					    });
		        	};
		            
		        }
		    });	
		};
	});	    
});

router.get('/cerrar_sesion', function(req, res) {
	req.session.id_perfil = null;
	req.session.nombre_steem = null;
	res.redirect('/admin');
});


module.exports = router;
