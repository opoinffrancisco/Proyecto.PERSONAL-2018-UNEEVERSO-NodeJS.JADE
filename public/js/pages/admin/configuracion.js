var configuracion = function () {
	
	var cargar = function(this_) {
		$('#promotor_usuario').val($(this_).data("nombre_steem"));
		$('#promotor_wif_priv_posting').val($(this_).data("wif_post_priv_steem"));
	}
	return{
		cargar : cargar,
	}
}();