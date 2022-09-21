$(function() {
	$('#example1').DataTable( {
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
	});    
/*    $('#example2').dataTable({
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort": true,
        "bInfo": true,
        "bAutoWidth": false
    });*/
});