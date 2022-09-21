var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var USUARIO = require('../mod/usuario');
var CONFIGURACION = require('../mod/configuracion');


var express = require('express');
var router = express.Router();

router.post('/', function(req_, res_) {
	//console.log(req_.body);
	if (req_.body.key_master_public!="") {
		if (req_.body.key_master_public=="$sfssdf#SDFS%#$242342&564&23329&%&/%&/%") {
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					CONFIGURACION.get_cfg(conexion_db_ON,function(err__,result__){
						//console.log(err_0,result_0);
						if(err__)
						{
							res_.json(err__);
						}else{		
							USUARIO.get_u_nombre(conexion_db_ON,JSON.parse(ENCRIPTACION.decryptUneeverso(req_.body.token)),function(err_0,result_0){
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
										res_.json({
												error : false,
												datos : ENCRIPTACION.decryptUneeverso(req_.body.token),
												token : ENCRIPTACION.encryptUneeverso(JSON.stringify({ id: result_0.id,
														  nombre_steem: result_0.nombre_steem,
														  auto_upvotes: result_0.auto_upvotes,
														  correo_electronico: result_0.correo_electronico,
														  id_perfil: result_0.id_perfil,
														  cant_steem_power_auto: result_0.cant_steem_power_auto,
														  votos_dia: result_0.votos_dia,
														  fecha_votos_limitado: result_0.fecha_votos_limitado,
														  estado_votacion: result_0.estado_votacion,
														  fecha_registro: result_0.fecha_registro,
														  votos_error_dia:result_0.votos_error_dia,
														  limite_votos_dia: result_0.limite_votos_dia,
														  wif_sin_migrar : result_0.wif_post_priv_steem,
														  wif_post_priv_steem : result__.promotor_wif_priv_posting,
														}))
											});
									}
								}
							});
						}
					});
				};
			});

		}else{
			res_.json({error : true, mensaje : "Contraseña maestra publica erronea"});
		}
	}else{
		res_.json({error : true, mensaje : "Contraseña maestra publica vacia"});
	};
});

module.exports = router;
