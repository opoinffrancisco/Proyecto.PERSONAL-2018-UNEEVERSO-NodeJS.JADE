var animaciones_g = function (){
	
	var botonLoad = function(id_btn_,estado_){
		switch(estado_){
			case 'activar':
				$('#'+id_btn_).attr('disabled', true);
				if ($('#'+id_btn_+' i').length>0) {
					$('#'+id_btn_+' i').hide();
				} else{
					$('#'+id_btn_+' .glyphicon').hide();
				};
				$('#'+id_btn_).css('padding', '0px');
				$('#'+id_btn_).append('<img src="/img/procesar_datos.gif" style="width: 15px;height: 15px;margin: 5px 7px;">');
			break;
			case 'desactivar':
				if ($('#'+id_btn_+' i').length>0) {
					$('#'+id_btn_+' i').show();
				} else{
					$('#'+id_btn_+' .glyphicon').show();
				};			
				$('#'+id_btn_+' img').remove();
				$('#'+id_btn_).css('padding', '5px 10px');
				$('#'+id_btn_).attr('disabled', false);
			break;			
		}
	};
	var botonLoadText = function(id_btn_,text_btn_,estado_,callback){
		switch(estado_){
			case 'activar':
				$('#'+id_btn_).text('');
				$('#'+id_btn_).addClass('load_btn_text');
				$('#'+id_btn_).attr('disabled',true);
				$('#'+id_btn_).append('<img src="/img/procesar_datos.gif" style="width: 25px;height: 100%;">');
				setTimeout(function(){
					$('#'+id_btn_).text('');
					$('#'+id_btn_).addClass('load_btn_text');
					$('#'+id_btn_).attr('disabled',true);
					$('#'+id_btn_).append('<img src="/img/procesar_datos.gif" style="width: 25px;height: 100%;">');
				},  100);
			break;
			case 'desactivar':
				setTimeout(function(){
					$('#'+id_btn_+' img').remove();
					$('#'+id_btn_).text(text_btn_);
					$('#'+id_btn_).removeClass('load_btn_text');
					$('#'+id_btn_).attr('disabled',false);
				},  100);
			break;			
		}
	};
	var listaLoad = function(id_list_,cant_columnas_table_,estado_){

		switch(estado_){
			case 'activar':
				$('#'+id_list_).html('');
				$('#'+id_list_).append('<tr><td colspan="'+cant_columnas_table_+'"><center><img src="/img/procesar_datos.gif" style="width: 15px;height: 15px;margin: 5px 7px;"></center></td></tr>');
			break;
			case 'desactivar':
				$('#'+id_list_).html('');
				$('#'+id_list_).append('<tr><td colspan="'+cant_columnas_table_+'"><center> No hay datos relacionados </center></td></tr>');
			break;			
		}
	};

	return{
		Iniciar:function () {

		},
		botonLoad : botonLoad,
		botonLoadText : botonLoadText,
		listaLoad : listaLoad,
	}
}();