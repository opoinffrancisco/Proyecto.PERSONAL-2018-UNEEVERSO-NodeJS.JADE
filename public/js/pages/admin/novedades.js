var novedades = function () {
	
	var cargar = function(this_) {

		$('#compose-modal_edicion #b_id_novedad').val($(this_).data("b_id_novedad"));
		$('#compose-modal_edicion #b_nombre_muestra').val($(this_).data("b_nombre_muestra"));
		$('#compose-modal_edicion #b_nombre_autor').val($(this_).data("b_nombre_autor"));
		$('#compose-modal_edicion #b_url').val($(this_).data("b_url"));
		$('#compose-modal_edicion #b_url_imagen').val($(this_).data("b_url_imagen"));
		$('#compose-modal_edicion #b_etiqueta').val($(this_).data("b_etiqueta"));
		$('#compose-modal_edicion #b_estado').val($(this_).data("b_estado"));
	} 
	var guardar_url = function () {
		animaciones_g.botonLoad('send_url_btn','activar');
		sesion.datos_sesion(function (result_datos_sesion) {
			var usuario_steem_ = result_datos_sesion.nombre_steem;
			var url_post_ = $('#compose-modal_registro #b_url_publicacion').val();
			if (url_post_=="") {
				animaciones_g.botonLoad('send_url_btn','desactivar');
				alerta.error("No hay url en el formulario");
				return false;
			}
			//fecha_actual 
			var url_post_GESTIONADA = perfil_automatizacion.limpiar_url(url_post_);
			if (url_post_GESTIONADA!=false) {
				if (url_post_GESTIONADA.usuario_url == usuario_steem_) {
	    $.ajax({
      url: 'https://api.steemjs.com/get_content',
      type:'GET', 
      data:{  
        author:url_post_GESTIONADA.usuario_url,
        permlink:url_post_GESTIONADA.url,
      },
      beforeSend: function () {
      },
      success:  function (result) {

							//steem.api.getContent(url_post_GESTIONADA.usuario_url, url_post_GESTIONADA.url, function(err, result) {
							//console.log(err, result);							
								//console.log(result.author);
								//console.log(result);
								var datos_usuario = JSON.parse(result.json_metadata);
								//console.log(datos_usuario);
								//console.log(datos_usuario.image);
								//console.log(datos_usuario.image[0]);
								if (result.author!="" && result.author!=null){
									$.ajax({
										url: window.location.href+'/registrar_nuevo',
										type:'POST',	
										data:{	
											nombre_muestra:result.root_title,
											nombre_autor:url_post_GESTIONADA.usuario_url,
											url:url_post_GESTIONADA.url,
											url_imagen: datos_usuario.image[0],
											etiqueta:url_post_GESTIONADA.etiqueta_url,
										},
		        beforeSend: function () {

		        },
		        success:  function (resultado) {
			        	 console.log(JSON.stringify(resultado));
			      	  	if(resultado.error==false){																				  		
							$('#compose-modal_registro #b_url_publicacion').val("");
							//animaciones_g.botonLoad('send_url_btn','desactivar');																						  					        	  		
							alerta.exito(resultado.mensaje);
							window.location.href='';
			      	  	} else{
			      	  		alerta.error(resultado.mensaje);
			      	  		$('#url_post_comm').val("");
							animaciones_g.botonLoad('send_url_btn','desactivar');
			      	  	};
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
		});
	}



	return{
		cargar : cargar,
		guardar_url: guardar_url,
	}
}();