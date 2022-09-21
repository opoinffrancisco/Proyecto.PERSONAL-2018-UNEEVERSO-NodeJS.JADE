var perfil = function () {



	var animaciones = function (usuario, callback) {
			//console.log("Cargando animaciones...");
			$('#menu_url_1').attr('href', '/@'+usuario);
			$('#menu_url_2').attr('href', '/@'+usuario+'/comentarios');
			$('#menu_url_3').attr('href', '/@'+usuario+'/respuestas');
			//$('#menu_url_4').attr('href', '/@'+usuario+'/recompensas-autor');
			//$('#menu_url_5').attr('href', '/@'+usuario+'/recompensas-curacion');
			$('#menu_url_6').attr('href', '/@'+usuario+'/monedero');
			$('#menu_url_7').attr('href', '/@'+usuario+'/automatizacion');
			$('#menu_url_8').attr('href', '/@'+usuario+'/configuracion/automatizacion');
			//$('#menu_url_8').attr('href', '/@'+usuario+'/configuracion');
			$('#sidebar_izquierdo').on('click',function (event) {
				if ($(this).hasClass('sidebar_cerrado')) {
					$(this).removeClass('sidebar_cerrado').addClass('sidebar_abierto');
					$('#divNombreMuestra_perfil').css('margin-left','19px');
					$('#atc_steem').css('margin-left','54px');
				}else{
					$(this).removeClass('sidebar_abierto').addClass('sidebar_cerrado');
					$('#divNombreMuestra_perfil').css('margin-left','');
					$('#atc_steem').css('margin-left','19px');
				}				
			});
			callback(true);
	}
	var cargar_datos = function (usuario) {

			//console.log("Cargando datos...");
			//steem.api.getAccounts([usuario], function(err, result) {
				//console.log(err, result);				
			$.ajax({
				url: 'https://api.steemjs.com/get_accounts?names=["'+usuario+'"]',
				type:'GET',	
			    beforeSend: function () {

			    },
			    success:  function (result) {
					if (result=='') {
						//console.log(err);
						return false;
					} else{
						$('#opciones_nodo_conexion').hide();
						//console.log(err, result);
						if (result.length>0) {
							if (result[0].json_metadata) {

								var cuenta_usuario = result[0].name;
								var datos_usuario = JSON.parse(result[0].json_metadata);
								var nombreMuestra = (datos_usuario.profile.name)?datos_usuario.profile.name:usuario;
								var profile_image = (datos_usuario.profile.profile_image)?datos_usuario.profile.profile_image:'';
								var cover_image = (datos_usuario.profile.cover_image)?datos_usuario.profile.cover_image:'';
								var detalles = (datos_usuario.profile.about)?datos_usuario.profile.about:'';
								var location = (datos_usuario.profile.location)?datos_usuario.profile.location:'';
								var website = (datos_usuario.profile.website)?datos_usuario.profile.website:'';
								var reputation = steem.formatter.reputation(result[0].reputation);
								var post_count = result[0].post_count;

								//
								$('#nombreMuestra_perfil').text(nombreMuestra);
								$('#meta_title').text(nombreMuestra+' (@'+cuenta_usuario+')');
								$('#atc_steem_posts').text(post_count);
								$('#reputacion_perfil').text('('+reputation+')');
								if (profile_image) {						
									$('#profile_image_perfil').css('background-image', "url(https://steemitimages.com/u/"+cuenta_usuario+"/avatar)");
									$('#profile_image_perfil').css('background-size', 'cover')
									//$('#profile_image_perfil').attr('src', profile_image);
									$('#profile_image_perfil').css('display', 'block');
								};
								if (cover_image) {
									$('#cover_image_perfil').css('background-image', "url('https://steemitimages.com/2048x512/"+cover_image+"')");
									$('#cover_image_perfil').css('background-size', 'cover');
									$('#cover_image_perfil').css('background-position', '50% 50%');
								};
								//$('#cover_image_perfil').css('background-size', '100% 150px');

								$('#descripcion_sobre_perfil').text(detalles);
								$('#meta_description').attr('content', detalles);								

								if (location) {
									$('#dato_localizacion').text(location);
									$('#dato_localizacion').attr('href',location);
									$('#dato_localizacion_icon').css('display', 'block')
								}
								if (website) {
									$('#dato_pagina_web').text(website);
									$('#dato_pagina_web').attr('href',website);
									$('#dato_pagina_web_icon').css('display', 'block')
								}
								/*steem.api.getFollowCount(usuario, function(err, result) {
									//console.log(err, result);
									$('#atc_steem_seguidores').text(result.follower_count);				
									$('#atc_steem_siguiendo').text(result.following_count);
								});	*/
								
								if (usuario==localStorage.getItem("nombre_steem")) {
									$('#conten_seguimiento_seguir').hide()

								}else{
									$('#conten_seguimiento_seguir').show()
									sesion.datos_sesion(function (result_datos_sesion) {
										if(result_datos_sesion!=false){// si esta el usuario con la sesion iniciada.
											$.ajax({
												url: 'https://api.steemjs.com/get_following',
												type:'GET',	
												data:{	
														follower:result_datos_sesion.nombre_steem,
														startFollowing:usuario,
														followType:'blog',
														limit:10,
													},
											    beforeSend: function () {

											    },
											    success:  function (result) {	
											    	if (result[0].following==usuario) {
											    		$('#btn-dejar-seguimiento').show()
											    		$('#btn-dejar-seguimiento').attr("onclick", "sesion.dejar_seguir('"+usuario+"')")											    		
											    	}else{
											    		$('#btn-seguir').show()
											    		$('#btn-seguir').attr("onclick", "sesion.seguir('"+usuario+"')")
											    	};
												},
												error:  function(error) {
													console.log(JSON.stringify(error));
											    }	 
											});






										}
									});
								};



								$.ajax({
									url: 'https://api.steemjs.com/get_follow_count?account='+usuario,
									type:'GET',	
								    beforeSend: function () {

								    },
								    success:  function (result) {								    	
								    	$('#atc_steem_seguidores').text(result.follower_count);				
										$('#atc_steem_siguiendo').text(result.following_count);
										$('#atc_steem').show();
									},
									error:  function(error) {
										console.log(JSON.stringify(error));
								    }	 
								});

							} else{
								$('#nombreMuestra_perfil').text(usuario);
							}  
						}else{
							window.location.href='/noexiste@'+usuario;
						};
					}
				},
				error:  function(error) {
					console.log(JSON.stringify(error));
				}	 
			});		

	}


	return{
		Iniciar: function () {
			var usuario = sesion.url_extrar_usuario('perfil');
			setTimeout(function () {
				perfil.animaciones(usuario,function (result) {
					perfil.cargar_datos(usuario);
				});	
			}, 3000);
		},
		animaciones:animaciones,
		cargar_datos:cargar_datos,
	}
}();

	perfil.Iniciar();


