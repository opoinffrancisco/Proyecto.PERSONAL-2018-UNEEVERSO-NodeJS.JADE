var usuarios = function () {
	
	var cargar = function(this_) {

		$('#u_id_usuario').val($(this_).data("id_usuario"));
		$('#u_nombre_s').val($(this_).data("nombre_steem"));
		$('#u_correo_e').val($(this_).data("correo_electronico"));
		$('#u_perfil').val($(this_).data("id_perfil"));
		$('#u_wfi_posting').val($(this_).data("wif_post_priv_steem"));
		$('#u_auto_v').val($(this_).data("auto_upvotes"));
	}
	var guardar = function () {
	
			var id_usuario_	 			=$('#u_id_usuario').val();
			var nombre_steem_ 			=$('#u_nombre_s').val();
			var correo_electronico_ 	=$('#u_correo_e').val();
			var id_perfil_ 				=$('#u_perfil').val();
			var wif_post_priv_steem_ 	=$('#u_wfi_posting').val();
			var u_auto_v_ 	=$('#u_auto_v').val();

			if (nombre_steem_=="" || id_perfil_=="" ||
				 wif_post_priv_steem_=="" || correo_electronico_==""
				 || u_auto_v_=="") {
				return false;
			}
			sesion.isUserSteem(nombre_steem_, function (validacion_u_steem) {
				if (validacion_u_steem!=false) {
							if (sesion.iswif(wif_post_priv_steem_)!=false) {
							    $.ajax({
									url: window.location.href+'/editar',
									type:'POST',	
									data:{	
											id_usuario:id_usuario_,
											nombre_steem:nombre_steem_,
											correo_electronico:correo_electronico_,
											auto_upvotes: u_auto_v_,
											id_perfil:id_perfil_,
											wif_post_priv_steem:wif_post_priv_steem_,
										},
							        beforeSend: function () {

							        },
							        success:  function (resultado) {
						        	  	//console.log(JSON.stringify(resultado));
						        	  	window.location.href='';
							        },
							    	error:  function(error) {
										console.log(JSON.stringify(error));
								    }	 
								});
							}else{
								alerta.error("Wif priv the post steem errado");
							};
				}else{
					alerta.error("Usuario no existe en steem");
				};
			});
	}

	return{
		cargar : cargar,
		guardar : guardar,
	}
}();