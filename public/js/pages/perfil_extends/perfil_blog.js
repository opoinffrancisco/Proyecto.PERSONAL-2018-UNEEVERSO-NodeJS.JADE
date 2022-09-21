var perfil_blog = function () {




	var control_salto_pag = 4;
	var busqueda_novedad_scroll_activacion = false;
	var tiempo_resolicitar = 1;
	var ultimo_post_agregado_list = "";

	var iniciar_paginacion_index = function () {
			//obtenemos la altura del documento		 
			$(window).scroll(function(){
				var altura = $(document).height();
				if($(window).scrollTop() + $(window).height() == altura) {
						if (busqueda_novedad_scroll_activacion==false) {
				 			busqueda_novedad_scroll_activacion=true;
					 		$.ajax({
								url:'https://api.steemjs.com/get_discussions_by_author_before_date',
								type:'GET',	
								data:{	
									author:sesion.url_extrar_usuario('perfil'),
									startPermlink:ultimo_post_agregado_list,
									beforeDate:new Date().toISOString().split('.')[0],
									limit:10,
								},
								beforeSend: function () {
									$('#img_loag_catalogo_cont').show()
								},
								success:  function (resultado) {   
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
									$('#img_loag_catalogo_cont').hide()
									//console.log(resultado)
									for (var i = 1; i < resultado.length; i++) {
										//console.log(resultado[i])
										//console.log(resultado[i].active_votes) 

										var datos_usuario = JSON.parse(resultado[i].json_metadata);
										var publicacion_compartida_ti = "";
										if (resultado[i].author!=sesion.url_extrar_usuario('perfil')) {
											publicacion_compartida_ti = /*'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
																		'<div class="col-md-6 col-md-offset-6" style="text-align:  right;padding:0px;font-size:  11px;">'+*/
																			'<i class="glyphicon glyphicon-retweet btn_upvoto" style="display: inline;background:  white;color:  #ccc;border-color:  #ccc;cursor:  auto;"></i>'+
																			'<span style="color:  #ccc;"> Compartida </span>'
																		/*'</div>'+
																	'</div>'*/;
										};
										var imagen_portada = "/img/2000px-Sin_foto.svg.png";
										//console.log(datos_usuario.image)
										if (datos_usuario.image) {
											//console.log(datos_usuario.image[0])
											if (datos_usuario.image[0]) {
												imagen_portada = 'https://steemitimages.com/200x130/'+datos_usuario.image[0];
											};
										}else{
											var regex_img_body = /(https|http)+[0-9a-zA-Z :.!"#$%&()=?¡\/]+(jpg|png|gif)/g
											var array_emparejamientos = resultado[i].body.toString().match(regex_img_body);
											if (array_emparejamientos) {
												imagen_portada = 'https://steemitimages.com/200x130/'+array_emparejamientos[0];
											};// Si no obtuvo ninguno, es porque la publicacion no posee alguna imagen en el contenido/portada
										};
										var ganancias_post ="";
										if(resultado[i].pending_payout_value.toString().substring(0,5)!='0.000'){
											ganancias_post = 	'<div id="" style="float: left;margin-left: 10px;margin-right:  10px;" class="dropdown">'+
																	'<button type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class=" opciones_post_sbd dropdown-toggle" style="border:  0px;background:  white;height: 17px;padding:  0px;margin-top:  -6px;">'+
																		//'<i class="fa fa-dollar"></i>'+
																		'<a onclick="" class="op_payout_value enlace_griss">'+
																			'<span>$'+resultado[i].pending_payout_value.toString().substring(0,5)+'</span>'+
																		'</a>'+
																		'<i style="margin-left:3px;" class="fa fa-caret-down"></i>'+
																	'</button>'+
																	'<ul aria-labelledby="dropdownMenu1" style="text-align:  center;" class="dropdown-menu">'+
																		'<li>'+
																			'<span>Pago pendiente : $	</span><span class="pago_post">'+resultado[i].pending_payout_value.toString().substring(0,5)+'</span>'+
																		'</li>'+
																		'<li>'+
																			'<hr style="margin: 2px;">'+
																		'</li>'+
																		'<li>'+
																			'<span>Monedero : $	</span><span class="pago_post_50">'+(resultado[i].pending_payout_value.toString().substring(0,5)*50/100).toString().substring(0,5)+'</span>'+
																		'</li>'+
																		'<li>'+
																			'<span>SP : $</span><span class="pago_post_20">'+(resultado[i].pending_payout_value.toString().substring(0,5)*20/100).toString().substring(0,5)+'</span>'+
																		'</li>'+
																		'<li>'+
																			'<span>Curadores : $	</span><span class="pago_post_30">'+(resultado[i].pending_payout_value.toString().substring(0,5)*30/100).toString().substring(0,5)+'</span>'+
																		'</li>'+
																		'<li>'+
																			'<hr style="margin: 2px;">'+
																		'</li>'+
																		'<li>'+
																			'<span>dentro de </span><span class="fecha_pago_post">'+datos.tiempo_pago_publicacion(resultado[i].cashout_time)+'</span>'+
																		'</li>'+
																		'<li>'+
																			'<hr style="margin: 2px;">'+
																		'</li>'+
																		'<li>'+
																			'<center>'+
																				'<button onclick="votos.cargar_votos_post(this)" data-url_publicacion="'+resultado[i].permlink+'" data-usuario_steem="'+resultado[i].author+'" data-toggle="modal" data-target="#compose-modal_votos" data-toggle="tooltip" title="Votantes de la ronda" style="padding:  3px;width:  91%;" class="btn bg-blanco btn-sm">Ver origen</button>'+
																			'</center>'+
																		'</li>'+																		
																	'</ul>'+
																'</div>';
										}
										$('#catalogo_cont').append(
											'<div class="box" style="margin-bottom:5px; padding:10px;">'+
														
												'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
													'<div class="col-md-8" style="padding:0px;">'+
														'<img src="https://steemitimages.com/25x25/https://steemitimages.com/u/'+resultado[i].author+'/avatar" style="padding:0px;margin-right:  5px;"/>'+
														'<b>'+
															'<a class="do_nombre_autor"  href="/@'+resultado[i].author+'">'+resultado[i].author+'</a>'+
														'</b>'+
														'<span style="color: #b4b6b8;"> en </span>'+
														'<a class="do_nombre_autor"  style="" href="/trending/'+resultado[i].category+'" target="_blank">'+resultado[i].category+'</a>'+
														'<span style="color: #b4b6b8;">  el dia -  </span>'+
														'<span style="color: #b4b6b8;">'+
															moment(resultado[i].created).format('YYYY/MM/DD HH:mm')+
														'</span>'+
													'</div>'+
													'<div class="col-md-4" style="padding:0px;text-align:  right;">'+
														publicacion_compartida_ti+
													'</div>'+
												'</div>'+
												'<div class="row" style="margin:0px;">'+
													'<div class="col-md-3" style="/*width:130px;*/padding:  0px;height: 100%;">'+
														'<center>'+
															'<a href="'+resultado[i].url+'" style="font-size: medium;color: #acadb1;">'+
																'<img src="'+imagen_portada+'" style="width:130px;padding:1px;height:77px;"/>'+
															'</a>'+
														'</center>'+
													'</div>'+
													'<div class="col-md-9">'+
														'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
															'<div class="col-md-12" style="padding:0px;">'+
																'<b>'+										
																	'<a href="'+resultado[i].url+'" style="font-size: medium;color: #acadb1;">'+
																		resultado[i].title+
																	'</a>'+
																'</b>'+
															'</div>'+
														'</div>'+
														'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
															'<div class="col-md-12" style="padding:0px;">'+
																
																'<div class="row" style="margin:0px;border: 1px solid #acadb15e;border-radius: 17px;">'+				
																	'<div class="col-md-6" style="padding: 5px;border-radius: 17px;">'+
																		'<div id="cont_btn_voto'+resultado[i].permlink+'" class="">'+
																			'<i onclick="perfil_blog.upvote(&#39;'+resultado[i].author+'&#39;,&#39;'+resultado[i].permlink+'&#39;) " class="fa fa-chevron-up btn_upvoto" style="float:  left;display: inline;margin-top: 1px;"></i>'+
																			'<span onclick="votos.cargar_votos_post(this)" data-url_publicacion="'+resultado[i].permlink+'" data-usuario_steem="'+resultado[i].author+'" data-toggle="modal" data-target="#compose-modal_votos" data-toggle="tooltip" title="Votantes de la publicación"  id="votos_post'+resultado[i].permlink+'" style="float:  left;">'+resultado[i].net_votes+'</span>'+
																		'</div>'+
																		ganancias_post+
																	'</div>'+
																	'<div class="col-md-6" style="padding: 5px;border-radius: 17px;">'+
																		'<a href="'+resultado[i].url+'/responder" style="font-size: medium;color: #acadb1;">'+
																			'<i class="fa fa-comments btn_upvoto" style="display: inline;margin-top: 1px;"></i>'+
																		'</a>'+
																		'<span>'+resultado[i].children+'</span>'+
																	'</div>'+
																	/*'<div class="col-md-4" style="padding: 5px;border-radius: 17px;">'+
																		'<i class="glyphicon glyphicon-retweet btn_upvoto" style="display: inline;margin-top: 1px;"></i>'+
																	'</div>'+*/
																'</div>'+

															'</div>'+
														'</div>'+

													'</div>'+
												'</div>'+								
											'</div>');
										
										perfil_blog.extraer_votos(resultado[i].active_votes,'cont_btn_voto'+resultado[i].permlink,resultado[i].author,resultado[i].permlink)
											
										
										if ((i+1)==resultado.length) {
											ultimo_post_agregado_list = resultado[i].permlink;
										};
									};					
								},
								error:  function(error) {
									console.log(JSON.stringify(error));
									$('#img_loag_catalogo_cont').hide()
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
								}	 
							});
						};
			      }
			                
			});	 
	}
	var cargar_catalogo_content = function () {
		$.ajax({
				asyn: true,
				url: 'https://api.steemjs.com/get_discussions_by_blog',
				type:'GET',	
				data:{	
						query:{
							tag:sesion.url_extrar_usuario('perfil'),
							limit:10,
						}
				},
				beforeSend: function () {

				},
				success:  function (resultado) {
					//console.log(JSON.stringify(resultado));
					//console.log(resultado);
					$('#img_loag_catalogo_cont').hide()
					$('#catalogo_cont').show()
					for (var i = 0; i < resultado.length; i++) {
						//console.log(resultado[i])
						//console.log(resultado[i].active_votes) 

						/*for (var i = 0; i < resultado[i].active_votes.length; i++) {
							//console.log(resultado[i].active_votes[i].voter)
							if (resultado[i].active_votes[i].voter==localStorage.getItem('nombre_steem')) {
								//console.log(resultado[i].active_votes[i])
								publicacion_upvote = '<i class="fa fa-chevron-up btn_downvoto" style="float:  left;display: inline;margin-top: 1px;"></i>';
							};


						};*/
						var datos_usuario = JSON.parse(resultado[i].json_metadata);
						var publicacion_compartida_ti = "";
						if (resultado[i].author!=sesion.url_extrar_usuario('perfil')) {
							publicacion_compartida_ti = /*'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
														'<div class="col-md-6 col-md-offset-6" style="text-align:  right;padding:0px;font-size:  11px;">'+*/
															'<i class="glyphicon glyphicon-retweet btn_upvoto" style="display: inline;background:  white;color:  #ccc;border-color:  #ccc;cursor:  auto;"></i>'+
															'<span style="color:  #ccc;"> Compartida </span>'
														/*'</div>'+
													'</div>'*/;
						};
						var imagen_portada = "/img/2000px-Sin_foto.svg.png";
						//console.log(datos_usuario.image)
						if (datos_usuario.image) {
							//console.log(datos_usuario.image[0])
							if (datos_usuario.image[0]) {
								imagen_portada = 'https://steemitimages.com/200x130/'+datos_usuario.image[0];
							};
						}else{
							var regex_img_body = /(https|http)+[0-9a-zA-Z :.!"#$%&()=?¡\/]+(jpg|png|gif)/g
							var array_emparejamientos = resultado[i].body.toString().match(regex_img_body);
							if (array_emparejamientos) {
								imagen_portada = 'https://steemitimages.com/200x130/'+array_emparejamientos[0];
							};// Si no obtuvo ninguno, es porque la publicacion no posee alguna imagen en el contenido/portada
						};
						var ganancias_post ="";
						if(resultado[i].pending_payout_value.toString().substring(0,5)!='0.000'){
							ganancias_post = 	'<div id="" style="float: left;margin-left: 10px;margin-right:  10px;" class="dropdown">'+
													'<button type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class=" opciones_post_sbd dropdown-toggle" style="border:  0px;background:  white;height: 17px;padding:  0px;margin-top:  -6px;">'+
														//'<i class="fa fa-dollar"></i>'+
														'<a onclick="" class="op_payout_value enlace_griss">'+
															'<span>$'+resultado[i].pending_payout_value.toString().substring(0,5)+'</span>'+
														'</a>'+
														'<i style="margin-left:3px;" class="fa fa-caret-down"></i>'+
													'</button>'+
													'<ul aria-labelledby="dropdownMenu1" style="text-align:  center;" class="dropdown-menu">'+
														'<li>'+
															'<span>Pago pendiente : $	</span><span class="pago_post">'+resultado[i].pending_payout_value.toString().substring(0,5)+'</span>'+
														'</li>'+
														'<li>'+
															'<hr style="margin: 2px;">'+
														'</li>'+
														'<li>'+
															'<span>Monedero : $	</span><span class="pago_post_50">'+(resultado[i].pending_payout_value.toString().substring(0,5)*50/100).toString().substring(0,5)+'</span>'+
														'</li>'+
														'<li>'+
															'<span>SP : $</span><span class="pago_post_20">'+(resultado[i].pending_payout_value.toString().substring(0,5)*20/100).toString().substring(0,5)+'</span>'+
														'</li>'+
														'<li>'+
															'<span>Curadores : $	</span><span class="pago_post_30">'+(resultado[i].pending_payout_value.toString().substring(0,5)*30/100).toString().substring(0,5)+'</span>'+
														'</li>'+
														'<li>'+
															'<hr style="margin: 2px;">'+
														'</li>'+
														'<li>'+
															'<span>dentro de </span><span class="fecha_pago_post">'+datos.tiempo_pago_publicacion(resultado[i].cashout_time)+'</span>'+
														'</li>'+
														'<li>'+
															'<hr style="margin: 2px;">'+
														'</li>'+
														'<li>'+
															'<center>'+
																'<button onclick="votos.cargar_votos_post(this)" data-url_publicacion="'+resultado[i].permlink+'" data-usuario_steem="'+resultado[i].author+'" data-toggle="modal" data-target="#compose-modal_votos" data-toggle="tooltip" title="Votantes de la ronda" style="padding:  3px;width:  91%;" class="btn bg-blanco btn-sm">Ver origen</button>'+
															'</center>'+
														'</li>'+
													'</ul>'+
												'</div>';
						}
						$('#catalogo_cont').append(
							'<div class="box" style="margin-bottom:5px; padding:10px;">'+
										
								'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
									'<div class="col-md-8" style="padding:0px;">'+
										'<img src="https://steemitimages.com/25x25/https://steemitimages.com/u/'+resultado[i].author+'/avatar" style="padding:0px;margin-right:  5px;"/>'+
										'<b>'+
											'<a class="do_nombre_autor"  href="/@'+resultado[i].author+'">'+resultado[i].author+'</a>'+
										'</b>'+
										'<span style="color: #b4b6b8;"> en </span>'+
										'<a class="do_nombre_autor"  style="" href="/trending/'+resultado[i].category+'" target="_blank">'+resultado[i].category+'</a>'+
										'<span style="color: #b4b6b8;">  el dia -  </span>'+
										'<span style="color: #b4b6b8;">'+
											moment(resultado[i].created).format('YYYY/MM/DD HH:mm')+
										'</span>'+
									'</div>'+
									'<div class="col-md-4" style="padding:0px;text-align:  right;">'+
										publicacion_compartida_ti+
									'</div>'+
								'</div>'+
								'<div class="row" style="margin:0px;">'+
									'<div class="col-md-3" style="/*width:130px;*/padding:  0px;height: 100%;">'+
										'<center>'+
											'<a href="'+resultado[i].url+'" style="font-size: medium;color: #acadb1;">'+
												'<img src="'+imagen_portada+'" style="width:130px;padding:1px;height:77px;"/>'+
											'</a>'+
										'</center>'+
									'</div>'+
									'<div class="col-md-9">'+
										'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
											'<div class="col-md-12" style="padding:0px;">'+
												'<b>'+										
													'<a href="'+resultado[i].url+'" style="font-size: medium;color: #acadb1;">'+
														resultado[i].title+
													'</a>'+
												'</b>'+
											'</div>'+
										'</div>'+
										'<div class="row" style="margin:0px;padding-bottom:  5px;">'+				
											'<div class="col-md-12" style="padding:0px;">'+
												
												'<div class="row" style="margin:0px;border: 1px solid #acadb15e;border-radius: 17px;">'+				
													'<div class="col-md-6" style="padding: 5px;border-radius: 17px;">'+
														'<div id="cont_btn_voto'+resultado[i].permlink+'" class="">'+
															'<i onclick="perfil_blog.upvote(&#39;'+resultado[i].author+'&#39;,&#39;'+resultado[i].permlink+'&#39;) " class="fa fa-chevron-up btn_upvoto" style="float:  left;display: inline;margin-top: 1px;"></i>'+
															'<span  onclick="votos.cargar_votos_post(this)" data-url_publicacion="'+resultado[i].permlink+'" data-usuario_steem="'+resultado[i].author+'" data-toggle="modal" data-target="#compose-modal_votos" data-toggle="tooltip" title="Votantes de la publicación"  id="votos_post'+resultado[i].permlink+'" style="float:  left;">'+resultado[i].net_votes+'</span>'+
														'</div>'+
														ganancias_post+
													'</div>'+
													'<div class="col-md-6" style="padding: 5px;border-radius: 17px;">'+
														'<a href="'+resultado[i].url+'/responder" style="font-size: medium;color: #acadb1;">'+
															'<i class="fa fa-comments btn_upvoto" style="display: inline;margin-top: 1px;"></i>'+
														'</a>'+
														'<span>'+resultado[i].children+'</span>'+
													'</div>'+
													/*'<div class="col-md-4" style="padding: 5px;border-radius: 17px;">'+
														'<i class="glyphicon glyphicon-retweet btn_upvoto" style="display: inline;margin-top: 1px;"></i>'+
													'</div>'+*/
												'</div>'+

											'</div>'+
										'</div>'+

									'</div>'+
								'</div>'+								
							'</div>');
						
						perfil_blog.extraer_votos(resultado[i].active_votes,'cont_btn_voto'+resultado[i].permlink,resultado[i].author,resultado[i].permlink)
							
						
						if ((i+1)==resultado.length) {
							ultimo_post_agregado_list = resultado[i].permlink;
						};
					};

				},
				error:  function(error) {
					console.log(JSON.stringify(error));
					
				}	 
			});		
	}
	var extraer_votos = function (votos_, item_btn_votos_, autor_post_, permlink_) {
		
		var decto_voto = false;
		for (var i = 0; i < votos_.length; i++) {
					//console.log(resultado[i].active_votes[i].voter)
					if (votos_[i].voter==localStorage.getItem('nombre_steem') && votos_[i].percent>0) {
						//console.log(votos_[i])
						decto_voto = true;
						$('#'+item_btn_votos_+' i').remove()
						$('#'+item_btn_votos_).prepend('<i onclick="perfil_blog.downvote(&#39;'+autor_post_+'&#39;,&#39;'+permlink_+'&#39;) " class="fa fa-chevron-up btn_downvoto" style="float:  left;display: inline;margin-top: 1px;"></i>')
					};
					if((i+1)==votos_.length){
						if (decto_voto==false) {
							var votos_actuales = (parseInt($('#votos_post'+permlink_).text())==1)?"":parseInt($('#votos_post'+permlink_).text())-1;
							$('#votos_post'+permlink_).html(votos_actuales);							
						};
						$('#votos_post'+permlink_).css('display', 'block');
					}
		 };
	}
	var upvote = function (autor_,permlink_) {

		animaciones_g.botonLoad('cont_btn_voto'+permlink_,'activar');
		$('#votos_post'+permlink_).css('display', 'none')
		sesion.datos_sesion(function (result_datos_sesion) {
			sesion.rest_con_api_steem(0);
			steem.broadcast.vote(
				result_datos_sesion.wif_post_priv_steem,
				result_datos_sesion.nombre_steem,
				autor_,
				permlink_,
				//result_datos_sesion.cant_steem_power_auto,
				10000,
		   function(error, result) {
						animaciones_g.botonLoad('cont_btn_voto'+permlink_,'desactivar');
		   	if (error){
		   		console.log(error)
							alerta.error("Error al realizar el voto : "+error['data'].message+".");
							$('#votos_post'+permlink_).css('display', 'block')
		   	}else{
		   			var votos_post = ($('#votos_post'+permlink_).text()=="")?1:parseInt($('#votos_post'+permlink_).text())+1;
		   			//console.log(votos_comentario+": 	votos del comentario :"+permlink_)
								$('#votos_post'+permlink_).html(votos_post);
								$('#votos_post'+permlink_).css('display', 'block')
								$('#cont_btn_voto'+permlink_+' i').hide();
								//$('#btn_downvoto_comm'+permlink_+' i').show();								
								$('#cont_btn_voto'+permlink_).prepend('<i onclick="perfil_blog.downvote(&#39;'+autor_+'&#39;,&#39;'+permlink_+'&#39;) " class="fa fa-chevron-up btn_downvoto" style="float:  left;display: inline;margin-top: 1px;"></i>')
								//novedad.extraer_votos(autor_,permlink_,function (result_v) {});
		   	};
			});

		});
	}
	var downvote = function (autor_,permlink_) {

		alertify.confirm('Quitar voto', 'Cambiar a un voto ascendente restablecerá tus recompensas de curaduría para esta publicación. <br> Luego de retirar el voto, la reanudacion del mismo no generara ganancias.', 
			function(){ 
						$('#votos_post'+permlink_).css('display', 'none')
						animaciones_g.botonLoad('cont_btn_voto'+permlink_,'activar');
						sesion.datos_sesion(function (result_datos_sesion) {
							sesion.rest_con_api_steem(0);
							steem.broadcast.vote(
								result_datos_sesion.wif_post_priv_steem,
								result_datos_sesion.nombre_steem,
								autor_,
								permlink_,
								//result_datos_sesion.cant_steem_power_auto,
								0,
						   function(error, result) {
										animaciones_g.botonLoad('cont_btn_voto'+permlink_,'desactivar');
						   	if (error){
						   		console.log(error)
								alerta.error("Error al quitar el voto : "+error['data'].message+".");
							   	$('#votos_post'+permlink_).css('display', 'block')
						   	}else{
						   		var votos_actuales = (parseInt($('#votos_post'+permlink_).text())==1)?"":parseInt($('#votos_post'+permlink_).text())-1;
											$('#votos_post'+permlink_).html(votos_actuales);
											$('#votos_post'+permlink_).css('display', 'block')
											$('#cont_btn_voto'+permlink_+' i').hide();
											$('#cont_btn_voto'+permlink_).prepend('<i onclick="perfil_blog.upvote(&#39;'+autor_+'&#39;,&#39;'+permlink_+'&#39;) " class="fa fa-chevron-up btn_upvoto" style="float:  left;display: inline;margin-top: 1px;"></i>')
						   	};
							});
						});
						
			}, function(){ 
				
		});
	}
	var animaciones = function () {
			$('.menu_perfil .menu-item-active').removeClass('menu-item-active').addClass('menu-item');
			$('#menu_url_1').removeClass('menu-item').addClass('menu-item-active');
			$('#menu_url_1 span').html('<b>Blog</b>')
			//
			cargar_catalogo_content();
			/*
			sesion.datos_sesion(function (result) {
				
			});	*/
	}


	return{
		Iniciar: function () {
			perfil_blog.animaciones();

		},
		animaciones:animaciones,
		cargar_catalogo_content:cargar_catalogo_content,
		iniciar_paginacion_index : iniciar_paginacion_index,
		extraer_votos : extraer_votos,
		upvote : upvote,
		downvote : downvote,
	}
}();
perfil_blog.Iniciar();


