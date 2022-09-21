//creamos la base de datos tienda y el objeto USUARIO donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var USUARIO = {};

//elimina y crea la tabla usuario
USUARIO.crearTabla = function()
{
	//db.run("DROP TABLE IF EXISTS usuario"); //Esto es peligroso, porque eliminaria datos existentes
	db.run("CREATE TABLE [usuario]("+
    "[id] INTEGER PRIMARY KEY AUTOINCREMENT, "+
    "[nombre_steem] TEXT, "+
    "[contrasena_uneeverso] TEXT, "+
    "[auto_upvotes] INT, "+
    "[correo_electronico] TEXT, "+
    "[codigo_recuperacion] TEXT,"+
    "[id_perfil] INT);");
	//console.log("La tabla usuario ha sido correctamente creada");
}

// Iniciar sesion
USUARIO.get_iniciar_sesion = function(db,datos,callback)
{
    var sql = "SELECT * FROM usuario WHERE nombre_steem = ? AND contrasena_uneeverso = ?";
	var stmt =  db.get(sql,[datos.nombre_steem,ENCRIPTACION.encrypt(datos.contrasena_uneeverso, datos.contrasena_uneeverso)],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del usuario
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El usuario no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
// Iniciar sesion
USUARIO.verificar_credenciales = function(db,datos,callback)
{
    var sql = "SELECT * FROM usuario WHERE nombre_steem = ? ";
    var stmt =  db.get(sql,[datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        //retornamos la fila con los datos del usuario
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //El usuario no existe en uneeverso
                            callback(error, false);
                        }
                    }
                });
}
//obtenemos un usuario por su id, en este caso hacemos uso de db.get
//ya que sólo queremos una fila
USUARIO.get_u_nombre = function(db,datos,callback)
{
	//stmt = db.prepare();
	//pasamos el id del cliente a la consulta
    //stmt.bind(); 
    db.get("SELECT * FROM usuario WHERE nombre_steem = ?",[datos.nombre_steem],function(error, row)
    {
    	if(error) 
        {
            //console.log(error);
            callback(error);
        }else{
        	//retornamos la fila con los datos del usuario
            if(row) 
            {
                //console.log(row);
                callback(error, row);
            }else{
            	//El usuario no existe en uneeverso
            	callback(error, false);
            }
        }
    });
}

//inserta un nuevo usuario
USUARIO.registrar_u_steem = function(db,datos,datos_cfg,callback)
{   
    try{
        var stmt = db.prepare("INSERT INTO usuario VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        stmt.run(
                    null,
                    datos.nombre_steem,
                    ENCRIPTACION.encrypt(datos.contrasena_uneeverso,datos.contrasena_uneeverso),
                    '',
                    1,
                    datos.correo_electronico,
                    0,
                    3,
                    datos_cfg.cant_minima_steem_power,
                    0,
                    "22/01/2018",
                    0,
                    UTILIDAD.fecha_y_hora_actual_(),
                    0,
                    0,
                    "",
                );
        stmt.finalize();
        callback(true);
    }catch(e){
        console.log(e)
        callback(false);
    }
}

//Vaciar datos de la tabla
USUARIO.vaciar_tabla = function()
{
	//db.run("DELETE FROM USUARIO");
	//console.log("Tabla usuario vacia");
}


//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
USUARIO.get_usuarios = function(db,callback)
{
	db.all("   SELECT nombre_steem, wif_post_priv_steem, cant_steem_power_auto, fecha_votos_limitado FROM usuario WHERE auto_upvotes=1 AND (estado_votacion=0  AND fecha_votos_limitado<>? OR estado_votacion=1  AND fecha_votos_limitado<>? OR estado_votacion=0  AND fecha_votos_limitado=?) ",[UTILIDAD.fecha_actual_(),UTILIDAD.fecha_actual_(),UTILIDAD.fecha_actual_()], function(error, rows) {
        if(error) 
        {
            //console.log(error);
            callback(error);
        }else{
            if(rows) 
            {
                callback(error, rows);
            }else{
                //console.log(error,row);
                // no hay resultados
                callback(error, false);
            }
        }
	});
}

