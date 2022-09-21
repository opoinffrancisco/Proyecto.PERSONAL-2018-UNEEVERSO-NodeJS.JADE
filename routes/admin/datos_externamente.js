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

router.get('/', function(req, res) {
	res.render('admin/migrar-datos-externamente.jade');
});
 
router.post('/importar', upload.single('archivodb'), function(req, res, next) {	
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
});


module.exports = router;
