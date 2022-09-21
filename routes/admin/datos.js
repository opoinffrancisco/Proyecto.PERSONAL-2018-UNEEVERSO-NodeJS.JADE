var ENCRIPTACION = require("../../routes/utilidades/encriptacion");
var DBCONEXION = require('../../mod/conexion');
var conexion_db_ON;
var key_public = "d3c980939a210db2988738cd0dd31c765cab21497f8f24eaa60d5e4d9f5eb32c";
//xxxuneeversoxxx
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads_temp/'});
var fs = require('fs');

/*
router.post("/crear-tablas", function(req, res){
	//eliminamos si existe y creamos la tabla clientes
	USUARIO.crearTabla();
	res.end();
});
router.get("/vaciar-tablas", function(req, res){
	//ELIMINACION DE VARIOS REGISTROS
	USUARIO.vaciar_tabla();
	res.end();
});
*/
router.get('/', function(req, res) {
	if(req.session.id_perfil && req.session.id_perfil==1){
		res.render('admin/migrar-datos.jade', {id_perfil: req.session.id_perfil});
	}else{
		if(req.session.id_perfil && req.session.id_perfil==2){
			res.redirect('/admin/index');
		}else{
			res.redirect('/admin');
		}
		
	}	
});

router.get("/exportar/:key_public", function(req_, res_){

	if(req_.session.id_perfil && req_.session.id_perfil==1 ){
		console.log(req_.params);
		var key_public_send_cifrada_ = ENCRIPTACION.encryptUneeverso(JSON.stringify(req_.params.key_public));
		if (key_public_send_cifrada_==key_public) {
			res_.download('./DB/uneeverso.sqlite3','uneeverso.sqlite3',function (err_) {
				if (err_) {
					console.log(err_);
				}else{
					console.log("exportado");
					res_.json({
						mensaje : "exportado"
					});
				};
			});

		} else{
			res_.json({
				mensaje : "Contraseña incorrecta."
			});
		};
	}else{
		res_.json({
			mensaje : "No posee la permisologia"
		});
	}
});
router.post('/importar', upload.single('archivodb'), function(req, res, next) {	

	if(req.session.id_perfil && req.session.id_perfil==1 ){	
		var key_public_send_cifrada_ = ENCRIPTACION.encryptUneeverso(JSON.stringify(req.body.key_public));
		if (key_public_send_cifrada_==key_public) {
			console.log(req.file.originalname);
			if (req.file.originalname=="uneeverso.sqlite3") {
		       //copiamos el archivo a la carpeta definitiva de fotos
		       fs.createReadStream('./uploads_temp/'+req.file.filename).pipe(fs.createWriteStream('./DB/'+req.file.originalname));
		       //borramos el archivo temporal creado
		       fs.unlink('./uploads_temp/'+req.file.filename); 
				res.json({
					mensaje : "Subido correctamente.",
				});
			}else{
				res.json({
					mensaje : "El archivo tiene que llamarse 'uneeverso.sqlite3'",
				});
			};
		} else{
			res.json({
				mensaje : "Contraseña incorrecta."
			});
		};
	}else{
		res.json({
			mensaje : "No posee la permisologia"
		});
	}
});


module.exports = router;