//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
USUARIO.get_usuarios_activos = function(db,datos_,callback)
{
    db.all("   SELECT nombre_steem FROM usuario WHERE auto_upvotes=1 AND id_perfil IN(3) ORDER BY id DESC LIMIT ? , ? ",
        [datos_.desde,datos_.limite],function(error, rows) {
        if(error) 
        {
            //console.log(error);
            callback(error);
        }else{
            if(rows) 
            {   
                var resultados_total =[];
                for (var i = 0; i < rows.length; i++) {

                    if (datos_.desde!=0) {
                        resultados_total.push(rows[i].nombre_steem)
                    } else{
                        resultados_total.push("'"+rows[i].nombre_steem+"'")
                    };
                    if ((i+1)==rows.length) {
                        callback(error, resultados_total);
                    };
                };
                
            }else{
                //console.log(error,row);
                // no hay resultados
                callback(error, false);
            }
        }
    });
}

//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
USUARIO.verificar_reiniciar_votos = function(db,callback)
{
    db.run("   UPDATE  usuario  SET votos_dia=0, votos_error_dia=0 WHERE auto_upvotes=1  AND  fecha_votos_limitado!=? ",[UTILIDAD.fecha_actual_()], function(error, rows) {
        if(error) 
        {
            //console.log(error);
            callback(false);
        }else{
            callback(true);
        }
    });
}
//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
USUARIO.get_usuarios_votantes = function(db,nombre_steem_autor_,usuarios_excluir_,limite_votos_emitir_,callback)
{
    db.get("SELECT COUNT(g.id) as num_autovotaciones FROM gestion_url as g WHERE g.estado=2 AND g.nombre_steem = ?",[nombre_steem_autor_],function(error, row)
    {
        if(error) 
        {
            //console.log(error);
            callback(error, false);
        }else{
            var sql_cond_antiguedad = " <= 8 ";
            if(row) 
            {
                if (row.num_autovotaciones>8) {
                    sql_cond_antiguedad =" >= 8 ";
                }
            }
            db.all("    SELECT u.nombre_steem, u.wif_post_priv_steem, u.cant_steem_power_auto, u.fecha_votos_limitado "+
                   "    FROM usuario as u "+
                   "    WHERE u.auto_upvotes=1 "+usuarios_excluir_+" AND u.votos_dia<=u.limite_votos_dia "+
                   "    AND (SELECT COUNT(g.id) FROM gestion_url as g WHERE g.nombre_steem=u.nombre_steem AND g.estado=2 )  "+sql_cond_antiguedad+"  "+
                   "    ORDER BY u.votos_error_dia ASC, u.votos_dia ASC LIMIT "+limite_votos_emitir_, function(error, rows) {
                if(error) 
                {
                    //console.log(error);
                    callback(error, false);
                }else{
                    if(rows) 
                    {
                        callback(error, rows);
                    }else{
                        // no hay resultados
                        callback(error, false);
                    }
                }
            });
        }
    });
}
USUARIO.get_usuarios_organizadores = function(db,callback)
{
    db.all("SELECT * FROM usuario WHERE id_perfil=1 OR id_perfil=2", function(error, rows) {
        if(error) 
        {
            //console.log(error);
            callback(error);
        }else{
            if(rows) 
            {
                callback(error, rows);
            }else{
                //console.log(error,row);
                // no hay resultados
                callback(error, false);
            }
        }
    });
}



USUARIO.gestion_codigo_recuperacion = function(db,codigo_recuperacion_,nombre_steem_,callback)
{
    var sql = "UPDATE usuario SET codigo_recuperacion=?  WHERE nombre_steem=? ";
    db.run(sql,
            [codigo_recuperacion_,nombre_steem_],
            function (error) {
                callback(error);    
            });
}

USUARIO.gestion_codigo_r_contrasena = function(db,datos_,callback)
{
    var sql = "UPDATE usuario SET codigo_recuperacion=0, contrasena_uneeverso=?  WHERE nombre_steem=? AND codigo_recuperacion=?";
    
    //console.log("NUEVA CONTRASEÑA ENCRIPTACION: "+ENCRIPTACION.encrypt(datos_.contrasena_uneeverso,datos_.contrasena_uneeverso));
    db.run(sql,
            [
                ENCRIPTACION.encrypt(datos_.contrasena_uneeverso,datos_.contrasena_uneeverso),  
                datos_.nombre_steem,
                datos_.codigo_recuperacion                
            ],
            function (error) {
                callback(error);    
            });
}

