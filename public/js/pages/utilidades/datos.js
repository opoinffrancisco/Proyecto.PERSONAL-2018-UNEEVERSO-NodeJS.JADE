var datos = function () {
 
	var exportar = function () {
			var key_public = $("#key_public").val();
			if (key_public==null || key_public=="") {
				return false;
			};
			window.location.href=window.location.href+'/exportar/'+key_public;
	}
	var importar = function () {
			$('#migrar_datos').unbind('submit').bind('submit',function(e){
			    e.preventDefault();				
				var form = $(this);

		        var key_public = $("#key_public").val();
		        var file2 = document.getElementById("archivodb");   //TENGO DUDA
		        var archivo = file2.files[0]; 				
	            if(key_public && archivo){
	            	// Crea un formData y lo envías
			        var formData = new FormData(form);
			        formData.append('key_public',key_public);
			        formData.append('archivodb',archivo);
				    $.ajax({
						url : form.attr('action'),
		                type : form.attr('method'),
		                data : formData,
		                data: formData,
			            cache: false,
			            contentType: false,
			            processData: false,
				       	success: function(response){
				       		console.log(JSON.stringify(response));
				       	},
				       	error:  function(error) {
							console.log(JSON.stringify(error));
						}		 
					});
				}
    			return false;
			});
	}	

	var fecha_actual = function () {
		return moment().tz("America/Bogota").format("YYYY-MM-DD");
	}
	var tiempo_publicacion = function (fecha_publicacion_) {
		moment.locale('es');
		var fecha_actual = moment(moment().tz("Europe/Dublin").subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'));
		var fecha_publicacion = moment(fecha_publicacion_).tz("Europe/Dublin").subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
		var dias_diferencia = fecha_actual.diff(fecha_publicacion, 'days');
		var meses_diferencia = fecha_actual.diff(fecha_publicacion, 'months');
		var anos_diferencia = fecha_actual.diff(fecha_publicacion, 'years');
		//----------------------
		var hora_actual = moment(moment().tz("Europe/Dublin").subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'));
		fecha_publicacion = moment(moment(fecha_publicacion_).format('YYYY-MM-DDTHH:mm:ss'));
		var horas_diferencia = hora_actual.diff(fecha_publicacion, 'hours', true);
		//----------------------
		var tiempo_resultante;
		dias_diferencia=dias_diferencia+1;
		if (dias_diferencia<=31) {	
			switch(dias_diferencia){
				case 0:
					tiempo_resultante = " Hace "+Math.round(horas_diferencia)+" horas";
				break;
				case 1:
					tiempo_resultante = "ayer ";
				break;
				case 2:
					tiempo_resultante = "anteayer ";
				break;				
				default:
					tiempo_resultante = " Hace "+dias_diferencia+" dias";
				break;
			}
		}else if(dias_diferencia>31 && dias_diferencia<=365){
			switch(meses_diferencia){
				default:
					meses_diferencia = meses_diferencia+1
					tiempo_resultante = " Hace "+meses_diferencia+" meses ";
				break;
			}
		}else if(meses_diferencia>12){
			switch(anos_diferencia){
				default:
					anos_diferencia = anos_diferencia+1
					tiempo_resultante = " Hace "+anos_diferencia+" años ";
				break;
			}

		};
		return tiempo_resultante;
	}
	var tiempo_pago_publicacion = function (fecha_pago_) {
		moment.locale('es');
		var fecha_actual = moment(moment().tz("Europe/Dublin").format('YYYY-MM-DD'));
		var fecha_pago = moment(moment(fecha_pago_).format('YYYY-MM-DD'));
		var dias_diferencia = fecha_actual.diff(fecha_pago, 'days');
		//console.log(moment().tz("Europe/Dublin").format('YYYY-MM-DD'));
		//console.log(fecha_pago_);
		//console.log("dias: "+dias_diferencia);
		dias_diferencia = dias_diferencia*-1
		//------------------------------
		var hora_actual = moment(moment().tz("Europe/Dublin").subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'));
		fecha_pago = moment(moment(fecha_pago_).format('YYYY-MM-DDTHH:mm:ss'));
		var horas_diferencia = hora_actual.diff(fecha_pago, 'hours', true);
		horas_diferencia = (horas_diferencia==0)?horas_diferencia:horas_diferencia*-1;
		horas_diferencia = horas_diferencia.toString().substring(0,1);		


		var tiempo_resultante;	
		if (dias_diferencia>0) {
			dias_diferencia;
			tiempo_resultante = dias_diferencia+" dias";
		} else{

			tiempo_resultante = horas_diferencia+" horas";
		};
		return tiempo_resultante;
	}		
	return{
		Iniciar: function () {
			datos.importar();
		},
		exportar : exportar,
		importar : importar,
		fecha_actual : fecha_actual,
		tiempo_publicacion : tiempo_publicacion,
		tiempo_pago_publicacion : tiempo_pago_publicacion,
	}
}();
$(window).load(function () {
	datos.Iniciar();
});

