//creamos la base de datos tienda y el objeto USUARIO donde iremos almacenando la info
var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var UTILIDAD = require('../mod/utilidad');
var GESTION_URL = {};

//elimina y crea la tabla usuario
GESTION_URL.crearTabla = function()
{
	//db.run("DROP TABLE IF EXISTS usuario"); //Esto es peligroso, porque eliminaria datos existentes
	db.run("CREATE TABLE IF NOT EXISTS gestion_url (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT,nombre_steem TEXT, fecha_registro DATETIME, fecha_votacion DATETIME, estado INT )");
	//console.log("La tabla gestion_url ha sido correctamente creada");
}


GESTION_URL.guardar = function(db,datos,callback)
{
    //Estado 1 = Publicacionn en espera.
    var sql = "INSERT INTO gestion_url (url, nombre_steem, fecha_registro, estado, etiqueta)VALUES(?,?,?,?,?)";
    db.run(sql,
            [datos.url_post_comm,datos.nombre_steem,UTILIDAD.fecha_actual_(), 1,datos.etiqueta_url], 
            function (error) {
                //console.log("GUARDADO");
                //console.log(error);
                callback(error);    
    });
}
GESTION_URL.get_d_push = function(db,datos,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ? ";
    db.get(sql,[datos.nombre_steem,datos.url_post_comm],
        function (error,row) {
        //console.log(error, row);
        if(error) 
        {
            //console.log(error);
            callback(error, false);
        }else{
            if(row) 
            {
                //console.log(error,row);
                //callback(error, row);
                var sql_2 = "SELECT * FROM usuario WHERE nombre_steem = ?";
                db.get(sql_2,[datos.nombre_steem],
                    function (error_2,row_2) {
                    //console.log(error_2, row_2);
                    if(error_2) 
                    {
                        //console.log(error_2);
                        callback(error_2, false);
                    }else{
                        if(row_2) 
                        {
                            //console.log(error_2,row_2);
                            callback(error_2, {
                                nombre_steem : row_2.nombre_steem,
                                suscripcion_push : row_2.suscripcion_push,
                                cant_voto   : row.cant_voto,
                                etiqueta    : row.etiqueta,
                                url         : row.url
                            });
                        }else{
                            //console.log(error_2,row_2);
                            // no hay resultados
                            callback(error_2, false);
                        }
                    }
                });


            }else{
                //console.log(error,row);
                // no hay resultados
                callback(error, false);
            }
        }
    });
}
GESTION_URL.verificar_espera = function(db,datos,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ? ";
	var stmt =  db.get(sql,[datos.nombre_steem,datos.url_post_comm],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error, false);
                    }else{
                        if(row) 
                        {
                            //console.log(error,row);
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });
}
 

GESTION_URL.cargar_lista_espera_personal = function(db,datos,callback)
{
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   " SELECT "+ 
                        " (SELECT "+
                        "   COUNT(g_u_sub.id)+1 as total"+
                        " FROM gestion_url AS g_u_sub "+
                        " WHERE g_u_sub.estado = 1 AND g_u_sub.id < g_u.id ) as numero_en_cola, "+
                       " g_u.id, "+
                       " g_u.nombre_steem, "+
                       " g_u.url, "+
                       " g_u.fecha_registro, "+
                       " g_u.estado, "+
                       " g_u.etiqueta "+
                " FROM gestion_url AS g_u "+
                    " INNER JOIN usuario AS u ON u.nombre_steem = g_u.nombre_steem "+
                " WHERE g_u.nombre_steem = ? AND g_u.estado = 1 "+
                " ORDER BY g_u.id ASC ";
    var stmt =  db.all(sql,[datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });  
}
GESTION_URL.cargar_lista_votos_personal = function(db,datos,callback)
{
    var sql =   " SELECT " +
                "      g_u.nombre_steem, " +
                "      g_u.url, " +
                "      g_u.fecha_registro, " +
                "      g_u.fecha_votacion, " +
                "      g_u.cant_voto, " +
                "      g_u.etiqueta "+
                " FROM gestion_url AS g_u " +
                "   INNER JOIN usuario AS u ON u.nombre_steem = g_u.nombre_steem " +
                " WHERE g_u.nombre_steem = ? AND g_u.estado = 2   " +
                " ORDER BY g_u.id DESC " +
                " LIMIT 7 ";
    var stmt =  db.all(sql,[datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            callback(error, false);
                        }
                    }
                });
}
GESTION_URL.cargar_lista_detenidos_personal = function(db,datos,callback)
{
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   " SELECT "+ 
                       " g_u.id, "+
                       " g_u.nombre_steem, "+
                       " g_u.url, "+
                       " g_u.fecha_registro, "+
                       " g_u.estado, "+
                       " g_u.etiqueta "+
                " FROM gestion_url AS g_u "+
                    " INNER JOIN usuario AS u ON u.nombre_steem = g_u.nombre_steem "+
                " WHERE g_u.nombre_steem = ? AND g_u.estado = 0 "+
                " ORDER BY g_u.id ASC ";
    var stmt =  db.all(sql,[datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });  
}


