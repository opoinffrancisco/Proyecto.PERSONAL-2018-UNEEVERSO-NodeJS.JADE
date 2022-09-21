//----------------------------------------------------
var numero_plataforma = 2;
var steem = require('steem-uneeverso-oficial-p-2');
//----------------------------------------------------
var NOTIFICACION_PUSH = require('../../routes/utilidades/notificacion-push');
//----------------------------------------------------
var moment = require('moment-timezone');
var fetch = require('node-fetch');
var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var UTILIDAD = require('../../mod/utilidad');
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var CONFIGURACION = require('../../mod/configuracion');
var USUARIO = require('../../mod/usuario');
var GESTION_URL = require('../../mod/gestion_url');
var BOT = require('../../mod/bot');
var OPINION_DESACTIVACION = require('../../mod/opinion_desactivacion');
var express = require('express');
var router = express.Router();

/*
	Revisa si hay nuevos bots para activar
*/
var control_tiempo_bots=[];// se guarda el setInterval QUE GESTIONA EL CICLO DE CADA BOT
var control_tiempo_bots_dato=[];// Se guarda el tiempo que dura el setInterval de CADA bot
//
var control_votos_url=[];//control de tiempo interno de todos los bots
//
// control_espera_ finalizar una votacion de forma forzada
var control_espera_finalizar = [];
//
// control_espera_ finalizar una votacion de forma forzada
var control_nuevo_voto = [];
																		

setInterval(function(){
	detectar_nuevos_bots()
},1000*60*15);//Cada 15 minutos se revisa si un bot fue agregado
var num_bots=0;
function detectar_nuevos_bots () {
		BOT.all_activos(conexion_db_ON,numero_plataforma,function(err_bots,result_bots){
			if(err_bots)
			{
				console.log(err_bots);
				console.log("P: "+numero_plataforma+" | ERROR AL CONSULTAR LA LISTA DE BOTS ACTIVADOS");
			}else{
				if (result_bots) {
					if(result_bots.length>num_bots){
						console.log("P: "+numero_plataforma+" | UN BOT FUE AGREGADO");
						//Para agregar un nuevo bot a la lista,La borramos 1 x 1.(evita choque de tiempo de intervalos de cada bot)
						control_tiempo_bots.forEach(function(item, index){ 
							clearInterval(item);//Borrando los setInterval
						});
						control_tiempo_bots_dato = [];
						control_votos_url.forEach(function(item, index){ 
							clearInterval(item);//Borrando los setInterval
						});
						control_votos_url = [];
						// nueva cantidad de bots
						num_bots = result_bots.length;
						console.log("P: "+numero_plataforma+" | REINICIANDO BOTS");
						for (var i = 0; i < result_bots.length; i++) {
							automatizador(result_bots[i]);
						};
						console.log("P: "+numero_plataforma+" |BOTS REINICIADOS");
					}
				}else{
					console.log("P: "+numero_plataforma+" | NO HAY BOTS ACTIVADOS");
				};
			}
		});
}


function plataforma_bots () {
	BOT.all_activos(conexion_db_ON,numero_plataforma,function(err_bots,result_bots){
		if(err_bots)
		{
			console.log(err_bots);
			console.log("P: "+numero_plataforma+" | ERROR AL CONSULTAR LA LISTA DE BOTS");
		}else{
			if (result_bots) {
				num_bots = result_bots.length;//control de conteo de bots
				for (var i = 0; i < result_bots.length; i++) {
						automatizador(result_bots[i]);
				};
				console.log("P: "+numero_plataforma+" |BOTS ENCENDIDOS")
			}else{
				console.log("P: "+numero_plataforma+" | NO HAY BOTS ACTIVADOS");
			};
		}
	});
}
function reiniciar_bots() {
		BOT.all_activos(conexion_db_ON,numero_plataforma,function(err_bots,result_bots){
			if(err_bots)
			{
				console.log(err_bots);
				console.log("P: "+numero_plataforma+" | ERROR AL CONSULTAR LA LISTA DE BOTS ACTIVADOS");
			}else{
				if (result_bots) {
					control_tiempo_bots.forEach(function(item, index){ 
						clearInterval(item);//Borrando los setInterval
					});
					control_tiempo_bots_dato = [];
					control_votos_url.forEach(function(item, index){ 
						clearInterval(item);//Borrando los setInterval
					});
					control_votos_url = [];						
					// nueva cantidad de bots
					num_bots = result_bots.length;
					console.log("P: "+numero_plataforma+" | REINICIANDO BOTS");
					for (var i = 0; i < result_bots.length; i++) {
						automatizador(result_bots[i]);
					};
					console.log("P: "+numero_plataforma+" |BOTS REINICIADOS");
				}else{
					console.log("P: "+numero_plataforma+" | NO HAY BOTS ACTIVADOS");
				};
			}
		});
}



