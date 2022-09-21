function steem_on(){

var release = self.steem.api.setOptions({ url: 'wss://steemd.privex.io' }); 
self.steem.api.streamOperations('head', function(err, result) {
    console.log(err, result);
});  

  
}
var ctrl_tiempo_conexion;
var sesion = function () {
	
	var iniciar = function() {

			animaciones_g.botonLoadText('btn-acceder','','activar','');
			var usuario_steem_ = $('#usuario_steem').val();
			var contrasena_uneeverso_ = $('#contrasena_uneeverso').val();
			if (usuario_steem_=="" || contrasena_uneeverso_=="") {
				animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
				alerta.error("Quedan campos vacios");
				return false;
			}
			isUserSteem(usuario_steem_, function (validacion_u_steem) {
				if (validacion_u_steem!=false) {
					animaciones_g.botonLoadText('btn-acceder','','activar','');
					if (isValidaContrasena(contrasena_uneeverso_)) {
						animaciones_g.botonLoadText('btn-acceder','','activar','');
					    $.ajax({
							url: window.location.origin+'/login/iniciar_sesion',
							type:'POST',	
							data:{	
									nombre_steem:usuario_steem_,
									contrasena_uneeverso:contrasena_uneeverso_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {
				        	  	console.log(JSON.stringify(resultado));
				        	  	if (resultado.error==false) {
				        	  		//alerta.exito(resultado.mensaje);
									localStorage.setItem("token", resultado.token);
									if (/login/g.test(window.location.pathname)) {
										window.location.href = window.location.origin+'/@'+resultado.datos.nombre_steem+'/automatizacion';
									}else{
										window.location.href = window.location.href;
									};
				        	  	} else{
				        	  		alerta.error(resultado.mensaje);
				        	  		animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
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
					} else{
						alerta.error("Contraseña uneeverso tiene espacios");
						animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
					};
				}else{
					alerta.error("EL usuario no existe en steem");
					animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
				};
			});	
	}
	var registrar_usuario = function () {
			animaciones_g.botonLoadText('btn-registro','','activar','');
			var usuario_steem_ = $('#usuario_steem').val();
			var correo_electronico_ = $('#correo_electronico').val();
			var contrasena_uneeverso_ = $('#contrasena_uneeverso').val();			
			if (usuario_steem_=="" || contrasena_uneeverso_=="" ||
				correo_electronico_=="") {
				alerta.error("Quedan campos vacios");
				animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
				return false;
			}
			if (validar_correo(correo_electronico_)) {
				animaciones_g.botonLoadText('btn-registro','','activar','');
				isUserSteem(usuario_steem_, function (validacion_u_steem) {
					if (validacion_u_steem!=false) {						
						animaciones_g.botonLoadText('btn-registro','','activar','');
						if (isValidaContrasena(contrasena_uneeverso_)) {
							if ($('#contrasena_uneeverso').val()==$('#contrasena_uneeverso_2').val()) {

					            $("#contrasena_uneeverso_2").css('background', '#5cd867');
								if ($('#btn-acceder')) {
									$('#btn-acceder').attr('disabled',false);	
								};
								if ($('#btn-registro')) {
									$('#btn-registro').attr('disabled',false);
								};
								animaciones_g.botonLoadText('btn-registro','','activar','');
								//Enviar datos para verificar y guardarlos
								autorizacion_steem.verificar_steem_registro(usuario_steem_,function(resultado_verificar_steem){        
									if (resultado_verificar_steem) {
									    animaciones_g.botonLoadText('btn-registro','','activar','');
									    $.ajax({
											url: window.location.href+'/registrar_usuario',
											type:'POST',	
											data:{	
													nombre_steem:usuario_steem_,
													correo_electronico:correo_electronico_,
													contrasena_uneeverso:contrasena_uneeverso_,
												},
									        beforeSend: function () {

									        },
									        success:  function (resultado) {
									        	console.log("ya proceso los datos");
								        	  	//console.log(JSON.stringify(resultado));
								        	  	if (resultado.error==false) {
								        	  		//alerta.exito(resultado.mensaje);
								        	  		alertify.alert(
														"Registro exitoso",
														resultado.mensaje,
														function(){
													    	localStorage.clear();
															sessionStorage.clear();
															window.location.href="/login";
													});						        	  		
								        	  	} else{
								        	  		alerta.error(resultado.mensaje);
								        	  		animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
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
									} else{
										$('#compose-modal_autoridad').modal('show');
										alerta.error("Aun no ha autorizado a UNEEVERSO ");
										animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
									};
								})
							} else {
					            $("#contrasena_uneeverso_2").css('background', '#ea6a6a');
								if ($('#btn-acceder')) {
									$('#btn-acceder').attr('disabled',true);	
								};
								if ($('#btn-registro')) {
									$('#btn-registro').attr('disabled',true);
								};
								alerta.error("Las contraseñas uneeverso no coinciden.");
								animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
					        }
						} else{
							alerta.error("Contraseña uneeverso tiene espacios");
							animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
						};
					}else{
						alerta.error("Usuario no existe en steem");
						animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
					};
				});
			}else{
				alerta.error("Correo electrónico con formato no permitido");
				animaciones_g.botonLoadText('btn-registro','Guardar','desactivar','');
			};
	}
	var cerrar = function () {
			localStorage.clear();
			sessionStorage.clear();
			window.location.href="/admin/cerrar_sesion";
			window.location.href="";
	}
	var validar = function () {
			//hay que mejorar como se valida el token, hayq ue comprobar si el token que se verifica es desencriptable
			//si no se desencripta, seria un token falso
			var dato = localStorage.getItem("token");	
			if (dato==null || dato =="") {
				$('.html-sesion').hide();
				$('.html-sin-sesion').show();
				return false;
			}else{
				$('.html-sin-sesion').hide();
				$('.html-sesion').show();
				return true;
			};
	}
	var campos = function () {
		$('#usuario_steem').on('change', function() {
			isUserSteem($(this).val(),function (argument) {
				
			});
		});
		$('#correo_electronico').on('keyup', function() {
			validar_correo($(this).val(),function (argument) {
				
			});
		});
		
		$('#contrasena_uneeverso').on('keyup', function() {
			isValidaContrasena($(this).val());
		});
		$('#contrasena_uneeverso_2').on('keyup', function() {
			if ($('#contrasena_uneeverso').val()==$('#contrasena_uneeverso_2').val()) {

	            $("#contrasena_uneeverso_2").css('background', '#5cd867');
				if ($('#btn-acceder')) {
					$('#btn-acceder').attr('disabled',false);	
				};
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',false);
				};
				return true;
			} else {
	            $("#contrasena_uneeverso_2").css('background', '#ea6a6a');
				if ($('#btn-acceder')) {
					$('#btn-acceder').attr('disabled',true);	
				};
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',true);
				};
				return false;
	        }
		});		
	}
	var opciones_nodo_conexion = function () {
			//console.log($('#opciones_nodo_conexion').val());
			sesion.rest_con_api_steem($('#opciones_nodo_conexion').val());
	}
	var validar_correo = function (correo_) {
		var exreg_ = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
		if(exreg_.test(correo_)){
	            $("#correo_electronico").css('background', '#5cd867');
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',false);
				};
				return true;
			} else {
	            $("#correo_electronico").css('background', '#ea6a6a');
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',true);
				};
				return false;
	        }
	}
	var isUserSteem = function (usuario_steem, callback) {
			//console.log(usuario_steem);
			if (usuario_steem=="") {
				$("#usuario_steem").css('background', 'white');
				callback(false);
				return false
			};
			//steem.api.lookupAccountNames([usuario_steem], function(err, result) {
		        //console.log(err, result[0]);
		        
				$.ajax({
					url: 'https://api.steemjs.com/lookup_account_names',
					type:'GET',	
					data:{	
							accountNames:[usuario_steem],
						},
				    beforeSend: function () {

				    },
				    success:  function (result) {
						if (result[0]==null) {
				            $("#usuario_steem").css('background', '#ea6a6a');
							if ($('#btn-acceder')) {
								$('#btn-acceder').attr('disabled',true);	
							};
							if ($('#btn-registro')) {
								$('#btn-registro').attr('disabled',true);
							};					
							callback(false);
				        } else {
				            $("#usuario_steem").css('background', '#5cd867');
							if ($('#btn-acceder')) {
								$('#btn-acceder').attr('disabled',false);	
							};
							if ($('#btn-registro')) {
								$('#btn-registro').attr('disabled',false);
							};
							callback(result);
				        }
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
	}
	var isValidaContrasena = function (contrasena_uneeverso) {
			if (contrasena_uneeverso=="") {
				$("#contrasena_uneeverso").css('background', 'white');
				return false;
			};			
			var espacio_blanco  = /[ ]/i;//No se permiten espacios en blanco
			if(!espacio_blanco.test(contrasena_uneeverso)){
	            $("#contrasena_uneeverso").css('background', '#5cd867');
				if ($('#btn-acceder')) {
					$('#btn-acceder').attr('disabled',false);	
				};
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',false);
				};
				return true;
			} else {
	            $("#contrasena_uneeverso").css('background', '#ea6a6a');
				if ($('#btn-acceder')) {
					$('#btn-acceder').attr('disabled',true);	
				};
				if ($('#btn-registro')) {
					$('#btn-registro').attr('disabled',true);
				};
				return false;
	        }
	}
	var datos_sesion = function (callback) {
				var token = localStorage.getItem("token");
				if (token==null || token=="") {
					callback(false);
					return false;
				};
				var url___ = window.location.protocol+'//'+window.location.hostname+'/liberar_token';
				if (/localhost/.test(window.location.hostname)) {
					url___ = window.location.protocol+'//'+window.location.hostname+web_puerto+'/liberar_token';
				};
				$.ajax({
					url: url___,
					type:'POST',	
					data:{	
							token:token,
							key_master_public:"$sfssdf#SDFS%#$242342&564&23329&%&/%&/%",
						},
			        beforeSend: function () {},
			        success:  function (resultado) {
		        	  	//console.log(JSON.stringify(resultado));	
		        	  	if (resultado.error==false) {
		        	  		
		        	  		localStorage.setItem('nombre_steem', JSON.parse(resultado.datos).nombre_steem)
		        	  		localStorage.setItem('cant_steem_power_auto', JSON.parse(resultado.datos).cant_steem_power_auto)
		        	  		localStorage.setItem('token', resultado.token);
		        	  		callback(JSON.parse(resultado.datos));	
		        	  	} else{
		        	  		sesion.gestion_erro_conexion()
		        	  		$('#opciones_nodo_conexion').show();
		        	  		callback(false);	
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
	var extraerDatos = function () {
			sesion.campos()
			sesion.rest_con_api_steem(0);

			if(sesion.validar()==false){
				return false;
			}
			sesion.datos_sesion(function (result_datos_sesion) {
				var datos_token = result_datos_sesion;
				var id_usuario = datos_token.nombre_steem;
				//steem.api.getAccounts([id_usuario], function(err, result) {
					$.ajax({
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
								return false;
							} else{
								//sesion.gestion_erro_conexion()
								$('.html-sesion-menu-p').show();
								if ($('#panel_money_account').length>0) {
									$('.slimScrollDiv').css('height', '306px')
									$('.slimScrollDiv ul').css('height', '306px')
								};
								if ($('#conten_seguimiento_seguir').length>0) {
									$('#conten_seguimiento_seguir').show()
								}
								main.Iniciar();
							};
							//console.log(err, result);
							var cuenta_usuario = result[0].name;
							var datos_usuario = JSON.parse(result[0].json_metadata);
							var nombreMuestra = (datos_usuario.profile.name)?datos_usuario.profile.name:id_usuario;
							var profile_image = (datos_usuario.profile.profile_image)?datos_usuario.profile.profile_image:'';
							var cover_image = (datos_usuario.profile.cover_image)?datos_usuario.profile.cover_image:'';
							var detalles = (datos_usuario.profile.about)?datos_usuario.profile.about:'';
							var location = (datos_usuario.profile.location)?datos_usuario.profile.location:'';
							var website = (datos_usuario.profile.website)?datos_usuario.profile.website:'';
							var reputation = steem.formatter.reputation(result[0].reputation);
							var post_count = result[0].post_count;
							var sbd_balance = result[0].sbd_balance;

							// Urls
							$('.url_user').attr('href', '/@'+cuenta_usuario);
							$('.url_auto').attr('href', '/@'+cuenta_usuario+'/automatizacion');
							$('.url_config').attr('href', '/@'+cuenta_usuario+'/configuracion');
							$('.url_config_auto').attr('href', '/@'+cuenta_usuario+'/configuracion/automatizacion');
							$('.url_segu').attr('href', '/@'+cuenta_usuario+'/seguidores');
							$('.url_sigu').attr('href', '/@'+cuenta_usuario+'/siguiendo');
							$('.url_cfg_auto').attr('href', '/@'+cuenta_usuario+'/configuracion/automatizacion');
							$('.url_cfg').attr('href', 'https://steemit.com/@'+cuenta_usuario+'/settings');
							$('.url_info').attr('href', 'https://steemit.com/trending/uneeverso');
								
							//
							$('#nombreMuestra_pju').text(nombreMuestra);
							$('#nombreMuestra').text(nombreMuestra);
							if ($('#nombreMuestra_admin').length>0) {
								$('.url_user').attr('href', '/@'+cuenta_usuario);
								$('#nombreMuestra_admin').text(cuenta_usuario);
								$('#reputation_admin p').text(reputation+' %');
							}else{
								$('#reputacion_pju').text(''+reputation+'');
								//Precios de monedas
								sesion.precio_divisa("SBD",sbd_balance);
							};
							if (profile_image){
								if ($('#icon_user_menu').length>0) {
									$('#icon_user_menu img').attr('src', profile_image);
									$('#icon_user_menu img').attr('style', 'width: 35px;height: 100%;margin-right: 12px;margin-top: -7px;');
								}
								if ($('#profile_image').length>0) {
									$('#profile_image').attr('src', profile_image);	
								}
								if ($('#profile_image_admin').length>0) {
									$('#profile_image_admin').attr('src', profile_image);
								};							
							}else{
								if ($('#icon_user_menu').length>0) {
									$('#icon_user_menu img').attr('src', '');	
								}
								if ($('#profile_image').length>0) {
									$('#profile_image').hide();
								}
								if ($('#profile_image_admin').length>0) {
									$('#profile_image_admin').hide();
								};
							};

							if ($('#cover_image')) {
								$('#cover_image').css('background-image', "url('https://steemitimages.com/2048x512/"+cover_image+"')");
								$('#cover_image').css('background-size', 'cover');	
								$('#cover_image').css('background-position', '50% 50%');	
							};
							if ($('#cover_image_admin')) {
								$('#cover_image_admin').css('background', 'url('+cover_image+') no-repeat');
								$('#cover_image_admin').css('background-size', '100%');								
							};

							var conseguido_ ="";
							var falta_ ="";
							if (reputation>30) {
								var conseguido_ ='<span style="color:white;">Reputación '+reputation+'% </span>';
								var falta_ ='';
							}else{
								var conseguido_ ='';
								var falta_ ='<span style="color:white;"> Reputación '+reputation+'% </span>';
							};

							$('#txt-reputation').append('<a href=""><div class="progress xs">'+
													'<div id="width-reputation"'+ 
													'class="progress-bar progress-bar-green"'+
									 				'style="width: 40%"  '+
									 				'role="progressbar" aria-valuenow="0" aria-valuemin="0", aria-valuemax="100">'+
									 				conseguido_+
									 				'</div>'+
									 				falta_+
									 				'</div></a>');
							$('#width-reputation').css('width', reputation+'%');


							var secondsago = (new Date - new Date(result[0].last_vote_time + "Z")) / 1000;
							var pvoto_ = result[0].voting_power + (10000 * secondsago / 432000);
							pvoto_ = Math.min(pvoto_ / 100, 100).toFixed(2);
							//console.log("Poder de voto"+pvoto_);

							var conseguido_pv_ ="";
							var falta_pv_ ="";
							if (pvoto_>50) {
								var conseguido_pv_ ='<span style="color:white;">Poder de voto '+pvoto_+'% </span>';
								var falta_pv_ ='';					
							} else{
								var conseguido_pv_ ='';
								var falta_pv_ ='<span style="color:white;">Poder de voto '+pvoto_+'% </span>';
							};


							$('.vp_disponible_usuario').text(pvoto_+'%')

							$('#txt-poder-voto').append('<a href=""><div class="progress xs ">'+
													'<div id="width-poder-voto"'+ 
													'class="progress-bar progress-bar-aqua width-poder-voto"'+
									 				'style=""  '+
									 				'role="progressbar" aria-valuenow="0" aria-valuemin="0", aria-valuemax="100">'+
									 				conseguido_pv_+
									 				'</div>'+
									 				falta_pv_+
									 				'</div></a>');
							$('.width-poder-voto').css('width', pvoto_+'%');
		        			//$('#barra_votos .progress-bar').removeClass('active');
		        			//$('#barra_votos .progress-bar').removeClass('progress-bar-striped');
							/*$.ajax({
								url: 'https://api.steemjs.com/get_follow_count',
								type:'GET',	
								data:{	
										account:[id_usuario],
									},
							    beforeSend: function () {

							    },
							    success:  function (result) {
							    	$('#seguidores').text(result.follower_count);				
									$('#sigues').text(result.following_count);
								},
								error:  function(error) {
									console.log(JSON.stringify(error));
							    }	 
							});	*/
					        
					    },
						error:  function(error) {
							console.log(JSON.stringify(error));
							alerta.error("Debe actualizar la pagina web.");
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
	var url_extrar_usuario = function (para_pagina) {
				
		var url_fin = "";
		switch(para_pagina){
			case 'perfil':
				var url = window.location.pathname;
				url = url.replace('/','');
				url = url.replace('/','');
				url = url.replace('comentarios','');
				url = url.replace('respuestas','');
				url = url.replace('recompensas-autor','');
				url = url.replace('recompensas-curacion','');
				url = url.replace('monedero','');
				url = url.replace('configuracion/automatizacion','');
				url = url.replace('configuracion','');
				url = url.replace('automatizacion','');
				url = url.replace('seguidores','');
				url = url.replace('siguiendo','');
				url_fin = url.replace(/[@]/gi,'');
				return url_fin;				
			break;
			case 'user_seguidores':
				var url = window.location.pathname;
				var url_2 = url.replace('seguidores','');
				var url_3 = url_2.replace('/','');
				var url_4 = url_3.replace('/','');
				url_fin = url_4.replace(/[@]/gi,'');
				return url_fin;				
			break;
			case 'user_siguiendo':
				var url = window.location.pathname;
				var url_2 = url.replace('siguiendo','');
				var url_3 = url_2.replace('/','');
				var url_4 = url_3.replace('/','');
				url_fin = url_4.replace(/[@]/gi,'');			
				return url_fin;
			break;
		}
	}	
	var rest_con_api_steem = function (opcion_select_) {
			// assuming websocket is work at ws.golos.io
			var url_api_;
			switch(opcion_select_){
				case 'api.steemit.com':
					url_api_ = 'https://api.steemit.com';
				break;
				/*case 'steemd.steemit.com':
					url_api_ = 'wss://steemd.steemit.com';
				break;*/
				case 'steemd.privex.io':
					url_api_ = 'wss://steemd.privex.io';
				break;
				case 'steemd.minnowsupportproject.org':
					url_api_ = 'wss://steemd.minnowsupportproject.org';
				break;
				case 'steemd.pevo.science':
					url_api_ = 'wss://steemd.pevo.science';
				break;
				case 'gtg.steem.house:8090':
					url_api_ = 'wss://gtg.steem.house:8090';
				break;
				case 'seed.bitcoiner.me':
					url_api_ = 'wss://seed.bitcoiner.me';
				break;
				case 'rpc.buildteam.io':
					url_api_ = 'https://api.buildteam.io';
				break;
			}
			if (opcion_select_!=0) {
				localStorage.setItem("url_api_nodo", url_api_);
				window.location.href='';
			}else{
				if(localStorage.getItem("url_api_nodo")=="" || localStorage.getItem("url_api_nodo")==null) {
					localStorage.setItem("url_api_nodo", 'https://api.steemit.com');
					//localStorage.setItem("url_api_nodo", 'wss://steemd.minnowsupportproject.org');
				};
				var ctrl_tiempo_conexion = setTimeout(function () {
					gestion_erro_conexion();
				},10000);
				steem.api.setOptions({ url: localStorage.getItem("url_api_nodo") }); 	
			  	/*
			  	steem.api.login('', '', function(err, result) {
			  		//console.log(err, result);
					clearTimeout(ctrl_tiempo_conexion);
					//$('#btn_opciones_nodo_conexion').hide();
					$('#aviso_conexion').hide();			  		
				});
				*/
			}	

				  
	}
	//https://api.coinmarketcap.com/v1/ticker/steem-dollars/?convert=ETH
	var precio_divisa = function (divisa_,sbd_balance_) {
			var api_divisa_;
			switch(divisa_){
				case 'STEEM':
				break;
				case 'SBD':
					api_divisa_ = "https://api.coinmarketcap.com/v1/ticker/steem-dollars/?convert=ETH";
				break;
				case 'BTC':
				break;
				case 'ETH':
				break;
			}
			$.ajax({
				url: api_divisa_,
				type:'GET',
		        beforeSend: function () {},
		        success:  function (resultado) {
	        	  	//console.log(JSON.stringify(resultado));	
	        	  	var price_usd_ = JSON.stringify(resultado[0].price_usd).substring(1,5);
	        	  	var price_btc_ = resultado[0].price_btc;
	        	  	var price_eth_ = resultado[0].price_eth;
	        	  	//console.log("Precio USD: "+price_usd_);
	        	  	// Mercado
	        	  	if (/-/.test(resultado[0].percent_change_24h)) {
	        	  		$('#porcentaje_cambio').css('color','red');
	        	  	};
	        	  	$('#porcentaje_cambio').text('('+resultado[0].percent_change_24h+'%)');
	        	  	$('#precio_d_usb').text(price_usd_);
	        	  	$('#precio_d_btc').text(price_btc_);
	        	  	$('#precio_d_eth').text(price_eth_);
	        	  	$('#monedas').css('display', 'block');
	        	  	// Monedero
	        	  	if (sbd_balance_!="") {
	        	  		sbd_balance_ = sbd_balance_.replace(/([A-Z])\w+/g,'');
	        	  		$('#monedero').css('display', 'block');
	        	  		$('#calcular_monedas').css('display', 'block');
		        	  	//console.log(price_usd_,price_btc_,price_eth_);
		        	  	//console.log(price_usd_*sbd_balance_);
		        	  	$('#tu_sbd_balance').text(sbd_balance_);
		        	  	var m_price_usd_ = price_usd_*sbd_balance_;
		        	  	var m_price_btc_ = price_btc_*sbd_balance_;
		        	  	var m_price_eth_ = price_eth_*sbd_balance_;
		        	  	$('#monedero_precio_d_usb').text(m_price_usd_.toString().substring(0,5));
		        	  	$('#monedero_precio_d_btc').text(m_price_btc_.toString().substring(0,10));
		        	  	$('#monedero_precio_d_eth').text(m_price_eth_.toString().substring(0,12));

	        	  	};
		        	$('#img_money_account').hide();
		        },
		    	error:  function(error) {
		    		console.log(JSON.stringify(error));
		    		alerta.error("Debe actualizar la pagina web.")
		    	}	 
			});		
	}
	var solicitar_contrasena = function () {

			animaciones_g.botonLoadText('btn-registro','','activar','');
			var usuario_steem_ = $("#usuario_steem").val();
			if (usuario_steem_==null || usuario_steem_=="") {
				animaciones_g.botonLoadText('btn-registro','Solicitar contraseña','desactivar','');
				return false;
			};
				animaciones_g.botonLoadText('btn-registro','','activar','');
				var url___ = window.location.protocol+'//'+window.location.hostname+'/cuenta/solicitando_recuperar_contrasena';
				if (/localhost/.test(window.location.hostname)) {
					url___ = window.location.protocol+'//'+window.location.hostname+web_puerto+'/cuenta/solicitando_recuperar_contrasena';
				};

				$.ajax({
					url: url___,
					type:'POST',	
					data:{	
							nombre_steem : usuario_steem_,
						},
			        beforeSend: function () {},
			        success:  function (resultado) {
		        	  	//console.log(JSON.stringify(resultado));	
		        	  	if (resultado.error==false) {
		        	  		alertify.alert(
								"Solicitud realizada:",
								resultado.mensaje,
								function(){
							    	localStorage.clear();
									sessionStorage.clear();
									window.location.href="/login";
							});
		        	  	} else{
		        	  		alerta.error(resultado.mensaje);
		        	  		animaciones_g.botonLoadText('btn-registro','Solicitar contraseña','desactivar','');
		        	  	};
			        },
			    	error:  function(error) {
			    		console.log(JSON.stringify(error));
			    		alerta.error("Intente nuevamente el procedimiento.");
			    	}	 
				});

	}
	var cambiar_contrasena = function () {
			animaciones_g.botonLoadText('btn-registro','','activar','');
			var usuario_steem_ = $('#usuario_steem').val();
			var contrasena_uneeverso_ = $('#contrasena_uneeverso').val();			
			var codigo_recuperacion_ = $('#codigo_recuperacion').val();
			if (usuario_steem_=="" || contrasena_uneeverso_=="" ||
				 codigo_recuperacion_=="" ) {
				animaciones_g.botonLoadText('btn-registro','Cambiar contraseña','desactivar','');
				return false;
			}
			isUserSteem(usuario_steem_, function (validacion_u_steem) {
				if (validacion_u_steem!=false) {
					animaciones_g.botonLoadText('btn-registro','','activar','');
					if (isValidaContrasena(contrasena_uneeverso_)) {
						animaciones_g.botonLoadText('btn-registro','','activar','');
					    $.ajax({
							url: window.location.href+'/enviar-cambio',
							type:'POST',	
							data:{	
									nombre_steem:usuario_steem_,
									contrasena_uneeverso:contrasena_uneeverso_,
									codigo_recuperacion:codigo_recuperacion_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {
				        	  	//console.log(JSON.stringify(resultado));
				        	  	if (resultado.error==false) {
				        	  		
				        	  		alertify.alert(
										"Cambio realizado:",
										resultado.mensaje,
										function(){
									    	localStorage.clear();
											sessionStorage.clear();
											window.location.href="/login";
									});
				        	  		//alerta.exito(resultado.mensaje);
									
				        	  	} else{
				        	  		alerta.error(resultado.mensaje);
				        	  		animaciones_g.botonLoadText('btn-registro','Cambiar contraseña','desactivar','');
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

					} else{
						alerta.error("Contraseña uneeverso tiene espacios");
						animaciones_g.botonLoadText('btn-registro','Cambiar contraseña','desactivar','');
					};
				}else{
					alerta.error("Usuario steem no existe");
					animaciones_g.botonLoadText('btn-registro','Cambiar contraseña','desactivar','');
				};
			});
	}

	var gestion_erro_conexion = function () {

			var url_api_nodo = localStorage.getItem("url_api_nodo");
			url_api_nodo = url_api_nodo.replace(/(wss||http||https):\/\//g,'_').replace(/[.]/g,'_').replace(/[:]/g,'_');
			$('#opc'+url_api_nodo).hide();
			$('#btn_opciones_nodo_conexion').removeClass('conexion_on').addClass('conexion_off');
			//$('#btn_opciones_nodo_conexion #ico_conexion_on').hide();
			$('#btn_opciones_nodo_conexion').show();
			$('#aviso_conexion').show();
			steem.api.login('', '', function(err, result) {
		  		console.log(err, result);
				clearTimeout(ctrl_tiempo_conexion);
				$('#btn_opciones_nodo_conexion').hide();
				$('#aviso_conexion').hide();			  		
			});			
			setTimeout(function () {

				$('#btn_opciones_nodo_conexion').on('click',function (e) {
					if ($('#btn_opciones_nodo_conexion').data('estado')==0) {
						$('#btn_opciones_nodo_conexion').data('estado', 1);
						$('#aviso_conexion').show();
					} else{
						$('#btn_opciones_nodo_conexion').data('estado', 0);
						$('#aviso_conexion').hide();
					};
				});			
			},5000);
	}
	var borrar_tiempo_aviso_conexion = function () {
		clearTimeout(ctrl_tiempo_conexion);
		$('#btn_opciones_nodo_conexion').hide();
		$('#aviso_conexion').hide();
	}





	var seguir = function (nombre_steem_seguimiento) {
			animaciones_g.botonLoad('btn-seguir','activar');
			$('#btn-seguir').attr("onclick", "")
			sesion.datos_sesion(function (result_datos_sesion) {
				if (result_datos_sesion!=false) {
					/** Unfollow an user */
					var json = JSON.stringify(
					    ['follow', {
					    	follower: result_datos_sesion.nombre_steem,
					    	following: nombre_steem_seguimiento,
					    	what: ['blog']
					    }]
					  );
					  sesion.rest_con_api_steem(0);
					  steem.broadcast.customJson(
					    result_datos_sesion.wif_post_priv_steem,
					    [], // Required_auths
					    [result_datos_sesion.nombre_steem], // Required Posting Auths
					    'follow', // Id
					    json, //
					    function(err, result) {
					    	animaciones_g.botonLoad('btn-seguir','desactivar');
					    	$('#btn-seguir').attr("onclick", "sesion.seguir('"+nombre_steem_seguimiento+"')")
						    if (err) {
							  	console.log(err, result);
						    }else{
						    	$('#btn-dejar-seguimiento').attr("onclick", "sesion.dejar_seguir('"+nombre_steem_seguimiento+"')")
						    	$('#btn-seguir').hide()
					    		$('#btn-dejar-seguimiento').show()
						    };
					    }
					  );
				}else{


				};
			});
	}



	var dejar_seguir = function (nombre_steem_seguimiento) {
			animaciones_g.botonLoad('btn-dejar-seguimiento','activar');
			$('#btn-dejar-seguimiento').attr("onclick", "")
			sesion.datos_sesion(function (result_datos_sesion) {
				if (result_datos_sesion!=false) {
					/** Unfollow an user */
					  var json = JSON.stringify(
					    ['follow', {
					      follower: result_datos_sesion.nombre_steem,
					      following: nombre_steem_seguimiento,
					      what: []
					    }]
					  );
					  sesion.rest_con_api_steem(0);
					  steem.broadcast.customJson(
					    result_datos_sesion.wif_post_priv_steem,
					    [], // Required_auths
					    [result_datos_sesion.nombre_steem], // Required Posting Auths
					    'follow', // Id
					    json, //
					    function(err, result) {
					    	animaciones_g.botonLoad('btn-dejar-seguimiento','desactivar');
					    	$('#btn-dejar-seguimiento').attr("onclick", "sesion.dejar_seguir('"+nombre_steem_seguimiento+"')")
						    if (err) {
							  	console.log(err, result);
						    }else{
						    	$('#btn-seguir').attr("onclick", "sesion.seguir('"+nombre_steem_seguimiento+"')")
						    	$('#btn-dejar-seguimiento').hide()
					    		$('#btn-seguir').show()
						    };
					    }
					  );
				




				}else{


				};
			});
	}
 	return{
		app:function  () {
			campos();
			var dato = localStorage.getItem("token");			
			if (dato!=null && dato !="") {

				//window.location.href='/@'+dato+'/automatizacion';
			};
		},
		campos : campos,
		gestion_erro_conexion : gestion_erro_conexion,
		iniciar : iniciar,
		registrar_usuario : registrar_usuario,
		cerrar : cerrar,
		validar : validar,
		datos_sesion : datos_sesion,
		isUserSteem : isUserSteem,
		isValidaContrasena : isValidaContrasena,
		validar_correo : validar_correo,
		rest_con_api_steem : rest_con_api_steem,
		extraerDatos : extraerDatos,
		url_extrar_usuario : url_extrar_usuario,
		precio_divisa : precio_divisa,
		solicitar_contrasena : solicitar_contrasena,
		cambiar_contrasena : cambiar_contrasena,
		opciones_nodo_conexion : opciones_nodo_conexion,
		borrar_tiempo_aviso_conexion : borrar_tiempo_aviso_conexion,
		seguir : seguir,
		dejar_seguir : dejar_seguir,
	}
}();
