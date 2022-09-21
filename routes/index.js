var ENCRIPTACION = require("../routes/utilidades/encriptacion");
var DBCONEXION = require('../mod/conexion');
var conexion_db_ON;
var NOVEDAD = require('../mod/novedad');
var USUARIO = require('../mod/usuario');
var CONFIGURACION = require('../mod/configuracion');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    //res.render('index.jade');
    DBCONEXION.iniciar_conexion(function (conexion_db) {
        if (conexion_db!=false) {
            conexion_db_ON = conexion_db;
            NOVEDAD.all_web(conexion_db_ON,{desde:0,limite:6},function(err_0,result_0){
                //console.log(err_0,result_0);
                if(err_0)
                {
                    res.json(err_0);
                }else{          
                    res.render('index.jade', {
                        datos : { result : result_0 },
                    });
                }
            });
        };
    });
});

router.get('/noexiste:pagina_sin_existencia', function(req, res) {
    res.render('error_noexiste.jade',{
            message: "err.message",
            error: "sin datos"
        });
});
router.get('volver', function(req, res) {
   // res.render('index.jade');
});



router.get('/:etiqueta/@:usuario/:enlace_permanente', function(req_, res_) {
    res_.render('publicacion.jade',{
        result_disponibilidad : true,
        etiquera_url : req_.params.etiqueta,
        usuario_url : req_.params.usuario,
        enlace_permanente : req_.params.enlace_permanente,
        activar_form_respuesta : false,
    });
});

router.get('/:etiqueta/@:usuario/:enlace_permanente/responder', function(req_, res_) {
    res_.render('publicacion.jade',{
        result_disponibilidad : true,
        etiquera_url : req_.params.etiqueta,
        usuario_url : req_.params.usuario,
        enlace_permanente : req_.params.enlace_permanente,
        activar_form_respuesta : true,

    });
});

router.post('/autorizacion-steem-registro', function(req, res) {
    //res.render('index.jade');
    DBCONEXION.iniciar_conexion(function (conexion_db) {
        if (conexion_db!=false) {
            conexion_db_ON = conexion_db;
            USUARIO.migracion_autorizacion(conexion_db_ON,req.body.nombre_steem,function(err_00,result_00){
                //console.log(err_0,result_0);
                if(err_00)
                {
                    res.json({
                        error : true,
                        error_m : err_00,
                        mensaje : "Error al migrar la autorización."
                    }); 
                }else{    
                    res.json({
                        error : false,
                    });                  
                }
            });
        };
    });
});

router.post('/autorizacion-steem', function(req, res) {
    //res.render('index.jade');
    DBCONEXION.iniciar_conexion(function (conexion_db) {
        if (conexion_db!=false) {
            conexion_db_ON = conexion_db;
            USUARIO.migracion_autorizacion(conexion_db_ON,req.body.nombre_steem,function(err_00,result_00){
                //console.log(err_0,result_0);
                if(err_00)
                {
                    res.json({
                        error : true,
                        error_m : err_00,
                        mensaje : "Error al migrar la autorización."
                    }); 
                }else{    
                    CONFIGURACION.get_cfg(conexion_db_ON,function(err__,result__){
                        //console.log(err_0,result_0);
                        if(err__)
                        {
                            res.json(err__);
                        }else{      
                            USUARIO.get_u_nombre(conexion_db_ON,{nombre_steem:req.body.nombre_steem},function(err_0,result_0){
                                //console.log(err_0,result_0);
                                if(err_0)
                                {
                                    res.json(err_0);
                                }else{
                                    if (result_0==false) {
                                        res.json({
                                                    error : true,
                                                    error_m : err_0,
                                                    mensaje : "El usuario no existe en uneeverso"
                                                });
                                    }else{
                                        res.json({
                                                error : false,
                                                datos : result_0,
                                                token : ENCRIPTACION.encryptUneeverso(JSON.stringify({ id: result_0.id,
                                                          nombre_steem: result_0.nombre_steem,
                                                          auto_upvotes: result_0.auto_upvotes,
                                                          correo_electronico: result_0.correo_electronico,
                                                          id_perfil: result_0.id_perfil,
                                                          cant_steem_power_auto: result_0.cant_steem_power_auto,
                                                          votos_dia: result_0.votos_dia,
                                                          fecha_votos_limitado: result_0.fecha_votos_limitado,
                                                          estado_votacion: result_0.estado_votacion,
                                                          fecha_registro: result_0.fecha_registro,
                                                          votos_error_dia:result_0.votos_error_dia,
                                                          limite_votos_dia: result_0.limite_votos_dia,
                                                          wif_sin_migrar : result_0.wif_post_priv_steem,
                                                          wif_post_priv_steem : result__.promotor_wif_priv_posting,
                                                        }))
                                            });
                                    }
                                }
                            });
                        }
                    });                    
                }
            });
        };
    });
});

router.post('/add-token-push', function(req, res) {
    DBCONEXION.iniciar_conexion(function (conexion_db) {
        if (conexion_db!=false) {
            conexion_db_ON = conexion_db;
            USUARIO.add_token_push(conexion_db_ON,req.body,function(err_00,result_00){
                //console.log(err_0,result_0);
                if(err_00)
                {
                    res.json({
                        error : true,
                        error_m : err_00,
                        mensaje : "Error al agregar el token de notificación push."
                    }); 
                }else{    
                    res.json({
                        error : false,
                    });                  
                }
            });
        };
    });
});





module.exports = router;