function automatizador (datos_bot_) { 
	console.log(datos_bot_); 
	control_tiempo_bots_dato[datos_bot_.id] = datos_bot_.intervalo_publicacion;
	control_tiempo_bots[datos_bot_.id] = setInterval(function () {
		console.log("P: "+numero_plataforma+" | EJECUTANDO EL BOT : "+datos_bot_.nombre);
		CONFIGURACION.get_cfg(conexion_db_ON,function(err_cfg,result_cfg){
			//console.log(err_cfg,result_cfg);
			if(err_cfg)
			{
				console.log(err_cfg);
			}else{
				if (result_cfg.estado_mantenimiento_bot==0) {
					BOT.get(conexion_db_ON,datos_bot_.id,function(err_bot,result_bot){						
						//console.log(err_bot,result_bot);
						if(err_bot)
						{
							console.log(err_bot);
						}else{
							// verificar si no se cambio el tiempo de intervalo
							if (result_bot.intervalo_publicacion==control_tiempo_bots_dato[datos_bot_.id]) {
								if (result_bot.estado==1) {							
									GESTION_URL.bot_verifica_existencia_votacion_activa(conexion_db_ON,result_bot,function(err_00,result_00){
										if (err_00) {
											console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : Fecha de error . SQL bot_verifica_existencia_votacion_activa : "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
										} else{
											if (result_00!=false) {
												console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : EXISTE UNA VOTACION EN PROCESO CON ESTE BOT, SE DEBE ESPERAR PARA PROCESAR OTRA.");
											}else{
												GESTION_URL.automatizador_ON(conexion_db_ON,function(err_0,result_0){
													//console.log(result_0);
													if(err_0)
													{
														console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : Fecha de error . SQL automatizador_ON: "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
													}else{
														if (result_0) {
															USUARIO.verificar_reiniciar_votos(conexion_db_ON,function(result_vr){
																if (result_vr==true) {
																	try{
																		//console.log("YA VERIFICO Y REINICIO VOTOS")
																		//steem.api.setOptions({ url: result_bot.nodo_conexion });
																		fetch('https://api.steemjs.com/get_content?author='+result_0.nombre_steem+'&permlink='+result_0.url, { 
															                headers: { 'Content-Type': 'application/json' },
															            })
															            .then(res => res.json())
															            .then(function (result_c_post) {
																		//steem.api.getContent(, , function(err_c_post, result_c_post) {
																			// ACA SE DEBE DE COLOCAR: EL OBTENER LOS USUARIOS QUE YA VOTARON
																			//console.log(result_c_post);
																			var fecha_actual = moment(moment().tz("America/Bogota").format('YYYY-MM-DD'));
																			var fecha_public = moment(result_c_post.created).format("YYYY-MM-DD");
																			var dias_diferencia = fecha_actual.diff(fecha_public, 'days');
																			if (dias_diferencia<=6) {
																				var usuarios_excluir_ ="";
																				var cantidad_votos_actuales_=result_c_post.active_votes.length;
																				if (cantidad_votos_actuales_==0) {
																					cantidad_votos_actuales_=1;
																				};
																				//---------------------
																				/*  
																					Notificacion: Notificar que la publicacion xxxxxxxxxxxxx esta siendo votada
																				*/
																					NOTIFICACION_PUSH.push_votacion_iniciada({nombre_steem:result_0.nombre_steem,url_post_comm:result_0.url});																														
																				//---------------------
																				for (var i = 0; i < cantidad_votos_actuales_; i++) {
																					if (result_c_post.active_votes.length!=0) {
																						usuarios_excluir_+= " AND u.nombre_steem !='"+result_c_post.active_votes[i].voter+"' ";
																					};
																					if (cantidad_votos_actuales_==(i+1) || (i+1)==800) {
																							//console.log(usuarios_excluir_);
																						//console.log(result_c_post.url);
																						console.log(cantidad_votos_actuales_+"  votos actuales");
																						//usuarios_excluir_="";
																						USUARIO.get_usuarios_votantes(conexion_db_ON,result_0.nombre_steem,usuarios_excluir_,result_bot.limite_votos_emitir,function (err_1,result_1) {
																							if(err_1)
																							{
																								console.log(err_1);
																								console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : Fecha de error SQL usuarios votantes: "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
																							}else{				
																								if (result_1) {
																									console.log("P: "+numero_plataforma+" | cantidad de votantes"+result_1.length);
																									console.log("P: "+numero_plataforma+" | limite_votos_emitir : "+result_bot.limite_votos_emitir);
																									var contador_votos = 0;
																									var cant_limite_votantes= result_bot.limite_votos_emitir;
																									//Si la cantidad de usuarios es menor al limite, se coloca la cantidad menor.(Para redicir ciclos inecesarios)
																									if (result_1.length<cant_limite_votantes) {
																										cant_limite_votantes =result_1.length;
																									};	
																									// COLOCAR EN ESTADO 3																												
																									GESTION_URL.iniciar_votacion_post(conexion_db_ON,result_c_post.author,result_c_post.permlink,result_bot,function (inicio_vot) {
																										 var tiempo_ctrl_milisegundos_v_x_x = new Date();
																											control_votos_url[datos_bot_.id+result_0.url+tiempo_ctrl_milisegundos_v_x_x]= setInterval(function () {
																													if (result_0.nombre_steem!=result_1[contador_votos].nombre_steem) {

																											 				console.log("P: "+numero_plataforma+" | URL    :"+result_0.url);
																											 				console.log("P: "+numero_plataforma+" | Autor  :"+result_0.nombre_steem);
																											 				console.log("P: "+numero_plataforma+" | Numero de votos:"+contador_votos);
																											 				console.log("P: "+numero_plataforma+" | Votante:"+result_1[contador_votos].nombre_steem);
																											 				console.log("P: "+numero_plataforma+" | LIMITE DE VOTOS (VOTANTES):"+cant_limite_votantes);
																											 				console.log("P: "+numero_plataforma+" |BOT 			:"+result_bot.nombre);
																																contador_votos++;// Control de contador de votos 																																												
																																try{
																																	votar_publicacion(
																																			result_bot,
																																			result_cfg,
																																			(result_1[contador_votos].wif_post_priv_steem)?result_1[contador_votos].wif_post_priv_steem:"",
																																			result_1[contador_votos].nombre_steem,
																																			result_1[contador_votos].cant_steem_power_auto,																							
																																			result_0.nombre_steem,
																																			result_0.url,
																																			tiempo_ctrl_milisegundos_v_x_x,
																																			cant_limite_votantes,
																																			function (resultado) {
																																			if(resultado==2 && contador_votos>=cant_limite_votantes){
																																					console.log("P: "+numero_plataforma+" | LIMITE DE VOTOS, ALCANZADO: BORRAR CONTEO - INTERNO V_I");
																																					clearInterval(control_votos_url[datos_bot_.id+result_0.url+tiempo_ctrl_milisegundos_v_x_x]);
																																					contador_votos = 0;
																																					GESTION_URL.cerrar_votacion_post(conexion_db_ON,
																																						result_c_post.author,result_c_post.permlink,
																																						function (inicio_vot) {
																																							//------------------
																																							NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:result_0.nombre_steem,url_post_comm:result_0.url});																														
																																							//------------------
																																					});
																																			}
																																	});
																																}catch(e){
																																	console.log(e);
																																}
																														//console.log("(V_Nr)CONTADOR DE VOTOS:"+contador_votos);
																														//console.log("(V_Nr)LIMITE DE VOTOS (VOTANTES):"+cant_limite_votantes);
																														if (contador_votos>=cant_limite_votantes) {
																															console.log("P: "+numero_plataforma+" | LIMITE DE VOTOS, ALCANZADO: BORRAR CONTEO");
																															clearInterval(control_votos_url[datos_bot_.id+result_0.url+tiempo_ctrl_milisegundos_v_x_x]);
																															contador_votos = 0;
																															GESTION_URL.cerrar_votacion_post(conexion_db_ON,
																																result_c_post.author,result_c_post.permlink,
																																function (inicio_vot) {
																																	//------------------
																																	NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:result_0.nombre_steem,url_post_comm:result_0.url});																														
																																	//------------------
																															});
																														};

																													};
																													//};
																											},1000*result_bot.intervalo_voto);// segundos (milisegundos) entre cada voto
																									});
																								}else{
																									console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : No hay usuario en disponible para upvote: "+ moment().tz("America/Bogota").format("DD-MM-YYYY hh:mm:ss A"));
																								}
																							};
																						});
																						break;
																					}
																				};
																			} else{
																				console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : Ya tiene 7 o mas dias de ser publicada : "+result_c_post.url);			
																				GESTION_URL.despachar_url_dias_excedidos(conexion_db_ON,result_c_post.author,result_c_post.permlink,function (result_tiempo) {
																					// body... 
																				});
																			};
																		//});
																		}).catch(function (err_c_post) {
														                	//console.error(err_c_post)
														                	console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : error al extraer datos del autor : "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
														                });;
																	}catch(e){
																		console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : error al conectar con los nodos steem : "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
																	}
																	// LUEGO SE DEBE DE COLOCAR UNA CONSULTA , DE USUARIOS DISTINTOS A LOS QUE YA VOTARON.
																	// LUEGO LO USUARIOS QUE AUN NO HAN VOTADO EMITIRAN LOS VOTOS																
																} else{
																	console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : No hay url en espera: "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
																};
															});
														} else{
															console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : No hay url en espera: "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
														};
													}
												});
											};
										};
									});
								}else{
									console.log("P: "+numero_plataforma+" |BOT  "+result_bot.nombre+", EN MANTENIMIENTO ");
								};
							}else{
								// SI EL TIEMPO FUE CAMBIADO
								// ACTUALIZAR TIEMPO Y REINICIAR BOTS
								reiniciar_bots();
							}
						}
					});
				}else{			
					console.log("P: "+numero_plataforma+" |BOT's en mantenimiento/Descanso :"+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
				}
			}
		});
	}, 1000*60*datos_bot_.intervalo_publicacion); 
}
/*
	1#	CFG_BOT_,
	2#	CFG_LIMITE_VOTOS_VOTANTE,
	3#	wif_post_priv_steem,
	4#	nombre_steem_votante_,
	5#	cant_steem_power_auto_
	6#	nombre_steem_autor_,
	7#	url_autor_,
	8# callback
*/
var intentos_votos_=[];
var intentos_votos_retrasado=[];
var intentos_votos_error_steem=[];

