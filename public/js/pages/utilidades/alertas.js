var alerta = function (){
	

	// aun no es uso
	var error = function(_contenido_){

		var alerta = alertify.notify(
			_contenido_,
			'error',
			5,
			function(){  
				//console.log('fin de notificaicon'); 
			});

	};
	var exito = function(_contenido_) {

		var alerta = alertify.notify(
			_contenido_,
			'success',
			10,
			function(){  
				//console.log('fin de notificaicon'); 
			});

	}

	var dialogoError = function (_titulo_,_contenido_) {
		var alerta = alertify.alert(
			_titulo_,
			_contenido_,
			function(){
		    	//alertify.message('OK');
		});
	}
	/*
	
		Notificaciones fuera del navegador, 
	*/
	/*
		var notificacionEnDesarrollando= function(titulo, contenido) {
				//if ('undefined' === typeof notification)
				//return false; //No soportado....
				var notificar = new Notification(
										titulo, 
										{
											body: contenido, //el texto o resumen de lo que deseamos notificar
											dir: 'auto', // izquierda o derecha (auto) determina segun el idioma y region
											lang: 'ES', //El idioma utilizado en la notificación
											tag: 'notificationPopup', //Un ID para el elemento para hacer get/set de ser necesario
											icon: 'http://www.weblantropia.com/wp-content/uploads/2014/11/copy-weblantropia_logo.png' //El URL de una imágen para usarla como icono
										}
									);
				
				notificar.onclick = function () {
					console.log('notification.Click');
				};
				notificar.onerror = function () {
					console.log('notification.Error');
				};
				notificar.onshow = function () {
					console.log('notification.Show');
				};
				notificar.onclose = function () {
					console.log('notification.Close');
				};
				
				return true;
		}
	*/

	return{
		Iniciar:function () {

		},
		error : error,
		exito : exito,
		dialogoError : dialogoError,
	}
}();