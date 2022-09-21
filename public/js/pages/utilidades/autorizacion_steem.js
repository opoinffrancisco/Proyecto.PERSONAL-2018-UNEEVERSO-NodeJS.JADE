var autorizacion_steem = function () {
 


	var abrir_aviso_autorizacion_r = function () {
			animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','','activar','');
			var usuario_steem_ = $('#usuario_steem').val();
			var correo_electronico_ = $('#correo_electronico').val();
			var contrasena_uneeverso_ = $('#contrasena_uneeverso').val();			
			if (usuario_steem_=="" || contrasena_uneeverso_=="" ||
				 correo_electronico_=="") {
				alerta.error("Quedan campos vacios");
				animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
				return false;
			}
			if (sesion.validar_correo(correo_electronico_)) {
				animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','','activar','');
				sesion.isUserSteem(usuario_steem_, function (validacion_u_steem) {
					if (validacion_u_steem!=false) {						
						animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','','activar','');
						if (sesion.isValidaContrasena(contrasena_uneeverso_)) {
							if ($('#contrasena_uneeverso').val()==$('#contrasena_uneeverso_2').val()) {

					            $("#contrasena_uneeverso_2").css('background', '#5cd867');
								if ($('#btn-acceder')) {
									$('#btn-acceder').attr('disabled',false);	
								};
								if ($('#btn-registro')) {
									$('#btn-registro').attr('disabled',false);
								};
								$('#compose-modal_autoridad').modal('show')
							} else {
					            $("#contrasena_uneeverso_2").css('background', '#ea6a6a');
								if ($('#btn-acceder')) {
									$('#btn-acceder').attr('disabled',true);	
								};
								if ($('#btn-registro')) {
									$('#btn-registro').attr('disabled',true);
								};
								alerta.error("Las contraseñas uneeverso no coinciden.");
					        }
							animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');					        
						} else{
							alerta.error("Contraseña uneeverso tiene espacios");
							animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
						};
					}else{
						alerta.error("Usuario no existe en steem");
						animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
					};
				});
			}else{
				alerta.error("Correo electrónico con formato no permitido");
				animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
			};
	}
	var validar_autorizacion_r = function () {
			/*sesion.datos_sesion(function (result_datos_sesion) {
	    	  	var datos_token = result_datos_sesion;
				var id_usuario = datos_token.nombre_steem;
				window.open('https://steemconnect.com/authorize/@uneeverso', '_blank')
			});*/
			animaciones_g.botonLoadText('btn-verificar_autorizacion','','activar','');
			autorizacion_steem.verificar_steem_registro($('#usuario_steem').val(), function (result_v_steem) {
				if (result_v_steem) {
					alerta.exito("Autorización valida.");
					$('#compose-modal_autoridad').modal('hide')
				}else{
					alerta.error("Disculpe, aun no ha autorizado a UNEEVERSO.");
				};
				animaciones_g.botonLoadText('btn-verificar_autorizacion','Verificar autorización','desactivar','');
			})


	}


	/****************************************************/


	/****************************************************/

	var validar_autorizacion = function () {
			/*sesion.datos_sesion(function (result_datos_sesion) {
	    	  	var datos_token = result_datos_sesion;
				var id_usuario = datos_token.nombre_steem;
				window.open('https://steemconnect.com/authorize/@uneeverso', '_blank')
			});*/
			animaciones_g.botonLoadText('btn-verificar_autorizacion','','activar','');
			animaciones_g.botonLoadText('btn-q_verificar_autorizacion','','activar','');
			sesion.datos_sesion(function (argument) {
				perfil_automatizacion.validar_auto(argument);
			});
	}


	/****************************************************/
	var verificar = function (dato_auth, callback) {
			var verificacion = false;
			for (var i = 0; i < dato_auth.length; i++) {
				if (dato_auth[i][0]=="uneeverso") {
					verificacion = true;
				}
				if ((i+1)==dato_auth.length) {
					callback(verificacion);
				};
			};
	}

	var verificar_steem_registro = function (id_usuario_, callback) {

			$.ajax({
				async: false,
				url: 'https://api.steemjs.com/get_accounts',
				type:'GET',	
				data:{	
						names:[id_usuario_],
					},
			    beforeSend: function () {

			    },
			    success:  function (result) {

					if (result=='') {
						//sesion.gestion_erro_conexion();
						callback(false);
					} else{
						//console.log(result);
						if (result[0].posting.account_auths) {
							autorizacion_steem.verificar(result[0].posting.account_auths, function (result_v_steem) {
								if (result_v_steem) {
									$.ajax({
										async: false,
										url: window.location.origin+'/autorizacion-steem-registro',
										type:'POST',	
										data:{	
												nombre_steem:id_usuario_,
											},
									    beforeSend: function () {

									    },
									    success:  function (resultado) {
									    	
									    	if (resultado.error==false) {
							        	  		callback(result_v_steem);
									    	}else{
									    		alerta.error("ERROR: Intente nuevamente el procedimiento.");
									    		callback(false);
									    	}
									    	
									    },
										error:  function(error) {
											callback(false);
											console.log(JSON.stringify(error));
											alerta.error("ERROR EXTERNO: Intente nuevamente el procedimiento.");
									    }	 
									});								
								}else{
									callback(false);
								};
							})
						};
					};
			        
			    },
				error:  function(error) {
					console.log(JSON.stringify(error));
					animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
					animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
					animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
					alerta.error("Intente nuevamente el procedimiento.");					
			    }	 
			});
	}

	var verificar_steem = function (id_usuario_, callback) {

			$.ajax({
				async: false,
				url: 'https://api.steemjs.com/get_accounts',
				type:'GET',	
				data:{	
						names:[id_usuario_],
					},
			    beforeSend: function () {

			    },
			    success:  function (result) {

					if (result=='') {
						//sesion.gestion_erro_conexion();
						callback(false);
					} else{
						//console.log(result);
						if (result[0].posting.account_auths) {
							autorizacion_steem.verificar(result[0].posting.account_auths, function (result_v_steem) {
								if (result_v_steem) {
									$.ajax({
										async: false,
										url: window.location.origin+'/autorizacion-steem',
										type:'POST',	
										data:{	
												nombre_steem:id_usuario_,
											},
									    beforeSend: function () {

									    },
									    success:  function (resultado) {
									    	
									    	if (resultado.error==false) {
							        	  		localStorage.setItem('nombre_steem', resultado.datos.nombre_steem)
							        	  		localStorage.setItem('cant_steem_power_auto', resultado.datos.cant_steem_power_auto)
							        	  		localStorage.setItem('token', resultado.token);									    		
									    		callback(result_v_steem);
									    	}else{
									    		alerta.error("ERROR: Intente nuevamente el procedimiento.");
									    		callback(false);
									    	}
									    	
									    },
										error:  function(error) {
											callback(false);
											console.log(JSON.stringify(error));
											alerta.error("ERROR EXTERNO: Intente nuevamente el procedimiento.");
									    }	 
									});								
								}else{
									callback(false);
								};
							})
						};
					};
			        
			    },
				error:  function(error) {
					console.log(JSON.stringify(error));
					animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
					animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
					animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
					alerta.error("Intente nuevamente el procedimiento.");					
			    }	 
			});
	}


	var verificar_steem_sesion = function (callback) {
			if(sesion.validar()==false){
				callback(false);
			}
			sesion.datos_sesion(function (result_datos_sesion) {
	    	  	var datos_token = result_datos_sesion;
				var id_usuario = datos_token.nombre_steem;
				//steem.api.getAccounts([id_usuario], function(err, result) {
					$.ajax({
						async: false,
						url: 'https://api.steemjs.com/get_accounts',
						type:'GET',	
						data:{	
								names:[id_usuario],
							},
					    beforeSend: function () {

					    },
					    success:  function (result) {

							if (result=='') {
								//sesion.gestion_erro_conexion();
								callback(false);
							} else{
								//console.log(result);
								if (result[0].posting.account_auths) {
									autorizacion_steem.verificar(result[0].posting.account_auths, function (result_v_steem) {
										callback(result_v_steem);
									})
								};
							};
					        
					    },
						error:  function(error) {
							console.log(JSON.stringify(error));
							animaciones_g.botonLoadText('btn-abrir_aviso_autorizacion','Autorizar a uneeverso','desactivar','');
							animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
							animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
				    		alerta.error("Intente nuevamente el procedimiento.");							
					    }	 
					});					

				//});							    	
				/*steem.api.getFollowCount(id_usuario, function(err, result) {
					//console.log(err, result);
					$('#seguidores').text(result.follower_count);				
					$('#sigues').text(result.following_count);
				});*/
			});
	}

	return{
		Iniciar: function () {
		},
		abrir_aviso_autorizacion_r : abrir_aviso_autorizacion_r,
		validar_autorizacion_r : validar_autorizacion_r,
		validar_autorizacion : validar_autorizacion,
		verificar : verificar,
		verificar_steem_registro : verificar_steem_registro,
		verificar_steem : verificar_steem,
		verificar_steem_sesion : verificar_steem_sesion,
	}
}();
$(window).load(function () {
	autorizacion_steem.Iniciar();
});

