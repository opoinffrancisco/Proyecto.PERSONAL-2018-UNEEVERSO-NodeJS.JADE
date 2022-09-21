var perfil_configuracion_automatizacion = function () {

	var guardar_cfg_auto = function () {
		animaciones_g.botonLoad('send_cfg_auto_btn','activar');
		sesion.datos_sesion(function (result_datos_sesion) {
			//console.log(result_datos_sesion);
			var usuario_steem_ = result_datos_sesion.nombre_steem;
			var cant_steem_power_auto_ = $('#cant_steem_power_auto').val();
			var limite_votos_dia_ = $('#limite_votos_dia').val();		

			if (usuario_steem_=="" || cant_steem_power_auto_=="" ||
				limite_votos_dia_=="") {
				animaciones_g.botonLoad('send_cfg_auto_btn','desactivar');
				alerta.error("Campos vacios");
				return false;
			}
			if(/[0-9]/g.test(cant_steem_power_auto_)==false){	
        		alerta.error("El STEEM POWER POR VOTO ingresado, no es un numero");
        		return false;
        	}
			if(/[0-9]/g.test(limite_votos_dia_)==false){	
        		alerta.error("El LIMITE DE VOTOS POR DIA ingresado, no es un numero");
        		return false;
        	}
			sesion.isUserSteem(usuario_steem_, function (validacion_u_steem) {
				if (validacion_u_steem!=false) {
					$.ajax({
						url: window.location.href+'/cfg_auto_usuario',
						type:'POST',	
						data:{	
							id_usuario:result_datos_sesion.id,
							nombre_steem:result_datos_sesion.nombre_steem,
							cant_steem_power_auto:cant_steem_power_auto_,
							limite_votos_dia:limite_votos_dia_,
						},
				        beforeSend: function () {

				        },
				        success:  function (resultado) {
			        	  	//console.log(JSON.stringify(resultado));
			        	  	if (resultado.error==false) {
			        	  		localStorage.setItem("token", resultado.token);
			        	  		alerta.exito(resultado.mensaje);				        	  	
			        	  	} else{
			        	  		alerta.error(resultado.mensaje);
			        	  	};
			        	  	animaciones_g.botonLoad('send_cfg_auto_btn','desactivar');
				        },
		    			error:  function(error) {
							console.log(JSON.stringify(error));
							animaciones_g.botonLoad('send_cfg_auto_btn','desactivar');
						}	 
					});
				}else{
					alerta.error("EL usuario no existe en steem");
					animaciones_g.botonLoad('send_cfg_auto_btn','desactivar');
				};
			});	
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
	var validar_auto = function (result_datos_sesion) {
			//console.log(result_datos_sesion)
			if (sesion.url_extrar_usuario('perfil')==result_datos_sesion.nombre_steem) {
				$('.content').show();
				if(result_datos_sesion.auto_upvotes>0){
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
						//perfil_automatizacion.cargar_lista_espera_personal();
					}else{
						// si el descanso de bots esta activo se activa por aca, debido a que la cargar_lista_espera_personal, no sera cargarda  
						//perfil_automatizacion.cargar_lista_votos_personal();
					}
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
					//perfil_automatizacion.cargar_lista_detenidos_personal();
					//console.log("tu automatizacion esta desactivada");
				};
			}else{
				//console.log("es de otro usuario");
				$('.content').hide();
			};
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

		if (!perfil_configuracion_automatizacion.validar_url_comentario(url_)) {
			if (!perfil_configuracion_automatizacion.validar_url_post(url_)) {
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
			$('#menu_url_8').removeClass('menu-item').addClass('menu-item-active');
			$('#menu_url_8').html('<b>Configuración</b>')

			var usuario = sesion.url_extrar_usuario('perfil');
			$('#menu_2_url_1').attr('href', '/@'+usuario+'/configuracion');
			$('#menu_2_url_2').attr('href', 'javascript:;');
			//
			sesion.datos_sesion(function (argument) {
				validar_auto(argument);
			});
	}
	return{
		Iniciar: function () {
			if( $('#automatizacion_voto').length>0 ) {
				perfil_configuracion_automatizacion.animaciones();
			};
		},
		animaciones:animaciones,
		validar_auto : validar_auto,
		validar_url_post : validar_url_post,
		validar_url_comentario : validar_url_comentario,
		limpiar_url : limpiar_url,
		guardar_cfg_auto : guardar_cfg_auto,
	}
}();
perfil_configuracion_automatizacion.Iniciar();