/***********************************************/
//Automatización
USUARIO.cfg_auto_usuario_admin = function(db,datos_,callback)
{
    var where_sql="";
    if ( datos_.si_tiene || datos_.si_menor || datos_.si_mayor) {
        where_sql = " WHERE ";
    }
    if (datos_.si_tiene!="") {
        where_sql = where_sql + " cant_steem_power_auto = "+datos_.si_tiene;
    };
    if (datos_.si_menor!="") {
        if (datos_.si_tiene) {
            where_sql = where_sql + " AND cant_steem_power_auto < "+datos_.si_menor;    
        } else{
            where_sql = where_sql + " cant_steem_power_auto < "+datos_.si_menor;
        };
    };
    if (datos_.si_mayor!="") {
        if ( datos_.si_tiene || datos_.si_menor ) {
            where_sql = where_sql + " AND cant_steem_power_auto > "+datos_.si_mayor;           
        } else{
            where_sql = where_sql + " cant_steem_power_auto > "+datos_.si_mayor;           
        };
    };

    var sql = "UPDATE usuario SET cant_steem_power_auto=?   "+where_sql ;
    db.run(sql,
            [
                datos_.asignar,
            ],
            function (error) {
                callback(error);    
            });
}




//Administración
//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
USUARIO.get_a_usuarios = function(db,callback)
{
    db.all("SELECT * FROM usuario ORDER BY id DESC", function(error, rows) {
        if(error) 
        {
            //console.log(error);
            callback(error);
        }else{
            if(rows) 
            {
                callback(error, rows);
            }else{
                //console.log(error,row);
                // no hay resultados
                callback(error, false);
            }
        }
    });
}


USUARIO.editar = function(db,datos_,callback)
{
    var sql = "UPDATE usuario SET nombre_steem=?, correo_electronico=?, auto_upvotes=?, id_perfil=?  WHERE id=? ";
    db.run(sql,
            [
                datos_.nombre_steem,
                datos_.correo_electronico,
                datos_.auto_upvotes,
                datos_.id_perfil,
                datos_.id_usuario,
            ],
            function (error) {
                callback(error);    
            });
}
// Configuracion de datos del usuarios desde la sección de automatización

USUARIO.cfg_auto_usuario = function(db,datos_,callback)
{
    var sql = "UPDATE usuario SET cant_steem_power_auto=?, limite_votos_dia=? WHERE id=? ";
    db.run(sql,
            [
                datos_.cant_steem_power_auto,
                datos_.limite_votos_dia,
                datos_.id_usuario,
            ],
            function (error) {
                callback(error);    
            });
}
/*
    Error de autorizacion - DESACTIVAR AUTOMATIZACION
*/
USUARIO.desactivar_auto = function(db,nombre_steem,callback)
{
    var sql = "UPDATE usuario SET auto_upvotes=0 WHERE nombre_steem=? ";
    db.run(sql,
            [
                nombre_steem,
            ],
            function (error) {
                callback(error);    
            });
}
/*
    migracion_autorizacion a steem-uneeverso (borrando wif)
*/
USUARIO.migracion_autorizacion = function(db,nombre_steem,callback)
{
    var sql = "UPDATE usuario SET wif_post_priv_steem='' WHERE nombre_steem=? ";
    db.run(sql,
            [
                nombre_steem,
            ],
            function (error) {
                callback(error);    
            });
}

USUARIO.add_token_push = function(db,datos,callback)
{
    var sql = "UPDATE usuario SET suscripcion_push=? WHERE nombre_steem=? ";
    db.run(sql,
            [
                datos.suscripcion_push,
                datos.nombre_steem,
            ],
            function (error) {
                callback(error);    
            });
}

//exportamos el modelo para poder utilizarlo con require
module.exports = USUARIO;