//creamos la base de datos tienda y el objeto OPINION_DESACTIVACION donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var OPINION_DESACTIVACION = {};




//ADMINISTRACIÓN
OPINION_DESACTIVACION.all = function(db,callback)
{
    var sql = "SELECT * FROM opinion_desactivacion ORDER BY id DESC";
    var stmt =  db.all(sql,
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del OPINION_DESACTIVACION
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El OPINION_DESACTIVACION no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}

OPINION_DESACTIVACION.registrar_nuevo = function(db,datos_,callback)
{
    var sql = "INSERT INTO opinion_desactivacion VALUES(?,?,?,?,?,?,?) ";
    db.run(sql,
            [
                null,
                datos_.opinion_desactivacion,
                datos_.nombre_steem,
                UTILIDAD.fecha_y_hora_actual_(),
                "",
                "",
                0,
            ],
            function (error) {
                if (error) {
                    callback(false);                    
                } else{
                    callback(true);                
                };
                
            });
}
OPINION_DESACTIVACION.responder = function(db,datos_,callback)
{
    var sql = "UPDATE opinion_desactivacion SET nombre=?, intervalo_voto=?, limite_votos_emitir=?, intervalo_publicacion=?, estado=? WHERE id=? ";
    db.run(sql,
            [
                datos_.nombre,
                datos_.intervalo_voto,
                datos_.limite_votos_emitir,
                datos_.intervalo_publicacion,
                datos_.estado,
                datos_.id_opinion_desactivacion,
            ],
            function (error) {
                if (error) {
                    callback(false);                    
                } else{
                    callback(true);                
                };
            });
}


//exportamos el modelo para poder utilizarlo con require
module.exports = OPINION_DESACTIVACION;