var admin = function () {
	
	var iniciar = function() {
			animaciones_g.botonLoadText('btn-acceder','','activar','');
			var usuario_steem_ = $('#usuario_steem').val();
			var contrasena_uneeverso_ = $('#contrasena_uneeverso').val();
			if (usuario_steem_=="" || contrasena_uneeverso_=="") {
				animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
				return false;
			}
			sesion.isUserSteem(usuario_steem_, function (validacion_u_steem) {
				if (validacion_u_steem!=false) {
					animaciones_g.botonLoadText('btn-acceder','','activar','');
					if (sesion.isValidaContrasena(contrasena_uneeverso_)) {
						animaciones_g.botonLoadText('btn-acceder','','activar','');
					    $.ajax({
							url: window.location.href+'/iniciar_sesion',
							type:'POST',	
							data:{	
									nombre_steem:usuario_steem_,
									contrasena_uneeverso:contrasena_uneeverso_,
								},
					        beforeSend: function () {

					        },
					        success:  function (resultado) {
				        	  	//console.log(JSON.stringify(resultado));
				        	  	if (resultado.error==false) {
				        	  		//alerta.exito(resultado.mensaje);
				        	  		console.log(JSON.stringify(resultado));
									localStorage.setItem("token", resultado.token);
									window.location.href=window.location.href+'/index';
				        	  	} else{
				        	  		alerta.error(resultado.mensaje);
				        	  	};
								animaciones_g.botonLoadText('btn-acceder','Iniciar sesión','desactivar','');
					        },
					    	error:  function(error) {
								console.log(JSON.stringify(error));
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
	var cerrar = function () {
			localStorage.clear();
			sessionStorage.clear();
			window.location.href="/admin/cerrar_sesion";
	}
	var validar = function () {
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

	return{
		app:function  () {
			var dato = localStorage.getItem("token");			
			if (dato==null || dato =="") {
				window.location.href='/admin';
			}else{
				sesion.extraerDatos();
			};
		},
		iniciar : iniciar,
		cerrar : cerrar,
	}
}();