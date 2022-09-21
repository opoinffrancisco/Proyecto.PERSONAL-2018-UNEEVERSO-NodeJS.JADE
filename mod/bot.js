//creamos la base de datos tienda y el objeto BOT donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var BOT = {};



BOT.all_activos = function(db,plataforma_,callback)
{
    var sql = "SELECT * FROM bot WHERE estado=1 AND plataforma=?";
	var stmt =  db.all(sql,[plataforma_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del BOT
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El BOT no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
BOT.get = function(db,id_bot,callback)
{
    var sql = "SELECT * FROM bot WHERE id=?";
    var stmt =  db.get(sql,[id_bot],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del BOT
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El BOT no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
//ADMINISTRACIÓN
BOT.all = function(db,callback)
{
    var sql = "SELECT * FROM bot";
    var stmt =  db.all(sql,
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del BOT
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El BOT no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}

BOT.get_existencia = function(db,datos_,callback)
{
    var sql = "SELECT * FROM bot WHERE nombre=?";
    var stmt =  db.get(sql,[datos_.nombre],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del BOT
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El BOT no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
BOT.registrar_nuevo = function(db,datos_,callback)
{
    var sql = "INSERT INTO bot VALUES(?,?,?,?,?,?,?,?) ";
    db.run(sql,
            [
                null,
                datos_.nombre,
                datos_.intervalo_voto,
                datos_.limite_votos_emitir,
                datos_.intervalo_publicacion,
                0,
                datos_.nodo_conexion,
                datos_.plataforma
            ],
            function (error) {
                if (error) {
                    callback(false);                    
                } else{
                    callback(true);                
                };
                
            });
}
BOT.editar = function(db,datos_,callback)
{
    var sql = "UPDATE bot SET nombre=?, intervalo_voto=?, limite_votos_emitir=?, intervalo_publicacion=?, estado=?, nodo_conexion=?, plataforma=? WHERE id=? ";
    db.run(sql,
            [
                datos_.nombre,
                datos_.intervalo_voto,
                datos_.limite_votos_emitir,
                datos_.intervalo_publicacion,
                datos_.estado,
                datos_.nodo_conexion,
                datos_.plataforma,
                datos_.id_bot,
            ],
            function (error) {
                if (error) {
                    callback(false);                    
                } else{
                    callback(true);                
                };
            });
}
BOT.cambiar_estado = function(db,datos_,callback)
{
    var sql = "UPDATE bot SET estado=? WHERE id=? ";
    db.run(sql,
            [
                datos_.estado,
                datos_.id_bot,
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
module.exports = BOT;