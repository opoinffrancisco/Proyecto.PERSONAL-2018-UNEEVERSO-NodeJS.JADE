var usuarios = function () {

	var control_salto_pag = 380;
	var busqueda_novedad_scroll_activacion = false;
	var tiempo_resolicitar = 1;

	var iniciar_paginacion_index = function () {
			//obtenemos la altura del documento
			
			 
			$(window).scroll(function(){
				var altura = $(document).height();
				if($(window).scrollTop() + $(window).height() == altura) {
						$('#carga_datos').show()
						if (busqueda_novedad_scroll_activacion==false) {
				 			busqueda_novedad_scroll_activacion=true;
					 		$.ajax({
								url:'/usuarios/list_page',
								type:'POST',	
								data:{	
									desde:$('#lista_usuarios tbody > tr td').length+1,
									limite:control_salto_pag,
								},
								beforeSend: function () {
									$('#carga_datos').show()
								},
								success:  function (result) { 
									//console.log(result.datos)  
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
									$('#carga_datos').hide()
									//console.log(result)
									$.ajax({
										url: 'https://api.steemjs.com/get_accounts',
										type:'GET', 
										data:{  
											names:result.datos,
										},
										beforeSend: function () {
										},
										success:function (result) {
											//console.log(result)
											var conteo_result = 0;
											var lista_resultados = [];
											var lista_r_g5 = [];
											//-------
											var resultados_total =[];
											var fila_usuarios ='';
											for (var i = 0; i < result.length; i++) {
												conteo_result++;
												lista_r_g5.push(result[i])
												if(conteo_result==5){
													conteo_result=0;
													lista_resultados.push(lista_r_g5);
													for (var e = 0; e < lista_r_g5.length; e++) {
														fila_usuarios = fila_usuarios+'<td><a href="/@'+lista_r_g5[e].name+'"  target="_blank"><center>'+
																							'<img style="width: 127px;height:  127px;"src="https://steemitimages.com/127x127/https://steemitimages.com/u/'+lista_r_g5[e].name+'/avatar">  ('+steem.formatter.reputation(lista_r_g5[e].reputation)+') - '+
																							lista_r_g5[e].name+'</center></a></td>';
														if((e+1)==lista_r_g5.length){
															$('#lista_usuarios tbody').append('<tr>'+fila_usuarios+'</tr>')
															fila_usuarios = '';
														}
													}
													lista_r_g5 = [];
												};
												if ((i+1)==result.length) {
													/*$('#lista_usuarios').DataTable( {
														"bPaginate": false,
														"paging":   false,
														"ordering": false,
														"info":     false,
														"language": {	
															"lengthMenu": "Mostrat _MENU_ resultados por pagina",
															"zeroRecords": "No hay resultados",
															"info": "Mostrando la pagina _PAGE_ de _PAGES_",
															"infoEmpty": "No hay datos disponibles",
															"infoFiltered": "(Existen _MAX_ resultados)",
															"infoPostFix":    "",
															"thousands":      ",",
															"lengthMenu":     "Mostrar _MENU_ resultados",
															"loadingRecords": "Cargando...",
															"processing":     "Procesando...",
															"search":         "Buscar:",
															"zeroRecords":    "No se encontraron datos",
															"paginate": {
																"first":      "Primero",
																"last":       "Ultimo",
																"next":       "Siguiente",
																"previous":   "Anterior"
															},
														}
													}); */
												};
											};
										},
										error:  function(error) {
											console.log(JSON.stringify(error));
										}
									});			
								},
								error:  function(error) {
									console.log(JSON.stringify(error));
									$('#carga_datos').hide()
									setTimeout(function () {
										busqueda_novedad_scroll_activacion=false;
									},1000*tiempo_resolicitar)
								}	 
							});
						}else{
							$('#carga_datos').hide()
						};
			    }
			                
			});	 

	}

	return{
		Iniciar : function () {

		},
		iniciar_paginacion_index : iniciar_paginacion_index,

	}
}();