GESTION_URL.activar_desactivar_automatizacion = function(db,datos,callback)
{
    //Estado 1 = En espera/cola
    var sql = "UPDATE usuario SET auto_upvotes=? WHERE nombre_steem=? ";
    db.run(sql,
            [datos.activar_desactivar,datos.nombre_steem],
            function (error) {
                //console.log(error);
                callback(error);    
            });
}
GESTION_URL.verificar_activar_desactivar_automatizacion = function(db,datos,callback)
{
    var sql = "SELECT * FROM usuario WHERE nombre_steem = ? AND auto_upvotes = ?";
    var stmt =  db.get(sql,[datos.nombre_steem,datos.activar_desactivar],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            //console.log(error,row);
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });
} 
GESTION_URL.gestion_url_activar_desactivar = function(db,nombre_steem_,estado_post_,nuevo_estado_post_,callback)
{
    if (nuevo_estado_post_==1) {
        var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND estado = 0";
        var stmt =  db.all(sql,[nombre_steem_],
                        function (error,row) {
                            //console.log("verificacion, usuario: "+nombre_steem_)
                            //console.log("verificacion")
                            //console.log(error, row);
                            if(error) 
                            {
                                //console.log(error);
                                callback(error,false);
                            }else{
                                if(row.length!=0) 
                                {
                                    //console.log(error,row);
                                    //callback(error, row);
                                    var sql = "DELETE FROM gestion_url WHERE estado=0 AND nombre_steem=? ";
                                    db.run(sql,
                                            [nombre_steem_],
                                            function (error) {
                                                //console.log(error);
                                                for (var i = 0; i < row.length; i++) {
                                                    ///console.log("A eliminar : "+row[i])
                                                    GESTION_URL.guardar(db,{
                                                        url_post_comm : row[i].url,
                                                        nombre_steem : row[i].nombre_steem,
                                                        etiqueta_url : row[i].etiqueta
                                                    },function (resultado_re_ordenado) {
                                                        //console.log(resultado_re_ordenado)
                                                    })
                                                    if((i+1)==row.length) {
                                                        callback(error, 1);
                                                    };  
                                                };
                                            });
                                }else{
                                    //console.log(error,row);
                                    // no hay resultados
                                    callback(error, 0);
                                }
                            }
                    });
    } else{
        var sql = "UPDATE gestion_url SET estado=0 WHERE estado=1 AND nombre_steem=? ";
        db.run(sql,
                [nombre_steem_],
                function (error) {
                    //console.log(error);
                    callback(error);
                });
    };
}


