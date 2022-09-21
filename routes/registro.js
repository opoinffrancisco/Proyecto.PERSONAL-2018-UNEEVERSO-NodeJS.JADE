var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var CONFIGURACION = require('../mod/configuracion');
var USUARIO = require('../mod/usuario');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{			
					res.render('registro.jade', {
						estado_mantenimiento: result_0.estado_mantenimiento,
					});
				}
			});
		};
	});	
});


//http://localhost:3000/insertUser
//Registro de un nuevo usuario en uneeverso
router.post("/registrar_usuario", function(req, res)
{	
	DBCONEXION.iniciar_conexion(function (conexion_db) {
		if (conexion_db!=false) {
			conexion_db_ON = conexion_db;
			//console.log(req.body);
			CONFIGURACION.get_cfg(conexion_db_ON,function(err_0,result_0){
				//console.log(err_0,result_0);
				if(err_0)
				{
					res.json(err_0);
				}else{		
					if (result_0.estado_mantenimiento==0) {
						USUARIO.get_u_nombre(conexion_db_ON,req.body,function(err,result){
							//console.log(err,result);
					        if(err)
					        {
					        	DBCONEXION.cerrar_conexion(conexion_db_ON);
					            res.json(err);
					        }else{
					        	if (result==false) {
					        		USUARIO.registrar_u_steem(conexion_db_ON,req.body,result_0,function (result_r) {
										USUARIO.get_u_nombre(conexion_db_ON,req.body,function(err_v,result_v){
											if (result_v!=false) {
												//console.log(JSON.stringify(result_v));
												DBCONEXION.cerrar_conexion(conexion_db_ON);
												res.json({
							        					error : false,
							        					mensaje : "Registro existoso",
							        					datos : result_v
							        				});
											} else{
												//console.log(JSON.stringify(err_v),JSON.stringify(result_v)); 
												DBCONEXION.cerrar_conexion(conexion_db_ON);
												res.json({
						        					error : true,
						        					error_m : err_v,
						        					mensaje : "El usuario no fue registrado en uneeverso"
						        				});
											};
										});
									});
					        	}else{
					        		DBCONEXION.cerrar_conexion(conexion_db_ON);
					        		res.json({
					        					error : true,
					        					error_m : err,
					        					mensaje : "El usuario ya esta registrado en uneeverso"
					        				});
					        	};
					            
					        }
						});
					} else{
						DBCONEXION.cerrar_conexion(conexion_db_ON);
						res.json({
							error : true,
							error_m : "",
							mensaje : "Nos econtramos en mantenimiento"
						});						
					};
				}

			});
		}
	});
});
	

module.exports = router;


