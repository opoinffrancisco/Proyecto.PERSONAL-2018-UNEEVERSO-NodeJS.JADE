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
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{			
					res.render('perfil_extends/perfil_automatizacion.jade', {
						datos: result_0,
						sp_min_fomat: result_0.cant_minima_steem_power.toString().substring(0, 1)+"."+result_0.cant_minima_steem_power.toString().substring(1, 3)+" % ",
						sp_max_fomat: result_0.cant_maxima_steem_power.toString().substring(0, 2)+"."+result_0.cant_maxima_steem_power.toString().substring(2, 4)+" % ",
					});
				}
			});
		};
	});
});
router.post('/cargar_lista_votos_personal', function(req_, res_) {
	//console.log(req_.body);
	//DBCONEXION.iniciar_conexion(function (conexion_db) {
	//	if (conexion_db!=false) {
			GESTION_URL.cargar_lista_votos_personal(conexion_db_ON,req_.body,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res_.json(err_0);
				}else{			
					if (result_0) {
						res_.json({
		    					error : false,
								mensaje : "Existen "+result_0.length+" publiciones que recibieron upvotes los ultimos 7 dias.",
								datos : result_0
		    				});
					} else{
						res_.json({
								error : true,
		    					error_m : err_0,
		    					mensaje : "Actualmente, no tienes url en espera de upvotes."
							});
					};
				}
			});
    //	};
	//});
});
router.post('/cargar_lista_espera_personal', function(req_, res_) {
	//console.log(req_.body);
	//DBCONEXION.iniciar_conexion(function (conexion_db) {
	//	if (conexion_db!=false) {
			GESTION_URL.cargar_lista_espera_personal(conexion_db_ON,req_.body,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res_.json(err_0);
				}else{			
					if (result_0) {
						res_.json({
		    					error : false,
								mensaje : "Existen "+result_0.length+" url en espera de upvotes.",
								datos : result_0
		    				});
					} else{
						res_.json({
								error : true,
		    					error_m : err_0,
		    					mensaje : "Actualmente, no tienes url en espera de upvotes."
							});
					};
				}
			});
    //	};
	//}); 
});
router.post('/cargar_lista_detenidos_personal', function(req_, res_) {
	//console.log(req_.body);
	//DBCONEXION.iniciar_conexion(function (conexion_db) {
	//	if (conexion_db!=false) {
			GESTION_URL.cargar_lista_detenidos_personal(conexion_db_ON,req_.body,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res_.json(err_0);
				}else{			
					if (result_0) {
						res_.json({
		    					error : false,
								mensaje : "Existen "+result_0.length+" publicaciones detenidas, por tener desactivada la autmatización.",
								datos : result_0
		    				});
					} else{
						res_.json({
								error : true,
		    					error_m : err_0,
		    					mensaje : "Actualmente, no tienes url detenida por automatización desactivada."
							});
					};
				}
			});
    //	};
	//});
});
router.post('/activar_desactivar_automatizacion', function(req_, res_) {

	CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
		//console.log(err_0,result_0);
		if(err_0)
		{
			res_.json(err_0);
		}else{			
			if (result_0.estado_mantenimiento==0) {

				//console.log(req_.body);
				GESTION_URL.activar_desactivar_automatizacion(conexion_db_ON,req_.body,function (result_2) {
					GESTION_URL.verificar_activar_desactivar_automatizacion(conexion_db_ON,req_.body,function(err_3,result_3){
						if (result_3!=false) {
							//console.log(JSON.stringify(result_3));
							var mensaje_estado="";
							if (result_3.auto_upvotes==1) {
								//Activar publicaciones de usuario en espera de upvotes
								var estado_post=0;//estado actual de post
								var nuevo_estado_post=1;//Nuevo estado  de post
								mensaje_estado = "Automatización activada";
							} else{
								//Detener publicaciones de usuario en espera de upvotes
								var estado_post=1;
								var nuevo_estado_post=0;
								mensaje_estado = "Automatización desactivada";
							};
							GESTION_URL.gestion_url_activar_desactivar(conexion_db_ON,result_3.nombre_steem,estado_post,nuevo_estado_post,function(err_4,result_4){
								if (err_4) {
									res_.json({
										error : true,
										error_m : err_3,
										mensaje : "Error al cambiar el estado de las publicaciones"
									});	
								} else{
									if(result_4=!false){
										if(req_.body.opinion_desactivacion==""){
											res_.json({
												error : false,
												mensaje : mensaje_estado,
												datos : result_3,
												token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result_3))
											});	
										}else{
											OPINION_DESACTIVACION.registrar_nuevo(conexion_db_ON,req_.body,function (result_5) {
												if (result_5!=false) {
													res_.json({
														error : false,
														mensaje : "Automatización desactivada",
														datos : result_3,
														token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result_3))
													});
												}else{
													res_.json({
														error : true,
														error_m : result_5,
														mensaje : "Automatización desactivada, pero ocurrio un error al guardar la causa/opinión",
														token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result_3))
													});
												};
											});
										};
									}else{
										res_.json({
											error : true,
											error_m : err_4,
											mensaje : "Cambio realizado, pero no pudo cambiar el estado de las publicaciones. Repita el proceso.",
											token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result_3))
										});
									}
								};
							});
						} else{
							//console.log(JSON.stringify(err_3),JSON.stringify(result_3));
							res_.json({
								error : true,
								error_m : err_3,
								mensaje : " No se activo/desactivo la automatización"
							});
						};
					});
				});

			}else{			
				res_.json({
					error : true,
					error_m : "",
					mensaje : "Nos encontramos en mantenimiento"
				});
			}
		}
	}); 
});
router.post('/guardar_url', function(req_, res_) {
	var fecha_actual = moment(moment().tz("America/Bogota").format('YYYY-MM-DD'));
	var fecha_public = req_.body.fecha_publicacion;
	var dias_diferencia = fecha_actual.diff(fecha_public, 'days');
	if (dias_diferencia<=2) {
		CONFIGURACION.get_cfg(conexion_db_ON,function(err_cfg,result_cfg){
			//console.log(err_0,result_0);
			if(err_cfg)
			{
				res_.json(err_cfg);
			}else{			
				if (result_cfg.estado_mantenimiento==0) {
					//console.log(req_.body);
					GESTION_URL.verificar_automatizacion(conexion_db_ON,req_.body,function(err_,result_){
						//console.log(result_);
						if (err_) {
								res_.json(err_);				
						}else{
							if (result_==false) {
								GESTION_URL.verificar_post_dia(conexion_db_ON,req_.body,function(err_,result_){
									//console.log(err_,result_);
									if(err_)
									{
										res_.json(err_);
									}else{ 
										if(result_[0].fecha_registro == UTILIDAD.fecha_actual_())
										{
											res_.json({
												error : true,
												error_m : err_,
												mensaje : "Disculpe, el dia de hoy ya envio una publicación a ser automatizada. Vuelva a intentar mañana."
											});				
										}else{

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
														GESTION_URL.verificar_espera(conexion_db_ON,req_.body,function(err_1,result_1){
															//console.log(err_1,result_1);
													        if(err_1)
													        {
													            res_.json(err_1);
													        }else{
													        	if (result_1==false) {
													        		GESTION_URL.guardar(conexion_db_ON,req_.body,function (result_2) {
																								GESTION_URL.verificar_espera(conexion_db_ON,req_.body,function(err_3,result_3){
																									if (result_3!=false) {
																										//console.log(JSON.stringify(result_3));
																										//DBCONEXION.cerrar_conexion(conexion_db);
																										res_.json({
																											error : false,
																											mensaje : "Envio existoso, su url se encuentra en espera.",
																											datos : result_3,
																											promotor_wif_priv_posting : ''/*result_cfg.promotor_wif_priv_posting*/,
																											promotor_usuario : ''/*result_cfg.promotor_usuario*/,
																											nombre_steem : req_.body.nombre_steem,
																											url_post_comm : req_.body.url_post_comm,
																										});																				
																									} else{
																										//console.log(JSON.stringify(err_3),JSON.stringify(result_3));
																										//DBCONEXION.cerrar_conexion(conexion_db);
																										res_.json({
																				        					error : true,
																				        					error_m : err_3,
																				        					mensaje : "La url no fue registrada en uneeverso"
																				        				});
																									};
																								});
																							});
													        	}else{
													        		//DBCONEXION.cerrar_conexion(conexion_db);
													        		switch(result_1.estado){
													        			case 1 :					        				
															        		res_.json({
															        					error : true,
															        					error_m : err_1,
															        					mensaje : "La url se encuenta en la lista de espera para obtener upvotes ",
															        				});
													        			break;
													        			case 2 :
																										res_.json({
																					        					error : true,
																					        					error_m : err_1,
																					        					mensaje : "La url ya anteriormente obtuvo upvotes "/*por el bot de uneeverso, y llego a: '"+result.length+"' votos"*/,
																					        				});
													        			break;
													        			case 3 :
																										res_.json({
																					        					error : true,
																					        					error_m : err_1,
																					        					mensaje : "La url se encuentra recibiendo upvotes "/*por el bot de uneeverso, y llego a: '"+result.length+"' votos"*/,
																					        				});
													        			break;													        			
													        		}

													        	};
													            
													        }
													    });
											    	};
											        
											    }
											});	

										}
									};
								});


							}else{
								res_.json({
									error : true,
									error_m : err_,
									mensaje : "La url ya fue automatizada."
								});					
							};


						};

					});
				}else{			
					res_.json({
						error : true,
						error_m : "",
						mensaje : "Nos econtramos en mantenimiento"
					});
				}
			}
		}); 
	}else{
		res_.json({
					error : true,
					error_m : "La fecha no es permitida",
					mensaje : "La url, tiene mas de 2 dias de ser publicada"
				});		
	};
});
router.post('/cfg_auto_usuario', function(req, res) {
	
	CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
		//console.log(err_0,result_0);
		if(err_0)
		{
			res.json(err_0);
		}else{
			if (result_0.estado_mantenimiento==0) {	
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
												token : ENCRIPTACION.encryptUneeverso(JSON.stringify(result_0))
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