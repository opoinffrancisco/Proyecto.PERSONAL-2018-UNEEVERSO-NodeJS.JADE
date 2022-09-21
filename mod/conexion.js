var DBCONEXION = {};
var db;

DBCONEXION.iniciar_conexion = function (callback) {
	var sqlite3 = require('sqlite3').verbose();
	db = new sqlite3.Database('DB/uneeverso.sqlite3',(err) => {
	  if (err) {
	    console.error(err.message);
	    callback(false);
	  }
	  console.log('Conexion iniciada.');
	  callback(db);
	});
}
DBCONEXION.cerrar_conexion = function (db) {
    db.close((err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Conexion cerrada.');
    });
}


//exportamos el modelo para poder utilizarlo con require
module.exports = DBCONEXION;