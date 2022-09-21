//creamos la base de datos tienda y el objeto NOVEDAD donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var NOVEDAD = {};


NOVEDAD.all_web = function(db,datos_,callback)
{
    var sql = "SELECT * FROM novedad WHERE estado=1 ORDER BY id DESC LIMIT ? , ? ";
    var stmt =  db.all(sql,[datos_.desde,datos_.limite],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del NOVEDAD
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El NOVEDAD no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
NOVEDAD.get_disponibilidad_web = function(db,datos_,callback)
{
     var sql = "SELECT * FROM novedad WHERE estado=1 AND url=? AND nombre_autor=?";
    var stmt =  db.get(sql,[datos_.enlace_permanente,datos_.usuario],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del NOVEDAD
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El NOVEDAD no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}


//ADMINISTRACIÓN
NOVEDAD.all = function(db,callback)
{
    var sql = "SELECT * FROM novedad";
    var stmt =  db.all(sql,
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del NOVEDAD
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El NOVEDAD no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}

NOVEDAD.get_existencia = function(db,datos_,callback)
{
    var sql = "SELECT * FROM novedad WHERE url=?";
    var stmt =  db.get(sql,[datos_.url],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del NOVEDAD
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El NOVEDAD no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
NOVEDAD.registrar_nuevo = function(db,datos_,callback)
{
    var sql = "INSERT INTO novedad VALUES(?,?,?,?,?,?,?,?) ";
    db.run(sql,
            [
                null,
                datos_.nombre_muestra,
                datos_.nombre_autor,
                datos_.url,
                UTILIDAD.fecha_y_hora_actual_(),
                datos_.url_imagen,
                datos_.etiqueta,
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
NOVEDAD.editar = function(db,datos_,callback)
{
    var sql = "UPDATE novedad SET nombre_muestra=?, nombre_autor=?, url=?,  url_imagen=?, etiqueta=? WHERE id=? ";
    db.run(sql,
            [
                datos_.nombre_muestra,
                datos_.nombre_autor,
                datos_.url,
                datos_.url_imagen,
                datos_.etiqueta,
                datos_.id_novedad,
            ],
            function (error) {
                if (error) {
                    callback(false);                    
                } else{
                    callback(true);                
                };
            });
}
NOVEDAD.cambiar_estado = function(db,datos_,callback)
{
    var sql = "UPDATE novedad SET estado=? WHERE id=? ";
    db.run(sql,
            [
                datos_.estado,
                datos_.id_novedad,
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
module.exports = NOVEDAD;