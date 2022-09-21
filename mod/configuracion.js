//creamos la base de datos tienda y el objeto CONFIGURACION donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var CONFIGURACION = {};

// Iniciar sesion
CONFIGURACION.get_cfg = function(db,callback)
{
    var sql = "SELECT * FROM configuracion WHERE id=1";
	var stmt =  db.get(sql,
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del CONFIGURACION
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El CONFIGURACION no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}


CONFIGURACION.guardar = function(db,datos_,callback)
{
    var sql = "UPDATE configuracion SET estado_mantenimiento=?, estado_mantenimiento_bot=?, mantenimiento_bot_inicio=?, mantenimiento_bot_terminar=?,nodo_conexion_steem_servidor=?, cant_minima_steem_power=?, cant_maxima_steem_power=?, promotor_usuario=?,promotor_wif_priv_posting=?, limit_votos_votante=?  WHERE id=1 ";
    db.run(sql,
            [
                datos_.estado_mantenimiento,
                datos_.estado_mantenimiento_bot,
                datos_.mantenimiento_bot_inicio,
                datos_.mantenimiento_bot_terminar,
                datos_.nodo_conexion_steem_servidor,
                datos_.cant_minima,
                datos_.cant_maxima,
                datos_.promotor_usuario,
                datos_.promotor_wif_priv_posting,
                datos_.limit_votos_votante,
            ],
            function (error) {
                //callback(error);
                var sql_2 = "UPDATE usuario SET limite_votos_dia=? WHERE limite_votos_dia<(SELECT limit_votos_votante FROM configuracion WHERE id=1)";
                db.run(sql_2,
                        [
                            datos_.limit_votos_votante,
                        ],
                        function (error_2) {
                            callback(error_2);

                        });

            });    
}
CONFIGURACION.gestion_mant_auto = function(db,estado_mantenimiento_bot_,callback)
{
    var sql = "UPDATE configuracion SET estado_mantenimiento_bot=? WHERE id=1 ";
    db.run(sql,
            [
                estado_mantenimiento_bot_,
            ],
            function (error) {
                callback(error);    
            });
}



//exportamos el modelo para poder utilizarlo con require
module.exports = CONFIGURACION;