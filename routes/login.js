var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var CONFIGURACION = require('../mod/configuracion');
var USUARIO = require('../mod/usuario');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('login.jade');
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
						CONFIGURACION.get_cfg(conexion_db_ON,function(err__,result__){
							//console.log(err_0,result_0);
							if(err__)
							{
								res_.json({
		        					error : true,
		        					error_m : err__,
		        					mensaje : "Error de sistema"
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
											req_.session.id_perfil = result.id_perfil;
											req_.session.nombre_steem = result.nombre_steem;					        		
						        			res_.json({
						        					error : false,
						        					mensaje : "Inicio de sesión existoso.",
						        					datos : result,
						        					token : ENCRIPTACION.encryptUneeverso(JSON.stringify({ id: result.id,
																  nombre_steem: result.nombre_steem,
																  contrasena_uneeverso: result.contrasena_uneeverso,
																  auto_upvotes: result.auto_upvotes,
																  correo_electronico: result.correo_electronico,
																  codigo_recuperacion: result.codigo_recuperacion,
																  id_perfil: result.id_perfil,
																  cant_steem_power_auto: result.cant_steem_power_auto,
																  votos_dia: result.votos_dia,
																  fecha_votos_limitado: result.fecha_votos_limitado,
																  estado_votacion: result.estado_votacion,
																  fecha_registro: result.fecha_registro,
																  votos_error_dia:result.votos_error_dia,
																  limite_votos_dia: result.limite_votos_dia,
																  wif_sin_migrar : result.wif_post_priv_steem,
																  wif_post_priv_steem : result__.promotor_wif_priv_posting,
																}))
						        				});
							        	};
							            
							        }
							    });
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
});
  
module.exports = router;
