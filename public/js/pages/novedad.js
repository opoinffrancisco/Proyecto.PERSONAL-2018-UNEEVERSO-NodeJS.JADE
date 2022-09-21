var novedad = function () {
	var control_salto_pag = 4;
	var busqueda_novedad_scroll_activacion = false;
	var tiempo_resolicitar = 2;

	var iniciar_paginacion_index = function () {
			//obtenemos la altura del documento

			 
			$(window).scroll(function(){
				var altura = $(document).height();
				if($(window).scrollTop() + $(window).height() == altura) {
						if (busqueda_novedad_scroll_activacion==false) {
				 			busqueda_novedad_scroll_activacion=true;
					 		$.ajax({
								url:'/novedad/list_page',
								type:'POST',	
								data:{	
									desde:$('#contendedor_novedades > div').length+1,
									limite:control_salto_pag,
								},
								beforeSend: function () {
									$('#carga_datos').show()
								},
								success:  function (result) {   
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
									$('#carga_datos').hide()
									//console.log(result)
									for (var i = 0; i < result.datos.length; i++) {
										var datos_html_novedad = "";
											datos_html_novedad ='<div class="box box-solid" style="margin-bottom: 5px;">'+
												'<div class="box-body">'+
													'<div class="row">'+
														'<div class="col-md-12">'+
															'<a href="/@'+result.datos[i].nombre_autor+'" target="_blank" >'+
																'<b>'+result.datos[i].nombre_autor+'</b>'+
															'</a>'+
															'<span style="color: #b4b6b8;">  publicado el :</span>'+
															'<b style="color: #b4b6b8;">'+result.datos[i].fecha_registro+'</b>'+
														'</div>'+
													'</div>'+
													'<div class="row" style="padding-left: 15px;margin-top:  10px;">'+
														'<div class="col-md-3" style="width:130px;padding:  0px;height: 100%;">'+
															'<a href="/novedad/'+result.datos[i].url+'/@'+result.datos[i].nombre_autor+'" target="_blank">'+
																'<img src="'+result.datos[i].url_imagen+'" style="width:  130px;padding:  5px;height: 77px;"/>'+
															'</a>'+
														'</div>'+
														'<div class="col-md-9">'+
															'<div class="row" style="margin-top: 10px;">'+
																'<div class="col-md-12">'+
																	'<a href="/novedad/'+result.datos[i].url+'/@'+result.datos[i].nombre_autor+'" target="_blank">'+
																		'<h5>'+result.datos[i].nombre_muestra+'</h5>'+
																	'</a>'+
																'</div>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
											'</div>';
										$('#contendedor_novedades').append(datos_html_novedad)
									};					
								},
								error:  function(error) {
									console.log(JSON.stringify(error));
									$('#carga_datos').hide()
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
								}	 
							});
						};
			      }
			                
			});	 

	}


	var novedad_actual;
	var extraer_comentario = function (autor_, permlink_, callback) {
		$.ajax({
			async : true,
			url: 'https://api.steemjs.com/get_content_replies',
			type:'GET',	
			data:{	
				author:autor_,
				permlink:permlink_,
			},
			beforeSend: function () {
				$('#carga_respuestas').show()
				$('#btn-actualizar-comentarios').hide()
			},
			success:  function (result) {   
				$('#btn-actualizar-comentarios').show()
				$('#carga_respuestas').hide()
				//console.log(result);

				if (result) {
					for (var i = 0; i < result.length; i++) {

						if ($('#seccion_coment'+result[i].permlink).length==0) {
							//if (novedad.novedad_actual==result[i].parent_permlink || novedad.novedad_actual!=result[i].parent_permlink && i<=7) {
									//console.log(result[i]) 

								var conteo_comentarios = new Date().getTime();
								var conteo_nuevo_comentarios_ = new Date().getTime()+1;
								var votos = (result[i].net_votes>0)?'<span> | <span id="votos_comentario'+result[i].permlink+'" style="display:none;">'+result[i].net_votes+'</span> votos</span>':'';
								var html_btn_borrar_comentario =""
								if(result[i].children==0 && localStorage.getItem('nombre_steem')==result[i].author && result[i].net_votes==0){
									html_btn_borrar_comentario='<a class="n_borrar_comentario enlace_griss" id="n_borrar_comentario'+result[i].permlink+'" onclick="novedad.borrar_comentario(&#39;'+result[i].permlink+'&#39;)" style="display: inline;cursor: pointer;margin-left: 10px;border: 0px solid white !important;">'+
										'<span> Borrar </span>'+
									'</a>';
								}

								$('#seccion_coment'+permlink_+" .comentarios"+permlink_).append('<div id="seccion_coment'+result[i].permlink+'" class="row">'+
											'<div class="col-md-2"><center>'+
												'<img src="https://steemitimages.com/45x45/https://steemitimages.com/u/'+result[i].author+'/avatar" style="width: 45px;height: 45px;border-radius: 100%;margin-right:  0px;"/>'+
											'</center></div>'+
											'<div class="col-md-10">'+

															'<div class="row">'+
																'<b><a class="enlace_griss" href="/@'+result[i].author+'" target="_blank">'+result[i].author+'('+steem.formatter.reputation(result[i].author_reputation)+')</a></b>'+
															'</div>'+

															'<textarea data-mdhtmlform-group="'+conteo_comentarios+'" class="mdhtmlform-md" disabled="TRUE" style="display:none;" ></textarea>'+

															'<div data-mdhtmlform-group="'+conteo_comentarios+'" class="row mdhtmlform-html" ></div>'+

															'<div class="row"style="font-size: 12px;">'+

																'<a id="btn_upvoto_comm'+result[i].permlink+'"    onclick="novedad.upvote_novedad_comm(&#39;'+result[i].author+'&#39;,&#39;'+result[i].permlink+'&#39;)" style="float:left;">'+
																	'<i class="fa fa-chevron-up btn_upvoto" ></i>'+
																'</a>'+
																'<a id="btn_downvoto_comm'+result[i].permlink+'"  onclick="novedad.downvote_novedad_comm(&#39;'+result[i].author+'&#39;,&#39;'+result[i].permlink+'&#39;)" style="float:left;">'+
																	'<i class="fa fa-chevron-up btn_downvoto"  ></i>'+
																'</a>'+
																'<span> | $'+result[i].pending_payout_value.toString().substring(0,5)+'</span>'+
																//votos+

																'<div id="contenedor_datos_votos'+result[i].permlink+'" style="float: left;margin-left:  5px;margin-right:  10px;" class="dropdown ">'+
																	'<button type="button" id="dropdownMenu'+conteo_comentarios+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class="btn btn-default dropdown-toggle btn-datos-votos">'+
																		'<a onclick="" class="votos_comentario votos_comentario'+result[i].permlink+' enlace_griss"> </a>'+
																		'<i style="margin-left:3px;" class="fa fa-caret-down"></i>'+
																	'</button>'+
																	'<ul aria-labelledby="dropdownMenu'+conteo_comentarios+'" class="lista_votantes_post'+result[i].permlink+' dropdown-menu">'+
																	'</ul>'+
																'</div>'+

																'<a class="n_responder enlace_griss" onclick="$(&#39;#nuevo-comentario'+result[i].permlink+'&#39;).val(&#39;&#39;);$(&#39;.vista_previa_comentario'+result[i].permlink+'&#39;).html(&#39;&#39;);$(&#39;.new_comentario'+result[i].permlink+'&#39;).show();$(&#39;a.n_responder&#39;).hide()" style="display: inline; cursor: pointer;margin-left: 10px;">'+
																	'<span> Responder </span>'+
																'</a>'+
																html_btn_borrar_comentario+

															'</div>'+
															'<br>'+

															'<div class="row new_comentario'+result[i].permlink+'" style="display: none;">'+
																'<div class="col-md-10">'+
																	'<textarea id="nuevo-comentario'+result[i].permlink+'" class="mdhtmlform-md" data-mdhtmlform-group="'+conteo_nuevo_comentarios_+'" style="resize: vertical; width: 100%;padding: 10px;"></textarea>'+
																	'<br>'+
																	'<br>'+ 
																	'<div class="row">'+
																		'<div class="col-md-6">'+
																			'<a id="btn-nuevo-comentario'+result[i].permlink+'" class="btn bg-blue btn-block" '+
																			' onclick="novedad.realizar_comentario(&#39;'+result[i].author+'&#39;,&#39;'+result[i].permlink+'&#39;,&#39;#nuevo-comentario'+result[i].permlink+'&#39;)"> Publicar comentario</a>'+
																		'</div>'+
																		'<div class="col-md-3">'+
																			'<a id="btn-cancelar-comentario'+result[i].permlink+'" class="btn btn-block" onclick="$(&#39;#nuevo-comentario'+result[i].permlink+'&#39;).val(&#39;&#39;);$(&#39;.vista_previa_comentario'+result[i].permlink+'&#39;).html(&#39;&#39;);$(&#39;.new_comentario'+result[i].permlink+'&#39;).hide();$(&#39;a.n_responder&#39;).show()" style="color: #0073b7;background:  white;border: 1px solid #0073b7;"> Cancelar</a>'+
																		'</div>'+
																	'<br>'+
																	'</div>'+
																	'<div class="row">'+
																		'<span style="margin-left: 3%;">Vista previa </span>'+
																		'<a rel="nofollow" href="https://guides.github.com/features/mastering-markdown/" target="_blank" style="float:  right;margin-right: 3%;">Guía para Markdown</a>'+
																		'<div class="vista_previa_comentario'+result[i].permlink+' mdhtmlform-html "  data-mdhtmlform-group="'+conteo_nuevo_comentarios_+'" style="border: 1px solid #cac7c7;border-radius: 2px;padding: 10px;overflow-wrap: break-word;word-wrap: break-word;word-break:  break-word;" ></div>'+
																	'<hr>'+
																	'<br>'+
																	'</div>'+
																'</div>'+ 
															'</div>'+
															
															'<br>'+
															'<div class="row comentarios'+result[i].permlink+'">'+
															'</div>'+											

											'</div>'+

								'</div>');
								//console.log("#seccion_coment"+result[i].permlink+" textarea.mdhtmlform-md");
								$("#seccion_coment"+result[i].permlink+' textarea.mdhtmlform-md').val(result[i].body)
								new MdHtmlForm($("#seccion_coment"+result[i].permlink+' textarea.mdhtmlform-md'))
								new MdHtmlForm($("#nuevo-comentario"+result[i].permlink))
							//console.log(result[i].children);


								// Extraer votos
								$('.votos_comentario'+result[i].permlink).html('');
								$('.lista_votantes_post'+result[i].permlink).html('');
								novedad.extraer_votos(result[i].author,result[i].permlink,function (result_v) {});

							if(result[i].children>0 ){
								extraer_comentario(result[i].author,result[i].permlink,function (result_c) {});
							}
						//};
					};		
							if(sesion.validar()==false){
								// para esconder el acceso a dar respuestar a publicaciones y comentarios
								$('.n_responder ').hide()
							}
							if ((i+1)==result.length) {
								callback({
									resultado : true
								});
							};

					};

				}else{
					callback({
						resultado : false
					})
				}
			},
			error:  function(error) {
				callback(false)
				console.log(JSON.stringify(error));
			}	 
		});
	}
	var extraer_votos = function (author_,permlink_, callback) {
		//console.log("autor : "+author_+"  , extrendo votos de "+permlink_);
		$.ajax({
			async : true,
			url: 'https://api.steemjs.com/get_active_votes',
			type:'GET',	
			data:{	
				author:author_,
				permlink:permlink_,
			},
			beforeSend: function () {
			},
			success:  function (result_votos) {   
				//console.log(result_votos) 
				if (result_votos.length==0) {
					$('#btn_upvoto_comm'+permlink_+' i').show()	
					$('#contenedor_datos_votos'+permlink_).hide()
					callback(false)	
				} else{
					var contando_votos = 0;
					var btn_activado = false;
					for (var e = 0; e < result_votos.length; e++) {

							/**************************************/
							if(result_votos[e].percent>0){
								contando_votos++;
							}
							
							if(result_votos[e].percent>0 && e<=15){
								$('.lista_votantes_post'+permlink_).append('<li>'+result_votos[e].voter+'</li>')
							}
							if(result_votos[e].voter==localStorage.getItem('nombre_steem') && result_votos[e].percent>0){
								$('#btn_downvoto_comm'+permlink_+' i').show()
								btn_activado = true;
							}
							if(result_votos[e].voter==localStorage.getItem('nombre_steem') && result_votos[e].percent==0){
								$('#btn_upvoto_comm'+permlink_+' i').show()						
								btn_activado = true;
							}
							
							if((e+1)==result_votos.length){ 
								if(contando_votos>0){
									$('.votos_comentario'+permlink_).text(contando_votos);
									$('.votos_comentario'+permlink_).show();
									if (btn_activado==false && sesion.validar()==true) {
										$('#btn_upvoto_comm'+permlink_+' i').show()	 
									};
								}else{
									$('#contenedor_datos_votos'+permlink_).hide()
								}
								callback(true)
							}


					};											


				};

				

			},
			error:  function(error) {
				console.log(JSON.stringify(error));
			}	 
		});
	}
	var upvote_novedad = function (autor_,permlink_,id_body_btnvoto_) {

		if (id_body_btnvoto_=="#btn_upvoto_post") {
			animaciones_g.botonLoad('btn_upvoto_post','activar');
		}else{
			animaciones_g.botonLoad('btn_upvoto_post'+permlink_,'activar');
		}
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
						if (id_body_btnvoto_=="#btn_upvoto_post") {
							animaciones_g.botonLoad('btn_upvoto_post','desactivar');
						}else{
							animaciones_g.botonLoad('btn_upvoto_post'+permlink_,'desactivar');
						}
		   	if (error){
				console.log(error)
				alerta.error("Error al realizar el voto : "+error['data'].message+".");
		   	}else{
							if (id_body_btnvoto_=="#btn_upvoto_post") {
								$('.op_cant_votos').html(parseInt($('.op_cant_votos').text().toString())+1)								
								$('#btn_upvoto_post i').hide();
								$('#btn_downvoto_post i').show();
							}else{
								$('.op_cant_votos'+permlink_).html(parseInt($('.op_cant_votos'+permlink_).text().toString())+1)								
								$('#btn_upvoto_post'+permlink_+' i').hide();
								$('#btn_downvoto_post'+permlink_+' i').show();
							}
		   	};
			});

		});
	}
	var downvote_novedad = function (autor_,permlink_,id_body_btnvoto_) {

		alertify.confirm('Quitar voto', 'Cambiar a un voto ascendente restablecerá tus recompensas de curaduría para esta publicación. <br> Luego de retirar el voto, la reanudacion del mismo no generara ganancias.', 
			function(){ 

						if (id_body_btnvoto_=="#btn_downvoto_post") {
							animaciones_g.botonLoad('btn_downvoto_post','activar');			
						}else{
							animaciones_g.botonLoad('btn_downvoto_post'+permlink_,'activar');
						}
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
										if (id_body_btnvoto_=="#btn_downvoto_post") {
											animaciones_g.botonLoad('btn_downvoto_post','desactivar');
										}else{
											animaciones_g.botonLoad('btn_downvoto_post'+permlink_,'desactivar');
										}
						   	if (error){
						   		console.log(error)
								alerta.error("Error al quitar el voto : "+error['data'].message+".");
						   	}else{
											if (id_body_btnvoto_=="#btn_downvoto_post") {
												$('.op_cant_votos').html($('.op_cant_votos').text()-1)
												$('#btn_downvoto_post i').hide();
												$('#btn_upvoto_post i').show();
											}else{
												$('.op_cant_votos'+permlink_).html($('.op_cant_votos'+permlink_).text()-1)
												$('#btn_downvoto_post'+permlink_+' i').hide();
												$('#btn_upvoto_post'+permlink_+' i').show();								
											}
						   	};
							});
						});
						
			}, function(){ 
				
		});
	}
	/*
		Para comentarios
	*/
	var upvote_novedad_comm = function (autor_,permlink_) {

		animaciones_g.botonLoad('btn_upvoto_comm'+permlink_,'activar');
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
						animaciones_g.botonLoad('btn_upvoto_comm'+permlink_,'desactivar');
		   	if (error){
				console.log(error)
				alerta.error("Error al realizar el voto : "+error['data'].message+".");
		   	}else{
	   				$('#contenedor_datos_votos'+permlink_).show()
	   				$('#contenedor_datos_votos'+permlink_).css('display', 'block')		   		
		   			$('#n_borrar_comentario'+permlink_).hide() 
		   			var votos_comentario = ($('.votos_comentario'+permlink_).text()=="")?1:parseInt($('.votos_comentario'+permlink_).text())+1;
		   			//console.log(votos_comentario+": 	votos del comentario :"+permlink_)
								$('.votos_comentario'+permlink_).html(votos_comentario);
								$('#btn_upvoto_comm'+permlink_+' i').hide();
								$('#btn_downvoto_comm'+permlink_+' i').show();								
								$('.votos_comentario'+permlink_).html('');
								$('.lista_votantes_post'+permlink_).html('');
								novedad.extraer_votos(autor_,permlink_,function (result_v) {});
		   	};
			});

		});
	}
	var downvote_novedad_comm = function (autor_,permlink_) {

		alertify.confirm('Quitar voto', 'Cambiar a un voto ascendente restablecerá tus recompensas de curaduría para esta publicación. <br> Luego de retirar el voto, la reanudacion del mismo no generara ganancias.', 
			function(){ 

						animaciones_g.botonLoad('btn_downvoto_comm'+permlink_,'activar');
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
										animaciones_g.botonLoad('btn_downvoto_comm'+permlink_,'desactivar');
						   	if (error){
						   		console.log(error)
								alerta.error("Error al quitar el voto : "+error['data'].message+".");
						   	}else{
						   		var votos_actuales = $('.votos_comentario'+permlink_).text()-1;
												$('.votos_comentario'+permlink_).html(votos_actuales);
												$('#btn_downvoto_comm'+permlink_+' i').hide();
												$('#btn_upvoto_comm'+permlink_+' i').show();
												// Extraer votos
												if (votos_actuales==0) {
													$('#contenedor_datos_votos'+permlink_).hide()
													$('#n_borrar_comentario'+permlink_).show()
												}else{
													$('#n_borrar_comentario'+permlink_).hide()
													$('.votos_comentario'+permlink_).html('');
													$('.lista_votantes_post'+permlink_).html('');
													novedad.extraer_votos(autor_,permlink_,function (result_v) {});
												} 

						   	};
							});
						});
						
			}, function(){ 
				
		});
	}	
	var realizar_comentario = function (author_contenido_,permlink_,id_body_comentario_) {
		if ($(id_body_comentario_).val()=="") {
			$(id_body_comentario_).css('border-color','#f7a5a5');
			alerta.error("Aun no ha redactado el comentario, para :"+author_contenido_);
			return false;
		};
		
		if (id_body_comentario_=="#nuevo-comentario") {
			$('#n_borrar_comentario').hide();
			$('#nuevo-comentario').attr("disabled",true);
			$('#btn-cancelar-comentario').hide();
			animaciones_g.botonLoadText('btn-nuevo-comentario','','activar','');			
		} else{
			$('#n_borrar_comentario'+permlink_).hide();
			$('#nuevo-comentario'+permlink_).attr("disabled",true);
			$('#btn-cancelar-comentario'+permlink_).hide();
			animaciones_g.botonLoadText('btn-nuevo-comentario'+permlink_,'','activar','');

		};


		$(id_body_comentario_).css('border-color','#cac7c7');
		sesion.datos_sesion(function (result_datos_sesion) {
				var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
				sesion.rest_con_api_steem(0);
		  		steem.broadcast.comment(
				    result_datos_sesion.wif_post_priv_steem, // wif del comentarista
				    author_contenido_, // Parent Author
				    permlink_, // Parent Permlink
				    result_datos_sesion.nombre_steem, // Author de comentario
				    permlink, // Permlink
				    '', // Title
								$(id_body_comentario_).val(), // Body
				    { tags: ['uneeverso'], app: 'uneeverso' }, // Json Metadata
				    function(err, result) {
					    	if (id_body_comentario_=="#nuevo-comentario") {
					    		animaciones_g.botonLoadText('btn-nuevo-comentario','Publicar comentario','desactivar','');
				      	$('#nuevo-comentario').attr("disabled",false);
				      	$('#btn-cancelar-comentario').show();

					    	} else{
					    		animaciones_g.botonLoadText('btn-nuevo-comentario'+permlink_,'Publicar comentario','desactivar','');
				      	$('#nuevo-comentario'+permlink_).attr("disabled",false);
				      	$('#btn-cancelar-comentario'+permlink_).show();

					    	};

				      if (err!=null) {			      	
				      	console.log(err);
						alerta.error("Error al realizar el comentario : "+err['data'].message+".");
				      	$('#n_borrar_comentario'+permlink_).show();
				      } else{
				      	if (id_body_comentario_=="#nuevo-comentario") {
					      	$('.new_comentario').hide();
					      	$('#nuevo-comentario').val("");
												$('.vista_previa_comentario').html("");
				      	} else{
					      	$('.new_comentario'+permlink_).hide();
					      	$('#nuevo-comentario'+permlink_).val("");
												$('.vista_previa_comentario'+permlink_).html("");
				      	};
											$('a.n_responder').show();


											var conteo_comentarios = new Date().getTime();
											var conteo_nuevo_comentarios_ = new Date().getTime()+1;

											$('#seccion_coment'+permlink_+" .comentarios"+permlink_).append('<div id="seccion_coment'+result.operations[0][1].permlink+'" class="row">'+
														'<div class="col-md-2"><center>'+
															'<img src="https://steemitimages.com/45x45/https://steemitimages.com/u/'+result.operations[0][1].author+'/avatar" style="width: 45px;height: 45px;border-radius: 100%;margin-right:  0px;"/>'+
														'</center></div>'+
														'<div class="col-md-10">'+

																		'<div class="row">'+
																			'<b><a class="enlace_griss" href="/@'+result.operations[0][1].author+'" target="_blank">'+result.operations[0][1].author+'</a></b>'+
																		'</div>'+

																		'<textarea data-mdhtmlform-group="'+conteo_comentarios+'" class="mdhtmlform-md" disabled="TRUE" style="display:none;" ></textarea>'+
																		'<br>'+
																		'<div data-mdhtmlform-group="'+conteo_comentarios+'" class="row mdhtmlform-html" ></div>'+

																		'<div class="row"style="font-size: 12px;">'+


																			'<a id="btn_upvoto_comm'+result.operations[0][1].permlink+'"    onclick="novedad.upvote_novedad_comm(&#39;'+result.operations[0][1].author+'&#39;,&#39;'+result.operations[0][1].permlink+'&#39;)" style="float:left;">'+
																				'<i class="fa fa-chevron-up btn_upvoto" style="display:block;" ></i>'+
																			'</a>'+
																			'<a id="btn_downvoto_comm'+result.operations[0][1].permlink+'"  onclick="novedad.downvote_novedad_comm(&#39;'+result.operations[0][1].author+'&#39;,&#39;'+result.operations[0][1].permlink+'&#39;)" style="float:left;">'+
																				'<i class="fa fa-chevron-up btn_downvoto"  ></i>'+
																			'</a>'+

																			'<div id="contenedor_datos_votos'+result.operations[0][1].permlink+'" style="float: left;margin-left:  5px;margin-right:  10px; display:none;" class="dropdown ">'+
																				'<button type="button" id="dropdownMenu'+conteo_comentarios+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" class="btn btn-default dropdown-toggle btn-datos-votos">'+
																					'<a onclick="" class="votos_comentario votos_comentario'+result.operations[0][1].permlink+' enlace_griss"> </a>'+
																					'<i style="margin-left:3px;" class="fa fa-caret-down"></i>'+
																				'</button>'+
																				'<ul aria-labelledby="dropdownMenu'+conteo_comentarios+'" class="lista_votantes_post'+result.operations[0][1].permlink+' dropdown-menu">'+
																				'</ul>'+
																			'</div>'+

																			'<span> $0.000</span>'+
																			'<a class="n_responder enlace_griss" onclick="$(&#39;#nuevo-comentario'+result.operations[0][1].permlink+'&#39;).val(&#39;&#39;);$(&#39;.vista_previa_comentario'+result.operations[0][1].permlink+'&#39;).html(&#39;&#39;);$(&#39;.new_comentario'+result.operations[0][1].permlink+'&#39;).show();$(&#39;a.n_responder&#39;).hide()" style="display: inline; cursor: pointer;margin-left: 10px;">'+
																				'<span> Responder </span>'+
																			'</a>'+
																			'<a class="n_borrar_comentario enlace_griss" id="n_borrar_comentario'+result.operations[0][1].permlink+'" onclick="novedad.borrar_comentario(&#39;'+result.operations[0][1].permlink+'&#39;)" style="display: inline;cursor: pointer;margin-left: 10px;border: 0px solid white !important;">'+
																				'<span> Borrar </span>'+
																			'</a>'+																			
																		'</div>'+
																		'<br>'+

																		'<div class="row new_comentario'+result.operations[0][1].permlink+'" style="display: none;">'+
																			'<div class="col-md-10">'+
																				'<textarea id="nuevo-comentario'+result.operations[0][1].permlink+'" class="mdhtmlform-md" data-mdhtmlform-group="'+conteo_nuevo_comentarios_+'" style="resize: vertical; width: 100%;padding: 10px;"></textarea>'+
																				'<div class="row">'+
																					'<div class="col-md-6">'+
																						'<a id="btn-nuevo-comentario'+result.operations[0][1].permlink+'" class="btn bg-blue btn-block" '+
																						' onclick="novedad.realizar_comentario(&#39;'+result.operations[0][1].author+'&#39;,&#39;'+result.operations[0][1].permlink+'&#39;,&#39;#nuevo-comentario'+result.operations[0][1].permlink+'&#39;)"> Publicar comentario</a>'+
																					'</div>'+
																					'<div class="col-md-3">'+
																						'<a id="btn-cancelar-comentario'+result.operations[0][1].permlink+'" class="btn btn-block" onclick="$(&#39;#nuevo-comentario'+result.operations[0][1].permlink+'&#39;).val(&#39;&#39;);$(&#39;.vista_previa_comentario'+result.operations[0][1].permlink+'&#39;).html(&#39;&#39;);$(&#39;.new_comentario'+result.operations[0][1].permlink+'&#39;).hide();$(&#39;a.n_responder&#39;).show()" style="color: #0073b7;background:  white;border: 1px solid #0073b7;"> Cancelar</a>'+
																					'</div>'+
																				'<br>'+
																				'</div>'+
																				'<div class="row">'+
																					'<span style="margin-left: 3%;">Vista previa </span>'+
																					'<a rel="nofollow" href="https://guides.github.com/features/mastering-markdown/" target="_blank" style="float:  right;margin-right: 3%;">Guía para Markdown</a>'+
																					'<div class="vista_previa_comentario'+result.operations[0][1].permlink+' mdhtmlform-html "  data-mdhtmlform-group="'+conteo_nuevo_comentarios_+'" style="border: 1px solid #cac7c7;border-radius: 2px;padding: 10px;overflow-wrap: break-word;word-wrap: break-word;word-break:  break-word;" ></div>'+
																				'<hr>'+
																				'<br>'+
																				'</div>'+
																			'</div>'+ 
																		'</div>'+
																		
																		'<br>'+
																		'<div class="row comentarios'+result.operations[0][1].permlink+'">'+
																		'</div>'+											

														'</div>'+

											'</div>');
											//console.log("#seccion_coment"+result[i].permlink+" textarea.mdhtmlform-md");
											$("#seccion_coment"+result.operations[0][1].permlink+' textarea.mdhtmlform-md').val(result.operations[0][1].body)
											new MdHtmlForm($("#seccion_coment"+result.operations[0][1].permlink+' textarea.mdhtmlform-md'))
											new MdHtmlForm($("#nuevo-comentario"+result.operations[0][1].permlink))
											$('#contenedor_datos_votos'+result.operations[0][1].permlink_).css('display', 'none')


											
				      };
				});
			});
	}
	var borrar_comentario = function (permlink_) {
		alertify.confirm('Confirmar borrado de comentario', '¿Estás seguro?', 
			function(){ 

				$('.n_borrar_comentario').hide()
				$('#n_borrar_comentario'+permlink_).show()
				animaciones_g.botonLoadText('n_borrar_comentario'+permlink_,'','activar','');
				sesion.datos_sesion(function (result_datos_sesion) {
					sesion.rest_con_api_steem(0);
					steem.broadcast.deleteComment(
						result_datos_sesion.wif_post_priv_steem,
						result_datos_sesion.nombre_steem,
						permlink_, 
						function(err, result) {
			  		//console.log(err, result);
			  		$('.n_borrar_comentario').show()
			  		if (err!=null) {
								animaciones_g.botonLoadText('n_borrar_comentario'+permlink_,'Borrar','desactivar','');
								//alerta.error("Error al borrar el comentario: Espere 20 segundos e intente nuevamente");
								//alerta.error("Si existe alguna interacción realizada sobre el comentario, este no sera eliminado");
								alerta.error("Error al borrar el comentario : "+err['data'].message+".");
			  		}else{
			  			$("#seccion_coment"+permlink_).remove();
			  		};
					});

				});

			},function(){ 
				
		});
	}


 
	return{
		busqueda_novedad_scroll_activacion : busqueda_novedad_scroll_activacion,
		iniciar_paginacion_index : iniciar_paginacion_index,
		novedad_actual : novedad_actual,
		extraer_comentario : extraer_comentario,
		extraer_votos : extraer_votos,		
		realizar_comentario : realizar_comentario,
		borrar_comentario : borrar_comentario,
		upvote_novedad : upvote_novedad,
		downvote_novedad : downvote_novedad,
		upvote_novedad_comm : upvote_novedad_comm,
		downvote_novedad_comm : downvote_novedad_comm,		
	}
}();
