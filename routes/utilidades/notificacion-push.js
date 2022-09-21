var webpush = require('web-push');
webpush.setGCMAPIKey('');
webpush.setVapidDetails(
  'https://www.uneeverso.com', 
  '',
  ''
); 
//----------------------------------------------------
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var GESTION_URL = require('../../mod/gestion_url');


var NOTIFICACION_PUSH = {};

NOTIFICACION_PUSH.push_votacion_iniciada = function(datos){
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			//-----------------------------
				GESTION_URL.get_d_push(conexion_db_ON,datos,function (error_d_push_p,	resultado_d_push_p){
					console.log(resultado_d_push_p)
					if (resultado_d_push_p!=false) {
						if(resultado_d_push_p.suscripcion_push!="" && resultado_d_push_p.suscripcion_push!=null){
							console.log("INICIANDO PUSH")
							webpush.sendNotification(
								JSON.parse(resultado_d_push_p.suscripcion_push),
								'{"contenido":"Automatización de publicación iniciada","direccion":"https://www.uneeverso.com/'+resultado_d_push_p.etiqueta+'/@'+resultado_d_push_p.nombre_steem+'/'+resultado_d_push_p.url+'","titulo":"UNEEVERSO","icon":"img/uneeverso-l2.png","badge":"img/uneeverso-l2.png.png"}'
							);//
						};
					}else{
						console.log(" ERROR AL NOTIFICAR AL USUARIO : CONSULTANDO DATOS");
					};
					DBCONEXION.cerrar_conexion(conexion_db_ON);					
				});
			//------------------------------			
		}else{

		}
	});
}

NOTIFICACION_PUSH.push_votacion_finalizada = function(datos){
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			//-----------------------------
				GESTION_URL.get_d_push(conexion_db_ON,datos,function (error_d_push_p,resultado_d_push_p){
					if (resultado_d_push_p!=false) {
						if(resultado_d_push_p.suscripcion_push!="" && resultado_d_push_p.suscripcion_push!=null){
							console.log("INICIANDO PUSH")
							webpush.sendNotification(
								JSON.parse(resultado_d_push_p.suscripcion_push),
								'{"contenido":"Publicación automatizada, obtuvo '+resultado_d_push_p.cant_voto+' votos","direccion":"https://www.uneeverso.com/'+resultado_d_push_p.etiqueta+'/@'+resultado_d_push_p.nombre_steem+'/'+resultado_d_push_p.url+'","titulo":"UNEEVERSO","icon":"img/uneeverso-l2.png","badge":"img/uneeverso-l2.png.png"}'
							);
						};
					}else{
						console.log(" ERROR AL NOTIFICAR AL USUARIO : CONSULTANDO DATOS");
					};
					DBCONEXION.cerrar_conexion(conexion_db_ON);
				});
			//------------------------------			
		}else{

		}
	});
}

module.exports = NOTIFICACION_PUSH;