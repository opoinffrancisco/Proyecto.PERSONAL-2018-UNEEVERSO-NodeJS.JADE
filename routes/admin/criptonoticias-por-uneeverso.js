var steem = require('steem-uneeverso-oficial');
var moment = require('moment-timezone');
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

var key_public = "ff84c98de40beb73b291a5ec5568c44a65614bb082e031177bee96bcd8aaff10dcb43ce8761e0c8e6860e958b644f396";

var express = require('express');
var router = express.Router();

router.get("/:key_public/:etiqueta_url/@:nombre_steem/:url_post_comm", function(req_, res_){
	var key_public_send_cifrada_ = ENCRIPTACION.encryptUneeverso(JSON.stringify(req_.params.key_public));
	if (key_public_send_cifrada_==key_public) {
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;

				GESTION_URL.verificar_automatizacion(conexion_db_ON,req_.params,function(err_,result_){
					//console.log(result_);
					if (err_) {
							res_.json(err_);				
					}else{
						if (result_==false) {
							GESTION_URL.verificar_post_dia(conexion_db_ON,req_.params,function(err_,result_){
								//console.log(err_,result_);
								if(err_)
								{
									res_.json(err_);
								}else{ 							
									USUARIO.get_u_nombre(conexion_db_ON,req_.params,function(err_0,result_0){
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
									    		GESTION_URL.verificar_espera(conexion_db_ON,req_.params,function(err_1,result_1){
													//console.log(err_1,result_1);
											        if(err_1)
											        {
											            res_.json(err_1);
											        }else{
											        	if (result_1==false) {
											        		GESTION_URL.guardar(conexion_db_ON,req_.params,function (result_2) {
																GESTION_URL.verificar_espera(conexion_db_ON,req_.params,function(err_3,result_3){
																	if (result_3!=false) {
																		//console.log(JSON.stringify(result_3));
																		//DBCONEXION.cerrar_conexion(conexion_db);
																		res_.json({
																			error : false,
																			mensaje : "Envio existoso, su url se encuentra en espera.",
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
			};
		});

	} else{
		res_.json({
			mensaje : "Contraseña incorrecta."
		});
	};

});



router.get("/:key_public/generar_reporte/:resultados", function(req_, res_){
	var key_public_send_cifrada_ = ENCRIPTACION.encryptUneeverso(JSON.stringify(req_.params.key_public));
	if (key_public_send_cifrada_==key_public) {
		DBCONEXION.iniciar_conexion(function (conexion_db) {
			if (conexion_db!=false) {
				conexion_db_ON = conexion_db;

				GESTION_URL.post_anteriores(conexion_db_ON,req_.params,function(err_,result_){
					//console.log(result_.length);
					if (err_) {
							res_.json({
								error : true,
								error_m : err_,
								mensaje : "ERROR AL OBTENER PUBLICACIONES DISPONIBLES PARA EL REPORTE."
							});				
					}else{
						if (result_==false) {
							res_.json({
								error : true,
								error_m : err_,
								mensaje : "NO HAY PUBLICACIONES DISPONIBLES."
							});
						}else{
							GESTION_URL.post_anteriores_num_auto(conexion_db_ON,function(err_num,result_num){
								res_.json({
									error : false,
									datos : result_,
									num_auto : result_num.num_auto,
									mensaje : "Reporte generado con exito sobre el dia :"+UTILIDAD.fecha_anterior_(),
								});
							});	
						};
					};

				});
			};
		});

	} else{
		res_.json({
			mensaje : "Contraseña incorrecta."
		});
	};

});


module.exports = router;
