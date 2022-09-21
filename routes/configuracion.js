var steem = require('steem-uneeverso-oficial');
var moment = require('moment-timezone');
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var CONFIGURACION = require('../mod/configuracion');
var USUARIO = require('../mod/usuario');
var GESTION_URL = require('../mod/gestion_url');
var BOT = require('../mod/bot');
var OPINION_DESACTIVACION = require('../mod/opinion_desactivacion');
var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
	res.render('perfil_extends/perfil_configuracion.jade');
});

router.get('/automatizacion', function(req, res) {
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{			
					res.render('perfil_extends/perfil_configuracion_automatizacion.jade', {
						datos: result_0,
						sp_min_fomat: result_0.cant_minima_steem_power.toString().substring(0, 1)+"."+result_0.cant_minima_steem_power.toString().substring(1, 3)+" % ",
						sp_max_fomat: result_0.cant_maxima_steem_power.toString().substring(0, 2)+"."+result_0.cant_maxima_steem_power.toString().substring(2, 4)+" % ",
					});
				}
			});
		};
	});
});
router.post('/automatizacion/cfg_auto_usuario', function(req, res) {
	
	CONFIGURACION.get_cfg(conexion_db_ON,function(err__,result__){
		//console.log(err_0,result_0);
		if(err__)
		{
			res.json(err__);
		}else{
			if (result__.estado_mantenimiento==0) {	
				CONFIGURACION.get_cfg(conexion_db_ON,function (error_1, result_1) {
					var error = false;
					var mensaje_;
					if (req.body.cant_steem_power_auto<result_1.cant_minima_steem_power) {
						error=true;
						mensaje_="STEEM POWER POR VOTO, es menor a "+result_1.cant_minima_steem_power.toString().substring(0, 1)+"."+result_1.cant_minima_steem_power.toString().substring(1, 3)+" % ";
					}
					if(req.body.cant_steem_power_auto>result_1.cant_maxima_steem_power){
						error=true;
						mensaje_="STEEM POWER POR VOTO, es mayor a "+result_1.cant_maxima_steem_power.toString().substring(0, 2)+"."+result_1.cant_maxima_steem_power.toString().substring(2, 4)+" % ";
					};

					
					if(req.body.limite_votos_dia<result_1.limit_votos_votante){
						error=true;
						mensaje_="LIMITE DE VOTOS POR DIA, es menor a "+result_1.limit_votos_votante;
					};

					if (error==false) {
						USUARIO.cfg_auto_usuario(conexion_db_ON,req.body,function (err) {
					        if(err)
					        {
					            res.json(err);
					        }else{
								//console.log(req.body);
								USUARIO.get_u_nombre(conexion_db_ON,req.body,function(err_0,result_0){
									//console.log(err_0,result_0);
									if(err_0)
									{
										res.json(err_0);
									}else{
										if (result_0==false) {
											res.json({
												error : true,
												error_m : err_0,
												mensaje : "El usuario no existe en uneeverso"
											});
										}else{										
											res.json({
												error : false,
												mensaje : "Confiuración de automatización actualizada",
												token : ENCRIPTACION.encryptUneeverso(JSON.stringify({ id: result_0.id,
														  nombre_steem: result_0.nombre_steem,
														  auto_upvotes: result_0.auto_upvotes,
														  correo_electronico: result_0.correo_electronico,
														  codigo_recuperacion: result_0.codigo_recuperacion,
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

					} else{
						res.json({
							error : true,
							mensaje : mensaje_,
						});
					};
				});
			}else{			
				res.json({
					error : true,
					error_m : "",
					mensaje : "Nos econtramos en mantenimiento"
				});
			}
		}
	}); 
});

setInterval(function () {
	mantenimiento_bots_automatizado();
},1000*60*5);// cada 5 min
function mantenimiento_bots_automatizado() {
	CONFIGURACION.get_cfg(conexion_db_ON,function(err_cfg,result_cfg){
		//console.log(err_0,result_0);
		if(err_cfg)
		{
			console.log(err_cfg);
		}else{
				var estado_mantenimiento_bot;
				if (UTILIDAD.hora_actual_()==result_cfg.mantenimiento_bot_inicio){//Iniciar mantenimiento bots
					if (result_cfg.estado_mantenimiento==0) {
						estado_mantenimiento_bot=1;
						CONFIGURACION.gestion_mant_auto(conexion_db_ON,estado_mantenimiento_bot,function(err_0,result_0){
							if (err_0){
								console.log(err_0);
							};
						});
					}else{
						console.log(" www.uneeverso.com en mantenimiento | AUN NO SE INICIARA EL DESCANSO DE BOTS");
					};
				} else if(UTILIDAD.hora_actual_()==result_cfg.mantenimiento_bot_terminar){//Terminar mantenimiento bots
						estado_mantenimiento_bot=0;
						CONFIGURACION.gestion_mant_auto(conexion_db_ON,estado_mantenimiento_bot,function(err_0,result_0){
							if (err_0) {
								console.log(err_0);
							};
						});
				}
		}
	});
};

DBCONEXION.iniciar_conexion(function (conexion_db) {

		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
		}else{

		}
});

module.exports = router;