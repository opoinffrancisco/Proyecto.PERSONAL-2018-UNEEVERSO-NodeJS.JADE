var perfil_configuracion = function () {



	var animaciones = function () {
			$('.menu_perfil .menu-item-active').removeClass('menu-item-active').addClass('menu-item');
			$('#menu_url_8').removeClass('menu-item').addClass('menu-item-active');
			var usuario = sesion.url_extrar_usuario('perfil');
			$('#menu_2_url_1').attr('href', 'javascript:;');
			$('#menu_2_url_2').attr('href', '/@'+usuario+'/configuracion/automatizacion');
	}


	return{
		Iniciar: function () {
			perfil_configuracion.animaciones();

		},
		animaciones:animaciones,
	}
}();

	perfil_configuracion.Iniciar();