GESTION_URL.verificar_automatizacion = function (db,datos,callback) {
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   " SELECT  "+
                "    * "+
                " FROM gestion_url AS g_u "+
                " WHERE g_u.url = ? AND nombre_steem=? AND estado=2";
    var stmt =  db.get(sql,[datos.url_post_comm, datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}
GESTION_URL.verificar_post_dia = function (db,datos,callback) {
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   " SELECT  "+
                "    MAX(g_u.id), "+
                "    g_u.id, "+
                "    g_u.nombre_steem as nombre_steem, "+
                "    g_u.url, "+
                "    g_u.fecha_registro, "+
                "    g_u.estado "+
                " FROM gestion_url AS g_u "+
                " WHERE g_u.nombre_steem = ? ";
    var stmt =  db.all(sql,[datos.nombre_steem],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}
GESTION_URL.bot_verifica_existencia_votacion_activa = function (db,datos_bot_,callback) {
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   " SELECT  "+
                " g_u.id "+
                " FROM gestion_url AS g_u "+
                " WHERE estado = 3 AND id_bot_votacion=? ";
    var stmt =  db.get(sql,[datos_bot_.id],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}
GESTION_URL.automatizador_ON = function (db,callback) {
    // el +1 de la sub consulta es porque se cuentan los que estan delante de la cola, pero se necesita conocer, el numero de la url en la cola.
    var sql =   "  SELECT  "+
                "         (SELECT     "+
                "          COUNT(g_u.id)  "+
                "         FROM gestion_url AS g_u "+
                "         WHERE g_u.estado = 1) as cant_espera, "+
                "         (SELECT "+
                "         COUNT(g_u_sub.id) as total "+
                "         FROM gestion_url AS g_u_sub "+
                "         WHERE g_u_sub.id < g_u.id AND g_u_sub.estado = 1)+1 as numero_en_cola, "+
                "         g_u.id, "+
                "         g_u.nombre_steem as nombre_steem, "+
                "         g_u.url, "+
                "         g_u.fecha_registro, "+
                "         g_u.estado, "+
                "         g_u.cant_voto "+
                "  FROM gestion_url AS g_u "+
                "  WHERE g_u.estado = 1  AND (SELECT "+
                "      COUNT(g_u_sub.id) as total "+
                "      FROM gestion_url AS g_u_sub "+ 
                "      WHERE g_u_sub.id < g_u.id AND g_u_sub.estado = 1)+1 = 1  "+
                "  ORDER BY g_u.id ASC "+
                "  LIMIT 1";
    var stmt =  db.get(sql,
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}
GESTION_URL.despachar_url_dias_excedidos = function(db,nombre_steem_,url_,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ?";
    var stmt =  db.get(sql,[nombre_steem_,url_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                         // en votacion
                         var sql = "UPDATE gestion_url SET estado=2, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                         db.run(sql,
                                 ['Tiempo excedido, para ingresos',nombre_steem_,url_],
                                 function (error) {
                                     callback(error);    
                                 });
                        }else{
                            console.log("Error inesperado en url validada y en proceso de upvotos");
                        }
                    }
                });
}
GESTION_URL.iniciar_votacion_post = function(db,nombre_steem_,url_,datos_bot_,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ?";
    var stmt =  db.get(sql,[nombre_steem_,url_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                         // en votacion
                         var sql = "UPDATE gestion_url SET estado=3, id_bot_votacion=? WHERE nombre_steem=? AND url=? ";
                         db.run(sql,
                                 [datos_bot_.id,nombre_steem_,url_],
                                 function (error) {
                                     callback(error);    
                                 });
                        }else{
                            console.log("Error inesperado en url validada y en proceso de upvotos");
                        }
                    }
                });
}
GESTION_URL.cerrar_votacion_post = function(db,nombre_steem_,url_,callback)
{
	var sql = "UPDATE gestion_url SET estado=2 WHERE nombre_steem=? AND url=? ";
	db.run(sql,
		[nombre_steem_,url_],
		function (error) {
			callback(error);
	});
}

