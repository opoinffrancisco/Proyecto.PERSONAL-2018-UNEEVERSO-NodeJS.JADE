var automatizacion = function () {
	
	var cargar = function(this_) {
		$('#id_url').val($(this_).data("id_url"));
		$('#u_publicacion').val($(this_).data("url"));
		$('#u_etiqueta').val($(this_).data("etiqueta"));
		$('#u_nombre_s').val($(this_).data("nombre_steem"));
		$('#fecha_registro').val($(this_).data("fecha_registro"));
		$('#fecha_votacion').val($(this_).data("fecha_votacion"));
		$('#cant_voto').val($(this_).data("cant_voto"));
		$('#estado').val($(this_).data("estado"));
	}

	return{
		cargar : cargar,
	}
}();