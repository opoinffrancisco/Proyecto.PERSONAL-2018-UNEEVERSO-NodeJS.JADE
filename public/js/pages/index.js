var index = function () {



	var lista = function () {

			var url = window.location.pathname.replace('/','');

				if (url=="") {
					steem.api.getState(url,function (err, result) {
						console.log(err, result);
						$(result.content).each(function (index, result_2) {
							//console.log(result_2);
							for (var key in result_2) {
										//console.log(key);
										console.log(result_2[key]);
								$('#lista_post').append('<div class="box box-primary">'+
																				'<div class="box-header">'+
																				 '<a href="'+result_2[key].url+'"><h3 class="box-title">'+result_2[key].title+'</h3></a>'+
																				'</div>'+
																				'<form role="form">'+
																				 '<div class="box-body">'+
																				 		result_2[key].body.substring(0,100)+
																				 '</div>'+
																					'<div class="box-footer">'+
																						 '<button class="btn btn-primary" type="submit"> Vote</button>'+
																					'</div>'+																																	
																				'</form>'+
																			'</div>');
										
							}
						});
					});

				}else{
					steem.api.getStateAsync(url,function (err, result) {
						console.log(err, result);
					});

				};

				
	}


	return{
		Iniciar: function () {
			//sesion.extraerDatos();		
			//index.lista();
			setTimeout(function () {
				$('#opciones_nodo_conexion').hide();
			},2000);			
		},
		lista:lista,
	}
}();
$(window).load(function () {
	index.Iniciar();
});