GESTION_URL.sumar_voto_obtenido = function(db,nombre_steem_,url_,nombre_steem_votante_,intentos_votos_,cfg_limite_votos_dia_votamte_,limite_votos_emitir_bot_,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ?";
    var stmt =  db.get(sql,[nombre_steem_,url_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error,0);
                    }else{
                        if(row) 
                        {
                        	var estado_post = 0;
                            var sql = "UPDATE gestion_url SET cant_voto=?, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                            //cantidad limite cumplida
                            //if ((row.cant_voto+1)>=limite_votos_emitir_bot_) {
                            if (intentos_votos_>=limite_votos_emitir_bot_) {
                             // Finalización de votación
                            	var sql = "UPDATE gestion_url SET estado=2, cant_voto=?, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                            	estado_post=2;
                            }
                            db.run(sql,
                                    [row.cant_voto+1,UTILIDAD.fecha_actual_(),nombre_steem_,url_],
                                    function (error) {
                                        //callback(error);    
                                        var sql = "SELECT * FROM usuario WHERE nombre_steem=? ";
                                        var stmt =  db.get(sql,[nombre_steem_votante_],
                                                        function (error_votante,row_votante) {
                                                        //console.log(error, row);
                                                        if(error_votante) 
                                                        {
                                                            //console.log(error);
                                                            callback(error_votante,row.cant_voto+1);
                                                        }else{
                                                            if(row_votante) 
                                                            {       
                                                                var sql = " UPDATE usuario SET votos_dia=?, fecha_votos_limitado=? WHERE id=? AND nombre_steem=? ";
                                                                db.run(sql,
                                                                        [row_votante.votos_dia+1, UTILIDAD.fecha_actual_(),row_votante.id, nombre_steem_votante_],
                                                                        function (error_votante_cont) {
                                                                            callback(estado_post,row.cant_voto+1);    
                                                                        });
                                                            }else{
                                                                console.log("Error inesperado contar voto realizado al dia");
                                                            }
                                                        }
                                        });

                                    });
                        }else{
                            console.log("Error inesperado en url validada y en proceso de upvotos");
                        }
                    }
                });
}
GESTION_URL.despachar_url_voto_error = function(db,nombre_steem_,url_,nombre_steem_votante_,intentos_votos_error_steem_,limite_votos_emitir_bot_,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ?";
    var stmt =  db.get(sql,[nombre_steem_,url_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        {
                        	var nuevo_estado_post_=0;
                            // SI TIENE MAS DE 70% DE VOTOS REALIZADOS PUEDE TERMINAR LA VOTACION                            
                            if (intentos_votos_error_steem_>=(10*limite_votos_emitir_bot_/100) && 
                            	row.cant_voto<(70*limite_votos_emitir_bot_/100)) {
                                // SI LA CANTIDAD DE VOTOS ES MAYOR AL 70% DEL LIMITE, SE DA POR ATENTIDA
                                var sql = "UPDATE gestion_url SET estado=1, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                console.log("CIERRE FORZADO REALIZADO - VOTACION REINICIADA DE :"+url_);
                                nuevo_estado_post_=1;
                                
                            }else{
                                //intentos_votos_error_steem_>=(10*limite_votos_emitir_bot_/100) &&
                                if(row.cant_voto>(70*limite_votos_emitir_bot_/100)) {
                                    // SI LA CANTIDAD DE VOTOS ES MAYOR AL 70% DEL LIMITE, SE DA POR ATENTIDA
                                    var sql = "UPDATE gestion_url SET estado=2, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                    console.log("CIERRE FORZADO REALIZADO - VOTACION TERMINADA DE :"+url_);
                                    nuevo_estado_post_=2;
                                }else{
                                	var sql = "UPDATE gestion_url SET  fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                    console.log("INTENTOS FALLIDOS EN LA VOTACION : "+intentos_votos_error_steem_+" CON :"+(10*limite_votos_emitir_bot_/100)+" REINICIAMOS LA VOTACION");                                    
                                }
                            }
							db.run(sql,
                             [UTILIDAD.fecha_actual_(),nombre_steem_,url_],
                             function (error) {
                                 //callback(nuevo_estado_post_);    
                                 var sql = "SELECT * FROM usuario WHERE nombre_steem=? ";
                                 var stmt =  db.get(sql,[nombre_steem_votante_],
                                                 function (error_votante,row_votante) {
                                                 //console.log(error, row);
                                                 if(error_votante) 
                                                 {
                                                     //console.log(error);
                                                     callback(error_votante);
                                                 }else{
                                                     if(row_votante) 
                                                     {       
                                                         var sql = " UPDATE usuario SET votos_error_dia=?, fecha_votos_limitado=? WHERE id=? AND nombre_steem=? ";
                                                         db.run(sql,
                                                                 [row_votante.votos_error_dia+1, UTILIDAD.fecha_actual_(),row_votante.id, nombre_steem_votante_],
                                                                 function (error_votante_cont) {
                                                                 				// DEVUELVE EL ESTADO RESULTANTE DEL POST
                                                                     callback(nuevo_estado_post_);
                                                                 });
                                                     }else{
                                                         console.log("Error inesperado contar voto errado realizado al dia");
                                                     }
                                                 }
                                 });




                             });

                        }else{
                            console.log("Error inesperado en url validada y en proceso de upvotos");
                        }
                    }
                });
}
GESTION_URL.sin_respuesta_cerrar_votacion = function(db,nombre_steem_,url_,intentos_votos_retrasado_,bot_cantidad_limite_votos_,callback)
{
    var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ?";
    var stmt =  db.get(sql,[nombre_steem_,url_],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error);
                    }else{
                        if(row) 
                        { 
                            var nuevo_estado_post_ = 0;

                            //10% DE VOTOS FALLIDOS PARA REINICIAR POST y menos del 70% del limite de upvotes a obtener para asegurar que almenos ha sido votado
                            if (intentos_votos_retrasado_>=(10*bot_cantidad_limite_votos_/100) &&
                            	row.cant_voto<(70*bot_cantidad_limite_votos_/100)) {
                                var sql = "UPDATE gestion_url SET estado=1, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                console.log("CIERRE FORZADO REALIZADO - PUBLICACION REINICIADA DE :"+url_);
                                nuevo_estado_post_=1;
                            } else{
                                // SI TIENE MAS DE 70% DE VOTOS REALIZADOS PUEDE TERMINAR LA VOTACION
                                if (row.cant_voto>(70*bot_cantidad_limite_votos_/100)) {
                                    // SI LA CANTIDAD DE VOTOS ES MAYOR AL 70% DEL LIMITE, SE DA POR ATENTIDA
                                    var sql = "UPDATE gestion_url SET estado=2, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                    console.log("CIERRE FORZADO REALIZADO - VOTACION TERMINADA DE :"+url_);
                                    nuevo_estado_post_=2;
                                } else{
                                    var sql = "UPDATE gestion_url SET fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                                    console.log("RETARDO DE VOTO :"+intentos_votos_retrasado_+" CON "+(10*bot_cantidad_limite_votos_/100)+" SE REINICIA LA PUBLICACION");
                                };
                            };

                            db.run(sql,
                                    [UTILIDAD.fecha_actual_(),nombre_steem_,url_],
                                    function (error) {
                                        callback(nuevo_estado_post_);    
                                    });
                        }else{
                            console.log("Error inesperado en url validada y en proceso de upvotos");
                        }
                    }
                });
}
GESTION_URL.sin_voto_nuevo = function (db,nombre_steem_autor_,url_autor_,ultimo_voto_emitido_,bot_cantidad_limite_votos_,callback){
 var sql = "SELECT * FROM gestion_url WHERE nombre_steem = ? AND url = ? ";
 var stmt =  db.get(sql,[nombre_steem_autor_,url_autor_],
                 function (error,row) {
                 //console.log(error, row);
                 if(error) 
                 {
                     //console.log(error);
                     callback(error);
                 }else{
																					var nuevo_estado_post_ = 0;                 	
                     if(row.estado==3) 
                     {
                         if (row.cant_voto==ultimo_voto_emitido_) {
                          if (row.cant_voto<(70*bot_cantidad_limite_votos_/100) ){
                          	// SI LA CANTIDAD DE VOTOS ES MENOR AL 70% DEL LIMITE, SE ORICEDE A REINICIAR
		                         var sql = "UPDATE gestion_url SET estado=1, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
		                         console.log("TIEMPO: CIERRE FORZADO REALIZADO - PUBLICACION REINICIADA DE :"+url_autor_);
		                         nuevo_estado_post_=1;
                          }else if(row.cant_voto>=(70*bot_cantidad_limite_votos_/100) ){
                           // SI LA CANTIDAD DE VOTOS ES MAYOR AL 70% DEL LIMITE, SE DA POR ATENTIDA
                           var sql = "UPDATE gestion_url SET estado=2, fecha_votacion=?  WHERE nombre_steem=? AND url=? ";
                           console.log("TIEMPO: CIERRE FORZADO REALIZADO - VOTACION TERMINADA DE :"+url_autor_);
                           nuevo_estado_post_=2;
                          }
																										db.run(sql,
	                                 [UTILIDAD.fecha_actual_(),nombre_steem_autor_,url_autor_],
	                                 function (error) {
	                                     callback(nuevo_estado_post_);    
	                                 });
                         }else{
				                      //console.log(" ESTE YA NO ES EL ULTIMO VOTO EMITIDO ");
				                      callback(nuevo_estado_post_);
                         };
                     }else{
                      //console.log(" LA VOTACION YA HA SIDO TERMINADA O REINICIADA ");
                      callback(nuevo_estado_post_);
                     }
                 }
             });
}


