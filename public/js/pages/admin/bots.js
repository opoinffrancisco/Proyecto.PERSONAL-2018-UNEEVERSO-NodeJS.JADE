var bots = function () {
	
	var cargar = function(this_) {

		$('#compose-modal_edicion #b_id_bot').val($(this_).data("b_id_bot"));
		$('#compose-modal_edicion #b_nombre').val($(this_).data("b_nombre"));
		$('#compose-modal_edicion #b_intervalo_voto').val($(this_).data("b_intervalo_voto"));
		$('#compose-modal_edicion #b_limite_votos_emitir').val($(this_).data("b_limite_votos_emitir"));
		$('#compose-modal_edicion #b_intervalo_publicacion').val($(this_).data("b_intervalo_publicacion"));
		$('#compose-modal_edicion #b_estado').val($(this_).data("b_estado"));
		$('#compose-modal_edicion #b_nodo_conexion').val($(this_).data("b_nodo_conexion"));
		$('#compose-modal_edicion #b_plataforma').val($(this_).data("b_plataforma"));
	}
	return{
		cargar : cargar,
	}
}();