function votar_publicacion (CFG_BOT_,CFG_,wif_post_priv_steem,nombre_steem_votante_,cant_steem_power_auto_votante_,nombre_steem_autor_,url_autor_, tiempo_ctrl_milisegundos_v_x_x,cant_limite_votantes_, callback) {
	//'wss://rpc.buildteam.io'
	try{
		if(intentos_votos_[CFG_BOT_.id+url_autor_]==undefined){  
			intentos_votos_[CFG_BOT_.id+url_autor_]=0
		}else{
			intentos_votos_[CFG_BOT_.id+url_autor_]++;
		}

		steem.api.setOptions({ url: CFG_BOT_.nodo_conexion });
		//steem.api.setOptions({ url: 'wss://steemd.privex.io' });
 
		//FORZAR CIERRE DE VOTACION - POR RETARDO DE RESPUESTAS DE VOTOS
		clearTimeout(control_espera_finalizar[CFG_BOT_.id+nombre_steem_votante_+url_autor_]);		
		control_espera_finalizar[CFG_BOT_.id+nombre_steem_votante_+url_autor_]= setTimeout(function () {
			
			if(intentos_votos_retrasado[CFG_BOT_.id+url_autor_]==undefined){ 
				intentos_votos_retrasado[CFG_BOT_.id+url_autor_]=0
			}else{
				intentos_votos_retrasado[CFG_BOT_.id+url_autor_]++;
			}			
			console.log("P: "+numero_plataforma+" |BOT "+CFG_BOT_.nombre+" : esperando respuesta en mas de 30 segundos | Nodo de conexion : "+CFG_BOT_.nodo_conexion);
			console.log("P: "+numero_plataforma+" |  Votante:"+nombre_steem_votante_+" | URL    :"+url_autor_);
			GESTION_URL.sin_respuesta_cerrar_votacion(conexion_db_ON,
				nombre_steem_autor_,url_autor_,
				(intentos_votos_retrasado[CFG_BOT_.id+url_autor_])+1,
				cant_limite_votantes_, function (nuevo_estado_post_) {
				//console.log(result_2); 
					if (nuevo_estado_post_==1 || nuevo_estado_post_==2) {
						clearInterval(control_votos_url[CFG_BOT_.id+url_autor_+tiempo_ctrl_milisegundos_v_x_x]);//cerrar votacion
						intentos_votos_retrasado[CFG_BOT_.id+url_autor_]=0;
						intentos_votos_error_steem[CFG_BOT_.id+url_autor_]=0;
						if (nuevo_estado_post_==2) {
							NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:nombre_steem_autor_,url_post_comm:url_autor_});
						};
					}
			});
		},1000*30);// si en 30 segundos deja de recibir un voto cambia a finalizado

		// si esta vacio es porque ya fue autorizado por primera ves
		var wif_posting_vote = (wif_post_priv_steem!="")? wif_post_priv_steem : CFG_.promotor_wif_priv_posting;

		

		steem.broadcast.vote(
			wif_posting_vote,nombre_steem_votante_,
			nombre_steem_autor_,url_autor_,
			cant_steem_power_auto_votante_,
		   function(err_2, result_2) {
		 		clearTimeout(control_espera_finalizar[CFG_BOT_.id+nombre_steem_votante_+url_autor_]);
		 		clearTimeout(control_nuevo_voto[CFG_BOT_.id+url_autor_]);
		 		if (err_2) {
		 			console.log("P: "+numero_plataforma+" |BOT "+CFG_BOT_.nombre+" : Nodo de conexion : "+CFG_BOT_.nodo_conexion+" | Fecha de error de voto: "+ moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A'));
						if (err_2['payload']['error']['data']['code']==3030000 || err_2['payload']['error']['data']['message']=="missing required posting authority") {
							USUARIO.desactivar_auto(conexion_db_ON,nombre_steem_votante_,function (r_desactivar_auto) {
										GESTION_URL.gestion_url_activar_desactivar(conexion_db_ON,nombre_steem_votante_,1,0,function(err_4,result_4){
											if (err_4) {
												console.log("Error al cambiar el estado de las publicaciones de :"+nombre_steem_votante_, err_4)
											} else{
												if(result_4=!false){
													OPINION_DESACTIVACION.registrar_nuevo(conexion_db_ON,{nombre_steem:nombre_steem_votante_,opinion_desactivacion:'SISTEMA: Automatización de cuenta desactivada, por falta de la autorización STEEM-UNEEVERSO.'},function (r___) {
													});
												}else{
													console.log("no pudo cambiar el estado de las publicaciones de :"+nombre_steem_votante_)
										}
									}; 
								});													
							});
								
					 };
		 			if(intentos_votos_error_steem[CFG_BOT_.id+url_autor_]==undefined){ 
							intentos_votos_error_steem[CFG_BOT_.id+url_autor_]=0
						}else{
							intentos_votos_error_steem[CFG_BOT_.id+url_autor_]++;
						}
		 			GESTION_URL.despachar_url_voto_error(conexion_db_ON,
		 				nombre_steem_autor_,url_autor_,nombre_steem_votante_,
		 				(intentos_votos_error_steem[CFG_BOT_.id+url_autor_])+1,
		 				cant_limite_votantes_,function (result_3) {
		 				//console.log(result_3);
							if (result_3==1 || result_3==2) {
								console.log("P: "+numero_plataforma+" | BORRANDO EJECUCION DE VOTOS");
								clearInterval(control_votos_url[CFG_BOT_.id+url_autor_+tiempo_ctrl_milisegundos_v_x_x]);//cerrar votacion
								intentos_votos_retrasado[CFG_BOT_.id+url_autor_]=0;
								intentos_votos_error_steem[CFG_BOT_.id+url_autor_]=0;
								if (result_3==2) {
											//------------------
											NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:nombre_steem_autor_,url_post_comm:url_autor_});
											//------------------
								};								
							}		 				
		 				callback(result_3);
	 				});

		 		}else{
	 				
		 			GESTION_URL.sumar_voto_obtenido(conexion_db_ON,
		 				nombre_steem_autor_,url_autor_,
		 				nombre_steem_votante_,
		 				(intentos_votos_[CFG_BOT_.id+url_autor_])+1,
		 				CFG_.limit_votos_votante,
		 				cant_limite_votantes_,function (result_3,n_voto) {
		 				//console.log(result_2);
							if (result_3==2) {
								console.log("P: "+numero_plataforma+" | BORRANDO EJECUCION DE VOTOS");
								clearInterval(control_votos_url[CFG_BOT_.id+url_autor_+tiempo_ctrl_milisegundos_v_x_x]);//cerrar votacion
								intentos_votos_retrasado[CFG_BOT_.id+url_autor_]=0;
								intentos_votos_error_steem[CFG_BOT_.id+url_autor_]=0;
								//------------------
								NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:nombre_steem_autor_,url_post_comm:url_autor_});																												
								//------------------								
							}		 						 											
		 				console.log("P: "+numero_plataforma+" |BOT "+CFG_BOT_.nombre+" : Nodo de conexion : "+CFG_BOT_.nodo_conexion+" | Voto N° "+n_voto+" obtenido :"+result_2.id );
							// VERIFICANDO LA EXISTENCIA DE NUEVOS VOTOS, SI NO HAY LUEGO DE 60 SEGUNDOS Y NO HA CAMBIADO A TERMINADO. SE CAMBIA.							
							control_nuevo_voto[CFG_BOT_.id+url_autor_] = setTimeout(function () {
								var ultimo_voto_emitido_ = n_voto;
			 				GESTION_URL.sin_voto_nuevo(conexion_db_ON,nombre_steem_autor_,url_autor_,ultimo_voto_emitido_,cant_limite_votantes_,function (result_4) {
			 					if (result_4==1 || result_4==2) {
			 						// cambiado
										console.log("P: "+numero_plataforma+" | BORRANDO EJECUCION DE VOTOS");
										clearInterval(control_votos_url[CFG_BOT_.id+url_autor_+tiempo_ctrl_milisegundos_v_x_x]);//cerrar votacion
										intentos_votos_retrasado[CFG_BOT_.id+url_autor_]=0;
										intentos_votos_error_steem[CFG_BOT_.id+url_autor_]=0;
										if (result_4==2) {
													//------------------
													NOTIFICACION_PUSH.push_votacion_finalizada({nombre_steem:nombre_steem_autor_,url_post_comm:url_autor_});
													//------------------
										};
			 					}else{
			 						// No fue necesario cambiar.
			 					};
			 				});
							},1000*60);
		 				callback(result_3)
	 				});
	 			};
		});

	}catch(ex){
		console.log("P: "+numero_plataforma+" |BOT "+result_bot.nombre+" : Error al integrar la dirección del nodo de conexión para un upvote");
	}

}

 
DBCONEXION.iniciar_conexion(function (conexion_db) {

		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			console.log(" INICIANDO PLATAFORMA "+numero_plataforma);
			//---Control
			plataforma_bots();
			//---Control-----------
		}else{

		}
});

module.exports = router;