//Administración
//obtenemos todos los usuario de la tabla usuario
//con db.all obtenemos un array de objetos, es decir todos
GESTION_URL.get_a_url_espera = function(db,callback)
{
    var sql =   " SELECT "+
                " *  "+
                " FROM gestion_url  "+
                " WHERE (estado=0 OR estado=1) AND julianday('now')- julianday(  "+
                "             substr(fecha_registro,7,4)||'-'||  "+
                "             substr(fecha_registro,4,2)||'-'||  "+
                "             substr(fecha_registro,0,3))<7 "+
                " ORDER BY id DESC ";
    db.all(sql, function(error, rows) {
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
GESTION_URL.get_a_url_espera_buscar = function(db,datos_,callback)
{

    var where_sql="";
    if (datos_.nombre_steem!="") {
        where_sql = where_sql + " AND nombre_steem = '"+datos_.nombre_steem+"' ";
    };
    var dias_sql = (datos_.dias_post)? datos_.dias_post : 7 ;

    var sql =   " SELECT "+
                "   *  "+
                " FROM gestion_url  "+
                " WHERE  (estado=0 OR estado=1) AND julianday('now')- julianday(  "+
                "             substr(fecha_registro,7,4)||'-'||  "+
                "             substr(fecha_registro,4,2)||'-'||  "+
                "             substr(fecha_registro,0,3))<"+dias_sql+" "+where_sql;
    console.log(sql);
    db.all(sql, function(error, rows) {
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

GESTION_URL.get_a_url_votacion = function(db,callback)
{
    var sql =   " SELECT "+
                " *  "+
                " FROM gestion_url  "+
                " WHERE estado=3 AND julianday('now')- julianday(  "+
                "             substr(fecha_registro,7,4)||'-'||  "+
                "             substr(fecha_registro,4,2)||'-'||  "+
                "             substr(fecha_registro,0,3))<7 "+
                " ORDER BY id DESC ";
    db.all(sql, function(error, rows) {
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
GESTION_URL.get_a_url_votacion_buscar = function(db,datos_,callback)
{

    var where_sql="";
    if (datos_.nombre_steem!="") {
        where_sql = where_sql + " AND nombre_steem = '"+datos_.nombre_steem+"' ";
    };
    var dias_sql = (datos_.dias_post)? datos_.dias_post : 7 ;

    var sql =   " SELECT "+
                "   *  "+
                " FROM gestion_url  "+
                " WHERE estado=3 AND julianday('now')- julianday(  "+
                "             substr(fecha_registro,7,4)||'-'||  "+
                "             substr(fecha_registro,4,2)||'-'||  "+
                "             substr(fecha_registro,0,3))<"+dias_sql+" "+where_sql;
    console.log(sql);
    db.all(sql, function(error, rows) {
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

GESTION_URL.get_a_url = function(db,callback)
{
    var sql =   " SELECT "+
                " *  "+
                " FROM gestion_url  "+
                " WHERE estado=2 AND julianday('now')- julianday(  "+
                "             substr(fecha_votacion,7,4)||'-'||  "+
                "             substr(fecha_votacion,4,2)||'-'||  "+
                "             substr(fecha_votacion,0,3))<7 "+
                " ORDER BY id DESC ";
    db.all(sql, function(error, rows) {
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
GESTION_URL.get_a_url_buscar = function(db,datos_,callback)
{
    var where_sql="";
    if (datos_.nombre_steem!="") {
        where_sql = where_sql + " AND nombre_steem = '"+datos_.nombre_steem+"' ";
    };
    var dias_sql = (datos_.dias_post=="")? 7 : datos_.dias_post;
    var sql =   " SELECT "+
                "   *  "+
                " FROM gestion_url  "+
                " WHERE estado=2 AND julianday('now')- julianday(  "+
                "             substr(fecha_votacion,7,4)||'-'||  "+
                "             substr(fecha_votacion,4,2)||'-'||  "+
                "             substr(fecha_votacion,0,3))<"+dias_sql+" "+where_sql;
    console.log(sql);
    db.all(sql, function(error, rows) {
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

GESTION_URL.editar_url = function(db,datos_,callback)
{

    var sql = "UPDATE gestion_url SET estado=?  WHERE id=? ";
    db.run(sql,
            [
                datos_.estado,
                datos_.id_url,
            ],
            function (error) {
                callback(error);    
            });
}
GESTION_URL.reenviar_urls = function(db,datos_,callback)
{

    var sql = "UPDATE gestion_url SET estado=1  WHERE id>=? AND id<=? ";
    db.run(sql,
            [
                datos_.id_url_menor,
                datos_.id_url_mayor,
            ],
            function (error) {
                callback(error);    
            });
}
//----------------------------------------------------------------------------------

GESTION_URL.post_anteriores = function (db,datos_,callback) {
    var sql =   "   SELECT   "+
                "       g_u.id as post_num, "+
                "       g_u.etiqueta || '/@' || g_u.nombre_steem || '/' || g_u.url as url, "+
                "       g_u.nombre_steem as usuario, "+
                "       g_u.cant_voto, "+
                "       g_u.fecha_registro, "+
                "       g_u.fecha_votacion "+
                "   FROM gestion_url AS g_u "+
                "   WHERE g_u.estado=2 AND g_u.fecha_votacion= ?  "+
                "   ORDER BY g_u.cant_voto DESC   "+
                "   LIMIT ?  ";
    var stmt =  db.all(sql,[UTILIDAD.fecha_anterior_(),datos_.resultados],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error, false);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}

GESTION_URL.post_anteriores_num_auto = function (db,callback) {
    var sql =   "   SELECT   "+
                "       COUNT(g_u.id) as num_auto   "+
                "   FROM gestion_url AS g_u "+
                "   WHERE g_u.estado=2 AND g_u.fecha_votacion= ?  ";
    var stmt =  db.get(sql,[UTILIDAD.fecha_anterior_()],
                    function (error,row) {
                    //console.log(error, row);
                    if(error) 
                    {
                        //console.log(error);
                        callback(error, false);
                    }else{
                        if(row) 
                        {
                            callback(error, row);
                        }else{
                            //console.log(error,row);
                            // no hay resultados
                            callback(error, false);
                        }
                    }
                });   
}
//exportamos el modelo para poder utilizarlo con require
module.exports = GESTION_URL;