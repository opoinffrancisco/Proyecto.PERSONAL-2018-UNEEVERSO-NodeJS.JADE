var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var USUARIO = require('../../mod/usuario');
var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var datos_temp_ = {};






router.get('/solicitud-recuperacion-contrasena', function(req, res) {

  res.render('utilidades/solicitud_recuperacion_contrasena.jade');
});
router.post('/solicitando_recuperar_contrasena', function(req_, res_) {
	console.log(req_.body);
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
		        		USUARIO.verificar_credenciales(conexion_db_ON,req_.body,function(error,result){
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
					        					
																				// Creamos el codigo de recuperacion
																				var codigo_recuperacion_ = ENCRIPTACION.encryptUneeverso(new Date().toString()).substring(40,48);
																				USUARIO.gestion_codigo_recuperacion(conexion_db_ON,codigo_recuperacion_,req_.body.nombre_steem, function (error) {
																					if (error) {
																						res_.json(error);
																					} else{
												        		// TOdos los datos son correctos
												        		var transporter = nodemailer.createTransport({
																					  service: 'gmail',
																							  auth: {
																							    user: 'uneeverso.soporte@gmail.com',
																							    pass: ''
																							  }
																							});

																						var mailOptions = {
																							from: 'uneeverso.soporte@gmail.com',
																							to: result.correo_electronico,
																							subject: 'Recuperación de Contraseña de cuenta Uneeverso',
																							text: 'Saludos '+result.nombre_steem+', ' +
																								  		' la url para cambiar contraseña es : https://uneeverso.com/cuenta/cambiar-contrasena/'+result.nombre_steem+'/'+codigo_recuperacion_+
																							  	  ' Recuerde que esta url expirara luego de haber sido usada.'
																						};
																						transporter.sendMail(mailOptions, function(error, info){
																						  if (error) {
																						    console.log(error);
																			        		res_.json({
																			        					error : true,
																			        					error_m : error,
																			        					mensaje : "Error al enviar el correo electronico."
																			        				});									    
																						  } else {
																			        		res_.json({
																			        					error : false,
																			        					mensaje : "Codigo de recuperación enviado a "+result.correo_electronico+', reviselo y siga las intrucciones.',
																			        					datos : info.response
																			        				});										
																						  }
																						});

																					};																						
																				});
					        	};
					            
					        }
					    });
		        	};
		            
		        }
		    });	
		};
	});	
});

router.get('/cambiar-contrasena/:nombre_steem/:codigo', function(req, res) {
	console.log(req.params);
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			console.log("conexion db");
			USUARIO.get_u_nombre(conexion_db_ON,req.params,function(err_0,result_0){
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
		        		console.log("Codigo de recuperacion DB : "+result_0.codigo_recuperacion);     		
						if (result_0.codigo_recuperacion==req.params.codigo) {
						    res.render('utilidades/cambiar_contrasena.jade',{
						    	usuario : req.params.nombre_steem,
						    	codigo_recuperacion : req.params.codigo
						    });
						} else{
							res.send('La url ya ha sido usada, verifique su correo electronico.');
						};
		        	}
		        }
		 });
		}

	});
});
router.post('/cambiar-contrasena/:nombre_steem/:codigo/enviar-cambio', function(req, res) {
	
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
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
		        	//console.log(result_0.codigo_recuperacion,req.body.codigo_recuperacion);      		
														if (result_0.codigo_recuperacion==req.body.codigo_recuperacion) {
																		USUARIO.gestion_codigo_r_contrasena(conexion_db_ON,req.body,function (error) {
																			if (error) {
																				res.json({
								        					error : true,
								        					error_m : err_0,
								        					mensaje : "Error de sistema al cambiar contraseña."
								        				});
																			}else{
																					console.log("Contraseña cambiada");
													        		var transporter = nodemailer.createTransport({
																						  service: 'gmail',
																								  auth: {
																								    user: 'uneeverso.soporte@gmail.com',
																								    pass: ''
																								  }
																								});

																							var mailOptions = {
																								from: 'uneeverso.soporte@gmail.com',
																								to: result_0.correo_electronico,
																								subject: 'Contraseña de cuenta uneeverso recuperada',
																								text: 'Saludos '+result_0.nombre_steem+', La contraseña de su cuenta uneeverso fue cambiada a :'+req.body.contrasena_uneeverso
																							};

																							transporter.sendMail(mailOptions, function(error, info){
																							  if (error) {
																							    console.log(error);
																				        		res_.json({
																				        					error : true,
																				        					error_m : error,
																				        					mensaje : "Su contraseña fue cambiada exitosamente, pero hubo un error al enviar el correo electronico. Si lo desea solicite un nuevo cambio de contraseña."
																				        				});									    
																							  } else {
																				        		res.json({
																		        					error : false,
																		        					mensaje : "Su contraseña fue cambiada exitosamente, mas detalles enviados a su correo electronico: "+result_0.correo_electronico
																		        				});							
																							  }
																							});
																			}
																		});
														}else{
															res.json({
		        					error : true,
		        					error_m : err_0,
		        					mensaje : "Codigo de restauración incorrecto"
		        				});
		        				}
		        	}
		        }
		 });
		}

	});
});

module.exports = router;