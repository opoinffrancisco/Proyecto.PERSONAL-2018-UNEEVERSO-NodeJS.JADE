var perfil_automatizacion = function () {

	var activar_modal_activar = function () {
			activar_desactivar(1);
	}
	var activar_modal_desactivar = function () {
			$('#send_desac_btn_activar_modal').click();
	}
	var activar_desactivado_automatizacion = function () {
			var opinion_desactivacion_ = $("#opinion_desactivacion").val();
			if (opinion_desactivacion_=="") {
				alerta.error("La opinión es requerida para desactivar la automatización");
				return false;
			}else{
				if (opinion_desactivacion_.length<15) {
					alerta.error("La opinión es muy corta");
					return false;
				}else{
					$('.cerrar_modal').click();
					activar_desactivar(0);						
				}
			};
	}


	var activar_desactivar = function (activar_desactivar_) {		
		animaciones_g.botonLoad('activar_desactivar_btn','activar');
		sesion.datos_sesion(function (result_datos_sesion) {
			//console.log(result_datos_sesion);
			var usuario_steem_ = result_datos_sesion.nombre_steem;
			var opinion_desactivacion_ = $("#opinion_desactivacion").val();
			if (usuario_steem_=="" ) {
				animaciones_g.botonLoad('activar_desactivar_btn','desactivar');
				alerta.error("El usuario no es correcto, proceda a cerrar e iniciar sesión");
				return false;
			}
			$.ajax({
				url: window.location.href+'/activar_desactivar_automatizacion',
				type:'POST',	
				data:{	
						nombre_steem:usuario_steem_,
						activar_desactivar:activar_desactivar_,
						opinion_desactivacion:opinion_desactivacion_,
				},
				beforeSend: function () {

				},
				success:  function (resultado) {
					$("#opinion_desactivacion").val('');
					//console.log(JSON.stringify(resultado));
					if (resultado.error==false) {
						alerta.exito(resultado.mensaje);
						localStorage.setItem("token", resultado.token);
						//console.log(resultado.datos)
						validar_auto(resultado.datos);
					} else{
						alerta.error(resultado.mensaje);
					};
					animaciones_g.botonLoad('activar_desactivar_btn','desactivar');
				},
				error:  function(error) {
					animaciones_g.botonLoad('activar_desactivar_btn','desactivar');
					console.log(JSON.stringify(error));
				}	 
			});				
		});
	}
	var guardar_url = function () {

		animaciones_g.botonLoad('send_url_btn','activar');
		sesion.datos_sesion(function (result_datos_sesion) {
			var usuario_steem_ = result_datos_sesion.nombre_steem;
			var url_post_comm_ = $('#url_post_comm').val();
			if (url_post_comm_=="") {
				animaciones_g.botonLoad('send_url_btn','desactivar');
				alerta.error("No hay url en el formulario");
				return false;
			}
			autorizacion_steem.verificar_steem(usuario_steem_, function(resultado_verificar_steem){
				if (resultado_verificar_steem) {
					//fecha_actual 
					var url_post_comm_GESTIONADA = perfil_automatizacion.limpiar_url(url_post_comm_);
					if (url_post_comm_GESTIONADA!=false) {
						if (url_post_comm_GESTIONADA.usuario_url == usuario_steem_) {
					        $.ajax({
					          url: 'https://api.steemjs.com/get_content',
					          type:'GET', 
					          data:{  
					              author:url_post_comm_GESTIONADA.usuario_url,
					              permlink:url_post_comm_GESTIONADA.url,
					            },
					            beforeSend: function () {
					            },
					            success:  function (result) {              

								//steem.api.getContent(url_post_comm_GESTIONADA.usuario_url, url_post_comm_GESTIONADA.url, function(err, result) {
								//console.log(err, result);							
									//console.log(result.author);
									if (result.author!="" && result.author!=null){
											$.ajax({
												url: window.location.href+'/guardar_url',
												type:'POST',	
												data:{	
													nombre_steem:usuario_steem_,
													etiqueta_url:url_post_comm_GESTIONADA.etiqueta_url,
													url_post_comm:url_post_comm_GESTIONADA.url,
													fecha_publicacion: moment(result.created).format("YYYY-MM-DD"),
												},
										        beforeSend: function () {

										        },
										        success:  function (resultado) {
									        	  	//console.log(JSON.stringify(resultado));
									      	  	if(resultado.error==false){																				  		
													var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
													/*sesion.rest_con_api_steem(0);
											  		steem.broadcast.comment(
													    resultado.promotor_wif_priv_posting, // wif del comentarista
													    resultado.nombre_steem, // Parent Author
													    resultado.url_post_comm, // Parent Permlink
													    resultado.promotor_usuario, // Author de comentario
													    permlink, // Permlink
													    '', // Title
																	'¡@'+resultado.nombre_steem+'! Muy bueno el contenido, sigue asi! <br><br>'+
																	'Esta publicación es apoyada por la comunidad de <a href="https://uneeverso.com/registro" target="_blank">UNEEVERSO</a>, para que al obtener votos automatizados pueda conseguir <b>PROMOCIÓN GRATUITA</b> y pueda darse a conocer a un <b> público más grande. </b> Este contenido lo merece, considera darle reesteem.'+
																	'<h1>¿Te interesa, obtener upvotos y dar a conocer tu publicación?</h1><br>'+
																	'Te invitamos a unirte a nuestra comunidad, cada día crece más y tu puedes crecer con nosotros. <br>'+
																	'¿Te interesa conocer sobre nuestro proyecto?: https://goo.gl/cuFExt <br>'+
																	'¿Te interesa conocer sobre nosotros y sobre actualizaciones de uneeverso.com?: <br>'+
																	'  * Acceso a Uneeverso : https://www.uneeverso.com/registro <br>'+
																	'  * Uneeverso en discord: https://discord.gg/Y5kM5Kj <br>'+
																	'  * Siguenos: [@blickyer](/@blickyer) [@yunior.selbor](/@yunior.selbor) [@sweetvenon](/@sweetvenon) [@arevaloarcadio](/@arevaloarcadio) [@baudilio](/@baudilio) [@jnavarrotovar](/@jnavarrotovar) <br>',
																	//+'<center>'+
																	//'https://steemitimages.com/DQmaAxWEv7idDLT4LL5oxLxWCui5nfmkcAq5BsnfevTvMS1/te-esperamos-en-uneeverso-baja-calidad.jpg'+
																	//'</center>', // Body
													    { tags: ['uneeverso'], app: 'uneeverso' }, // Json Metadata
													    function(err, result) {
													      if (err) {
													      	//console.log(err);
													      	//console.log("Comentario de publicidad no enviado ");
													      } else{
																				alerta.exito("Comentario de apoyo aleatorio enviado");
													      };
													});*/
													$('#url_post_comm').val("");
									        	  	animaciones_g.botonLoad('send_url_btn','desactivar');																						  					        	  		
													alerta.exito(resultado.mensaje);
													perfil_automatizacion.cargar_lista_espera_personal();
									      	  	} else{
									      	  		alerta.error(resultado.mensaje);
									      	  	};
									      	  	$('#url_post_comm').val("");
																			animaciones_g.botonLoad('send_url_btn','desactivar');
										        },
						    					error:  function(error) {
													console.log(JSON.stringify(error));
													animaciones_g.botonLoad('send_url_btn','desactivar');
											   }	 
											});
									} else{
										animaciones_g.botonLoad('send_url_btn','desactivar');
										alerta.error("Error al obtener los datos: La url no es correcta");
									};
								//});
								},
								error:  function(error) {
									console.log(JSON.stringify(error));
								}  
							});
						} else{
							animaciones_g.botonLoad('send_url_btn','desactivar');
							alerta.error("Esta url no le pertenece");
						};
					} else{
						animaciones_g.botonLoad('send_url_btn','desactivar');
						alerta.error("La url, no pertenece a una publicación de la red steem");
					};
				}else{
					alerta.error("Disculpe, aun no ha autorizado a UNEEVERSO.");
					$('.content').hide();
					$('#compose-modal_autoridad').modal('show')
					animaciones_g.botonLoad('send_url_btn','desactivar');
				}
			});
		});
	}
	var verificar_votos = function () {
		animaciones_g.botonLoad('send_v_votos_btn','activar');
		var url_post_comm_ = $('#destalles_url_post').val();
		if (url_post_comm_=="") {
			animaciones_g.botonLoad('send_v_votos_btn','desactivar');
			alerta.error("No hay url en el formulario");
			return false;
		}
		//fecha_actual 
		var url_post_comm_GESTIONADA = perfil_automatizacion.limpiar_url(url_post_comm_);
		sesion.isUserSteem(url_post_comm_GESTIONADA.usuario_url, function (validacion_u_steem) {
			if (url_post_comm_GESTIONADA!=false) {
				if (validacion_u_steem!=false) {					
					
					$('#send_v_votos_btn_activar_modal').click();
					animaciones_g.botonLoad('send_v_votos_btn','desactivar');
					$('#destalles_url_post').val('');
					votos.cargar_votos_post({
						url_publicacion : url_post_comm_GESTIONADA.url,
						usuario_steem : url_post_comm_GESTIONADA.usuario_url,
					});

				
				}else{
					animaciones_g.botonLoad('send_v_votos_btn','desactivar');
					alerta.error("EL usuario de la url de la publiación no existe en steem");
				};
			}else{
					animaciones_g.botonLoad('send_v_votos_btn','desactivar');
					alerta.error("La url, no pertenece a una publicación de la red steem");
			};			
		});
	}

	// Cuando esta vacia de espera, muestra error en consola
	var cargar_lista_espera_personal = function () {
			animaciones_g.listaLoad('lista_espera_personal',2,'activar');
			sesion.datos_sesion(function (datos_token) {
				var usuario_steem_ = datos_token.nombre_steem;
				if (datos_token!=false) {
					    $.ajax({
							url: window.location.href+'/cargar_lista_espera_personal',
							type:'POST',	
							data:{	
									nombre_steem:usuario_steem_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {

				        	  	//console.log(JSON.stringify(resultado));
				        	  	if (resultado.error==false) {
				        	  		//console.log(resultado.datos);
				        	  		if (resultado.datos.length>0) {
										$('#lista_espera_personal').html('');				
										$(resultado.datos).each(function (index_1, result_1) {
											if (result_1.etiqueta==null || result_1.etiqueta=="") {
												var gestion_mostrar_url = '<td>'+result_1.url+'</td>';
											} else{ 
												var gestion_mostrar_url = '<td><a href="/'+result_1.etiqueta+'/@'+result_1.nombre_steem+'/'+result_1.url+'" target="_blank">'+result_1.url+'<a></td>';
											};


											var color_bar_progress = "";
												/*switch(){

											}				        	  	
											progress-bar-success
											bg-light-blue
											progress-bar-yellow
											progress-bar-danger
												*/
												// falta etiqueta
												///uneeverso/@blickyer/uneeverso-lanzamiento-oficial-0-5-automatizador-bot-integrado-al-back-end-del-front-end
											$('#lista_espera_personal').append('<tr>'+
												gestion_mostrar_url+
												/*'<td >'+
													'<div class="progress xs progress-striped active">'+
														'<div class="progress-bar '+color_bar_progress+'" style="width: 80%">'+
														'</div>'+		
													'</div>'+
												'</td>'+*/
												'<td>'+
													'<center>'+
														'<span class="badge " ><b data-toggle="tooltip" title="Esperando obtener votos">'+result_1.numero_en_cola+'</b></span>'+
													'</center>'+
												'</td>'+
											'<tr>');
										});
									}else{
										animaciones_g.listaLoad('lista_espera_personal',2,'desactivar');
									};
								}else{
									animaciones_g.listaLoad('lista_espera_personal',2,'desactivar');
								};

								perfil_automatizacion.cargar_lista_votos_personal();
					        },
					    	error:  function(error) {
								console.log(JSON.stringify(error));
								animaciones_g.listaLoad('lista_espera_personal',2,'desactivar');
						    }	 
						});

				}else{
					alerta.error("Congestión de red, actualice la pagina");
					animaciones_g.listaLoad('lista_espera_personal',2,'desactivar');
				};
			});
	}
	// Cuando esta vacia de espera, muestra error en consola
	var cargar_lista_votos_personal = function () {
		animaciones_g.listaLoad('lista_votos_personal',4,'activar');
		sesion.datos_sesion(function (datos_token) {
			if (datos_token!=false) {
			    $.ajax({
					url: window.location.href+'/cargar_lista_votos_personal',
					type:'POST',	
					data:{	
							nombre_steem:datos_token.nombre_steem,
						},
			        beforeSend: function () {

			        },
			        success:  function (resultado) {
		        	  	//console.log(JSON.stringify(resultado));
		        	  	if (resultado.error==false) {
		        	  		//console.log(resultado.datos);
		        	  		if (resultado.datos.length>0) {
								$('#lista_votos_personal').html('');				
								$(resultado.datos).each(function (index_1, result_1) {
									if (result_1.etiqueta==null || result_1.etiqueta=="") {
										var gestion_mostrar_url = '<td>'+result_1.url+'</td>';
									} else{ 
										var gestion_mostrar_url = '<td><a href="/'+result_1.etiqueta+'/@'+result_1.nombre_steem+'/'+result_1.url+'" target="_blank">'+result_1.url+'<a></td>';
									}; 

									$('#lista_votos_personal').append('<tr>'+
										'<td>'+
											'<center>'+
												'<button onclick="votos.cargar_votos_post(this)" data-url_publicacion="'+result_1.url+'" data-usuario_steem="'+result_1.nombre_steem+'" data-toggle="modal" data-target="#compose-modal_votos" data-toggle="tooltip" title="Votantes de la ronda" style="float:pull-right;" class="btn bg-blanco btn-sm"><div class="fa  fa-search"></div></button>'+
											'</center>'+
										'</td>'+
										gestion_mostrar_url+
										'<td>'+
											'<center>'+
												'<span class="badge "><b data-toggle="tooltip" title="Se emitierón los votos">'+result_1.fecha_votacion+'</b></span>'+
											'</center>'+
										'</td>'+
										'<td>'+
											'<center>'+
												'<span class="badge " ><b data-toggle="tooltip" title="Votos obtenidos">'+result_1.cant_voto+'</b></span>'+
											'</center>'+
										'</td>'+
									'<tr>');
								});
							}else{
								animaciones_g.listaLoad('lista_votos_personal',4,'desactivar');
							};
						}else{
							animaciones_g.listaLoad('lista_votos_personal',4,'desactivar');
						};
						perfil_automatizacion.mostrar_consumo_barra()						
			        },
			    	error:  function(error) {
			    		animaciones_g.listaLoad('lista_votos_personal',4,'desactivar');
						console.log(JSON.stringify(error));
				    }	 
				});
			}else{
				alerta.error("Congestión de red, actualice la pagina");
				animaciones_g.listaLoad('lista_votos_personal',4,'desactivar');
			};
		});
	}
	// Cuando esta vacia de espera, muestra error en consola
	var cargar_lista_detenidos_personal = function () {
			animaciones_g.listaLoad('lista_detencion_personal',2,'activar');
			sesion.datos_sesion(function (datos_token) {
				var usuario_steem_ = datos_token.nombre_steem;
				if (datos_token!=false) {
					    $.ajax({
							url: window.location.href+'/cargar_lista_detenidos_personal',
							type:'POST',	
							data:{	
									nombre_steem:usuario_steem_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {

				        	  	//console.log(JSON.stringify(resultado));
				        	  	if (resultado.error==false) {
				        	  		//console.log(resultado.datos);
				        	  		if (resultado.datos.length>0) {
																		$('#lista_detencion_personal').html('');				
																		$(resultado.datos).each(function (index_1, result_1) {
																			if (result_1.etiqueta==null || result_1.etiqueta=="") {
																				var gestion_mostrar_url = '<td>'+result_1.url+'</td>';
																			} else{ 
																				var gestion_mostrar_url = '<td><a href="/'+result_1.etiqueta+'/@'+result_1.nombre_steem+'/'+result_1.url+'" target="_blank">'+result_1.url+'<a></td>';
																			};


																			var color_bar_progress = "";
																				/*switch(){

																			}				        	  	
																			progress-bar-success
																			bg-light-blue
																			progress-bar-yellow
																			progress-bar-danger
																				*/
																				// falta etiqueta
																				///uneeverso/@blickyer/uneeverso-lanzamiento-oficial-0-5-automatizador-bot-integrado-al-back-end-del-front-end
																			$('#lista_detencion_personal').append('<tr>'+
																				gestion_mostrar_url+
																				/*'<td >'+
																					'<div class="progress xs progress-striped active">'+
																						'<div class="progress-bar '+color_bar_progress+'" style="width: 80%">'+
																						'</div>'+		
																					'</div>'+
																				'</td>'+*/
																				'<td>'+
																					'<center>'+
																						'<span class="badge " ><b data-toggle="tooltip" title="Fecha en que fue enviada para upvotes">'+result_1.fecha_registro+'</b></span>'+
																					'</center>'+
																				'</td>'+
																			'<tr>');
																		});
																	}else{
																		animaciones_g.listaLoad('lista_detencion_personal',2,'desactivar');
																	};
																}else{
																	animaciones_g.listaLoad('lista_detencion_personal',2,'desactivar');
																};
																perfil_automatizacion.mostrar_consumo_barra();
					        },
					    	error:  function(error) {
								console.log(JSON.stringify(error));
								animaciones_g.listaLoad('lista_detencion_personal',2,'desactivar');
						    }	 
						});

				}else{
					alerta.error("Congestión de red, actualice la pagina");
					animaciones_g.listaLoad('lista_detencion_personal',2,'desactivar');
				};
			});
	}
	var validar_url_post = function (url_) {
		// validar seria comprobar si es o no es una url de una post
		var exreg_post = /(ftp|http|https):\/\/[a-z-. 0-9]+.+[a-z-. 0-9-.]{2,10}\/+[a-z-. 0-9-.]+\/@+[a-z-. 0-9-.]+\/[A-Z-. a-z-. 0-9-.]+/g;
		var url_new_ = url_.replace(exreg_post,'');
		return (url_new_=="")? true : false;  
	}
	var validar_url_comentario = function (url_) {
		// validar seria comprobar si es o no es una url de un comentario
		var exreg_comentario = /(ftp|http|https):\/\/[a-z-. 0-9]+.+[a-z-. 0-9-.]{2,10}\/+[a-z-. 0-9-.]+\/@+[a-z-. 0-9-.]+\/[A-Z-. a-z-. 0-9-.]+[#]+[@]+[a-z-.A-Z-.0-9-.]+\/[A-Z-. a-z-. 0-9-.]+/g;		
		var url_new_ = url_.replace(exreg_comentario,'');
		return (url_new_=="")? true : false; 
	}
	var limpiar_url = function (url_) {

		var usuario_url_ = url_;
		var etiqueta_url_ = url_;
		// Para post
		var exreg_post_url = /(ftp|http|https):\/\/[a-z-.0-9]+.+[a-z-.0-9-.]{2,10}\/+[a-z-.0-9-.]+\/@+[a-z-.0-9-.]+\//g;
		//--------
		// Para comentarios
		//var exreg_comentario_url = /(ftp|http|https):\/\/[a-z-. 0-9-.]+.+[a-z-. 0-9-.]{2,10}\/+[a-z-. 0-9]+\/@+[a-z-. 0-9-.]+\/[A-Z-. a-z-. 0-9-.]+[#]+[@]+[a-z-.A-Z-.0-9-.]+\//g;
		//--------

		if (!perfil_automatizacion.validar_url_comentario(url_)) {
			if (!perfil_automatizacion.validar_url_post(url_)) {
				return false;
			}else{
				url_ = url_.replace(exreg_post_url,'');
				usuario_url_ = usuario_url_.match(/@+[a-z-.0-9-.]+/g);
				usuario_url_ = usuario_url_[0].replace(/@/g,'');
				etiqueta_url_ = etiqueta_url_.match(/(ftp|http|https):\/\/[a-z-.0-9]+.+[a-z-.0-9-.]{2,10}\/+[a-z-.0-9-.]+\/@+[a-z-.0-9-.]+\//g);
				etiqueta_url_ = etiqueta_url_[0].replace(/(ftp|http|https):\/\/[a-z-. 0-9]+[a-z-. 0-9-.]\//g,'');
				etiqueta_url_ = etiqueta_url_.replace(/\//g,'');
				etiqueta_url_ = etiqueta_url_.replace(/@+[a-z-._0-9-.]+/g,'');
			}			
		}else{
			/*url_ = url_.replace(exreg_comentario_url,'');
			usuario_url_ = usuario_url_.match(/#@+[a-z-.0-9-.]+/g);
			usuario_url_ = usuario_url_[0].replace(/#@/g,'');*/
			return false;
		}
		return {  
			url : url_,
			usuario_url : usuario_url_,
			etiqueta_url : etiqueta_url_,
		};
	}
	var animaciones = function () {

			$('#url_post_comm').on('keyup',function (argument) {
				$('#send_url_btn').attr('disabled', false);
			});
			$('.menu_perfil .menu-item-active').removeClass('menu-item-active').addClass('menu-item');
			$('#menu_url_7').removeClass('menu-item').addClass('menu-item-active');
			$('#menu_url_7').html('<b>Automatización</b>')

			var usuario = sesion.url_extrar_usuario('perfil');
			$('#menu_2_url_1').attr('href', '/@'+usuario+'/configuracion');
			$('#menu_2_url_2').attr('href', 'javascript:;');
			//
			sesion.datos_sesion(function (argument) {
				validar_auto(argument);
			});
	}
	var validar_auto = function (result_datos_sesion) {
			if (sesion.url_extrar_usuario('perfil')==result_datos_sesion.nombre_steem) {
				$('.content').show();
				if ($('#box_autorizacion').length>0) {
					if (result_datos_sesion.wif_sin_migrar=="") {
						$('#btn-migrar_autorizacion_steem_uneeverso').hide();							
					}else{
						$('#btn-migrar_autorizacion_steem_uneeverso').show();
					};
				};
				animaciones_g.botonLoadText('btn-verificar_autorizacion','Verificar autorización','desactivar','');
				animaciones_g.botonLoadText('btn-q_verificar_autorizacion','Verificar autorización','desactivar','');
				if(result_datos_sesion.auto_upvotes>0){
					autorizacion_steem.verificar_steem(result_datos_sesion.nombre_steem, function (result_v_steem) {
						if (result_v_steem) {
							$('#compose-modal_autoridad').modal('hide');
							if ($('#box_autorizacion').length>0) {
								if (result_datos_sesion.wif_sin_migrar=="") {
									$('#btn-autorizacion_steem_uneeverso').hide();
									if ($('#btn-q_autorizacion_steem_uneeverso').is(":visible")) {
										alerta.error("Disculpe, aun no ha revocado la autorización.");
									}else{
										$('#btn-q_autorizacion_steem_uneeverso').show();	
										$('#btn-q_verificar_autorizacion').show();	
									};
								};
							};
							$('.mensaje_ac_desac').text('')
							$('.mensaje_ac_desac').text('Desactivar')
							$('#activar_desactivar_btn').attr('onclick', 'perfil_automatizacion.activar_modal_desactivar()')
							//$("#activar_desactivar_lab div").attr('aria-checked',true);
							//$("#activar_desactivar_lab div").addClass('checked');
							//$("#activar_desactivar").attr('checked',true);
							//$('#wif_privado_publicacion').val(result_datos_sesion.wif_post_priv_steem);
							$('#wif_privado_publicacion').data('validard',result_datos_sesion.wif_post_priv_steem);
							$('#limite_votos_dia').val(result_datos_sesion.limite_votos_dia);
							$('#cant_steem_power_auto').val(result_datos_sesion.cant_steem_power_auto);
							$('#avisos_bot').show();
							$('#envio_url').show();
							$('#box_configuracion').show();
							$('#lista_espera').show();
							$('#lista_votos').show();
							$('#lista_detenidos').hide();
							if($('#lista_espera').length>0){
								perfil_automatizacion.cargar_lista_espera_personal();
							}
							if ($('#lista_votos').length>0){
								// si el descanso de bots esta activo se activa por aca, debido a que la cargar_lista_espera_personal, no sera cargarda  
								perfil_automatizacion.cargar_lista_votos_personal();
							}
						}else{
							if ($('#box_autorizacion').length>0) {
								if (result_datos_sesion.wif_sin_migrar=="") {
									$('#btn-autorizacion_steem_uneeverso').show();
									if ($('#btn-q_autorizacion_steem_uneeverso').is(":visible")) {
										alerta.error("Ha sido revocada la autorización.");
										$('#btn-q_autorizacion_steem_uneeverso').hide();
										$('#btn-q_verificar_autorizacion').hide();	
									}else{
	
									};
									if ($('#btn-autorizacion_steem_uneeverso').is(":visible")){
										alerta.error("Disculpe, aun no ha autorizado a UNEEVERSO.");
									};
								};
							};
							if ($('#lista_votos').length>0) {
								$('.content').hide();
								$('#compose-modal_autoridad').modal('show')
							};
							if ($('#btn-autorizacion_steem_uneeverso').is(":visible")==false){
								alerta.error("Disculpe, aun no ha autorizado a UNEEVERSO.");
							};							
							animaciones_g.botonLoadText('btn-verificar_autorizacion','Verificar autorización','desactivar','');
							animaciones_g.botonLoadText('btn-q_verificar_autorizacion','Verificar autorización','desactivar','');
						};
					})

				}else{
					$('.mensaje_ac_desac').text('')
					$('.mensaje_ac_desac').text('Activar')
					$('#activar_desactivar_btn').attr('onclick', 'perfil_automatizacion.activar_modal_activar()')					
					//$("#activar_desactivar_lab div").attr('aria-checked',false);
					//$("#activar_desactivar_lab div").removeClass('checked');
					//$("#activar_desactivar").attr('checked',false);
					$('#avisos_bot').hide();
					$('#envio_url').hide();
					$('#box_configuracion').hide();
					$('#lista_espera').hide();
					$('#lista_votos').hide();
					$('#lista_detenidos').show();
					$('#panel_estdo_automatizacion #activar_desactivar_btn').attr('onclick', 'perfil_automatizacion.activar_modal_activar()');
					perfil_automatizacion.cargar_lista_detenidos_personal();
					//console.log("tu automatizacion esta desactivada");
				};
			}else{
				//console.log("es de otro usuario");
				$('.content').hide();
			};
		
	}

	//seccion de muestra de consumo de votos al  dia.

	var mostrar_consumo_barra = function () {
		$('.ctrl_barra_votos').css('display', 'block')
		sesion.datos_sesion(function (datos_token) {
				var usuario_steem_ = datos_token.nombre_steem;
				if (datos_token!=false) {
					    $.ajax({
							url: 'https://api.steemjs.com/get_account_votes',
							type:'GET',	
							data:{	
									voter:usuario_steem_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {
					        	//console.log(JSON.stringify(resultado));
					        	//console.log(resultado);
					        	var contador_votos_dia = 0;
					        	for (var i = 0; i < resultado.length; i++) {
					        		if (moment().tz("America/Bogota").format('YYYY-MM-DD')==resultado[i].time.toString().substring(0,10)) {
					        			contador_votos_dia++;
					        			//console.log(resultado[i].time.toString().substring(0,10)+"--"+resultado[i].percent);
					        		};
					        		if ((i+1)==resultado.length){
					        			$('.votos_r_dia_usuario').text(contador_votos_dia)
					        			//console.log("final")
					        			$('#barra_votos .progress-bar').removeClass('active');
					        			$('#barra_votos .progress-bar').removeClass('progress-bar-striped');
					        		};
					        	};


					        },
					    	error:  function(error) {
								console.log(JSON.stringify(error));
						    }	 
						});
				}
		});
	}
	var activar_modal_detalles_consumo_vp = function () {
			$('#open_detalles_consumo_vp').click();
			perfil_automatizacion.mostrar_grafico_consumo_votos()
	}
	var mostrar_grafico_consumo_votos = function () {
		$('#grafico_votos_consumidos').hide();
		$('#gdatos_votos_consumidos').hide();		
		$('#datos_calculados_pv').hide();
		$("#btn-mas-informacion-pv").hide()		
		$('#barra_pv_dia').hide();

		$('#img_carga_grafico_votos').show();
		sesion.datos_sesion(function (datos_token) {
				var usuario_steem_ = datos_token.nombre_steem;
				if (datos_token!=false) {
					    $.ajax({
							url: 'https://api.steemjs.com/get_account_votes',
							type:'GET',	
							data:{	
									voter:usuario_steem_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {
					        	$('#fecha_horario_votos_STEEM').text(moment().tz("America/Bogota").format('YYYY-MM-DD hh:mm A'))
					        	//console.log(JSON.stringify(resultado));
					        	//console.log(resultado);
					        	var limite_consumir_diariamente = 2000;// poder de voto sumando cada voto consumido o por consumir
					        	var pv_consumido_dia = 0;
					        	var pv_consumir_dia = 0;
					        	var pv_total_consumido_dia = 0;
					        	var pv_total_consumir_dia = 0;					        	
					        	var recupera_pv_hora = 0.83;

					        	var contador_votos_dia = 0; 
					        	var array_votos_dia = [];
					        	var agrupando_resultado;
					        	var array_grafico = [];
					        	array_grafico.push(['','Votos realizados'])
					        	// Extraendo los votos realizados en el dia
					        	for (var i = 0; i < resultado.length; i++) {
					        		if (moment().tz("America/Bogota").format('YYYY-MM-DD')==resultado[i].time.toString().substring(0,10)) {
					        			contador_votos_dia++;
					        			//console.log(resultado[i].time.toString().substring(0,10)+"--"+resultado[i].percent);
					        			//console.log(resultado[i])
					        			//console.log(contador_votos_dia)
					        			array_votos_dia.push(resultado[i])
					        		};
					        		if ((i+1)==resultado.length){
					        			$('.votos_r_dia_usuario').text(contador_votos_dia)
					        			//console.log("fin")
					        			//console.log(array_votos_dia)
					        			// AGRUPANDO LOS VOTOS DEL DIA SEGUN EL PORCENTAJE
					        			agrupando_resultado = _.groupBy(array_votos_dia, 'percent')
					        			//console.log(agrupando_resultado)
					        			// ORDENANDO ARRAY PARA EL GRAFICO
					        			for (var u = 0; u < 101; u++) {
					        				//console.log(u)
					        				//console.log((u+1))
					        				//console.log(agrupando_resultado[(u*100)])
																	if (agrupando_resultado[(u*100)] || agrupando_resultado[10000]==undefined) {
																		//SUMANDO PODER DE VOTO POR CADA VOTO CONSUMIDO
																		if (agrupando_resultado[(u*100)]) {
																			pv_consumido_dia = pv_consumido_dia+(u*agrupando_resultado[(u*100)].length);

																			array_grafico.push([u.toString()+'% Poder de voto', agrupando_resultado[(u*100)].length])
																		};
																			
																		//if (agrupando_resultado[(u*100)].length>0 || agrupando_resultado[10000]==undefined ) {
																			//console.log(u)
																			//console.log((u+1))
																			//console.log((u*100))
																			//console.log(agrupando_resultado[(u*100)])
																			
													 					if ((u+1)==101) {
													 						//console.log("Fin 2")
													 						// SUMA DE PODER DE VOTO CONSUMIDO MENOS EL LIMITE A CONSUMIR POR DIA, DERA LO QUE SE OBTENDRA DE LO QUE FALTA POR CONSUMIR.
													 						pv_consumir_dia = limite_consumir_diariamente-pv_consumido_dia;
											        	/* INICIANDO CREACION DEL GRAFICO*/													 						
																				google.charts.load('current', {'packages':['corechart', 'bar']});
														      google.charts.setOnLoadCallback(drawStuff);

														      function drawStuff() {

														        var chartDiv = document.getElementById('grafico_votos_consumidos');

														        var data = google.visualization.arrayToDataTable(array_grafico);

														        var materialOptions = {
														          width: '100%',
														          bar: {groupWidth: "100%"},          
														          /*chart: {
														            title: 'Votos realizados en el dia',
														            subtitle: 'distance on the left, brightness on the right'
														          },*/
														          legend: { position: "none" },
														        };
														        var materialChart = new google.charts.Bar(chartDiv);
														        materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
														     	};
											        	/* FINALIZANDO CREACION DEL GRAFICO*/
											        	//-
											        	$('.suma_pv_v_consumido').text(pv_consumido_dia);
											        	$('.suma_pv_v_consumir').text(pv_consumir_dia);
											        	$('.limite_pv_consumir_dia').text(limite_consumir_diariamente);											        	
											        	//-
																				var horas_pasadas_dia  = parseInt(moment().tz("America/Bogota").startOf('day').fromNow());
																				var horas_restantes_dia = parseInt(moment().tz("America/Bogota").endOf('day').fromNow().toString().substring(2,5));
																				pv_total_consumido_dia = (horas_pasadas_dia)?recupera_pv_hora*horas_pasadas_dia:0;
																				pv_total_consumir_dia = (horas_restantes_dia)?recupera_pv_hora*horas_restantes_dia:0;
																				//console.log(pv_total_consumido_dia,pv_total_consumir_dia)
																				$('.width-poder-voto_ventana').css('width', (pv_total_consumido_dia*100/20)+'%')

																				$('.barra_pv_dia_cantidad_recuperado').text(pv_total_consumido_dia.toString().substring(0,5)+'% PVT recuperado')
																				$('.barra_pv_dia_cantidad_recuperar').text(pv_total_consumir_dia.toString().substring(0,5)+'% PVT por recuperar')
											        	//-
											        	$('#img_carga_grafico_votos').hide();
											        	$('#grafico_votos_consumidos').show();
									        			$('#gdatos_votos_consumidos').show();
									        			$("#btn-mas-informacion-pv").show()
									        			$('#barra_pv_dia').show();
													 					};
																		//};
																	};
																};
																// FIN DEL ORDENANDO ARRAY PARA EL GRAFICO
					        		};
					        	};


					        },
					    	error:  function(error) {
								console.log(JSON.stringify(error));
						    }	 
						});
				}
		});
	}

	return{
		Iniciar: function () {
			if( $('#automatizacion_voto').length>0 ) {
				perfil_automatizacion.animaciones();
			};
		},
		animaciones:animaciones,
		validar_auto : validar_auto,
		validar_url_post : validar_url_post,
		validar_url_comentario : validar_url_comentario,
		limpiar_url : limpiar_url,
		activar_desactivar : activar_desactivar,
		activar_modal_activar : activar_modal_activar,
		activar_modal_desactivar : activar_modal_desactivar,
		activar_desactivado_automatizacion : activar_desactivado_automatizacion,
		guardar_url : guardar_url,
		verificar_votos : verificar_votos,
		cargar_lista_espera_personal : cargar_lista_espera_personal,
		cargar_lista_votos_personal : cargar_lista_votos_personal,
		cargar_lista_detenidos_personal : cargar_lista_detenidos_personal,
		mostrar_consumo_barra : mostrar_consumo_barra,
		activar_modal_detalles_consumo_vp : activar_modal_detalles_consumo_vp,
		mostrar_grafico_consumo_votos : mostrar_grafico_consumo_votos,
	}
}();
perfil_automatizacion.Iniciar();


