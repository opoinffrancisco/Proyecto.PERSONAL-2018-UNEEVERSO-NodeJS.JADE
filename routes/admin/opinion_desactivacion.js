var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var OPINION_DESACTIVACION = require('../../mod/opinion_desactivacion');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1 || 
		req.session.id_perfil && req.session.id_perfil==2){
			DBCONEXION.iniciar_conexion(function (conexion_db) {
				if (conexion_db!=false) {
					conexion_db_ON = conexion_db;
					OPINION_DESACTIVACION.all(conexion_db_ON,function(err_0,result_0){
						//console.log(err_0,result_0);
						if(err_0)
						{
							res.json(err_0);
						}else{			
							res.render('admin/opinion_desactivacion.jade', {
								datos : { result : result_0 },
								id_perfil: req.session.id_perfil,
							});
						}
					});
				};
			});

	}else{
		res.redirect('/admin');
	}
});



module.exports = router;
