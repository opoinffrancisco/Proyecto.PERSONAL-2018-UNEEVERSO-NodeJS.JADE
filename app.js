var express = require('express');  
var session = require('express-session');  
var path = require('path');
var favicon = require('serve-favicon');
//var favicon = require('static-favicon');
var logger = require('morgan'); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
//var publicacion = require('./routes/publicacion');
var automatizacion = require('./routes/automatizacion');
var configuracion = require('./routes/configuracion');
// PLATAFORMAS 
var plataforma_bot_1 = require('./routes/plataforma_bot/1');
var plataforma_bot_2 = require('./routes/plataforma_bot/2');
//---------------------------------------------------------

var login = require('./routes/login');
var registrar = require('./routes/registro');
var perfil = require('./routes/perfil');
var seguidores = require('./routes/seguidores');
var siguiendo = require('./routes/siguiendo');
//Utilidades url's 
var liberar_token = require('./routes/liberar_token');
var cuenta = require('./routes/utilidades/cuenta');
var admin = require('./routes/admin/admin');
var admin_usuarios = require('./routes/admin/usuarios');
var admin_novedad = require('./routes/admin/novedad');
var admin_bots = require('./routes/admin/bots');
var auto_espera = require('./routes/admin/auto_espera');
var auto_votacion = require('./routes/admin/auto_votacion');
var automatizados = require('./routes/admin/automatizados');
var opinion_desactivacion = require('./routes/admin/opinion_desactivacion');
var admin_configuracion = require('./routes/admin/configuracion');
var datos = require('./routes/admin/datos');
var datos_externamente = require('./routes/admin/datos_externamente');

var criptonoticias_uneeverso = require('./routes/admin/criptonoticias-por-uneeverso');



var novedad = require('./routes/novedad');
var usuarios = require('./routes/usuarios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('common'));
app.use(express.static(path.resolve(__dirname, '/public')));
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieParser({dbdir: './DB'}));
app.use(session({secret: 'XXXUNEEVERSOXXX', resave: true, saveUninitialized: true}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// EN GENERAL
app.use('/login', login);
app.use('/registro', registrar);

// PARA PUBLICACIONES
// # -> Para publicacion
//app.use('/:etiqueta/@:usuario/:enlace_permanente', publicacion);
//app.use('/:etiqueta/@:usuario/:enlace_permanente#@:usuario_cmt/:enlace_permanente_cmt', publicacion)

// # -> Publicaciones en General
app.use('/', index);
//app.use('/trending/', index);
//app.use('/created/', index);
//app.use('/hot/', index);
//app.use('/promoted/', index);
//app.use('/trending/:etiqueta', index);
//app.use('/created/:etiqueta', index);
//app.use('/hot/:etiqueta', index);
//app.use('/promoted/:etiqueta', index);

app.use('/novedad', novedad);
app.use('/usuarios', usuarios);

// # -> del usuario
//app.use('/@:usuario/feed', index);//post's sin resteemo
//app.use('/@:usuario/blog', index);//post's con resteemo
//URL perfil
app.use('/@:usuario', perfil);
app.use('/@:usuario/automatizacion', automatizacion);
app.use('/@:usuario/configuracion', configuracion);

//Utilidades
    //OBLIGATORIO -> MIGRACIÓN SOLO EN ESTADO DE DESARROLLO
app.use('/liberar_token', liberar_token);
app.use('/cuenta', cuenta);
app.use('/admin', admin);
app.use('/admin/usuarios', admin_usuarios);
app.use('/admin/novedad', admin_novedad);
app.use('/admin/bots', admin_bots);
app.use('/admin/auto_espera', auto_espera);
app.use('/admin/auto_votacion', auto_votacion);
app.use('/admin/automatizados', automatizados);
app.use('/admin/opinion_desactivacion', opinion_desactivacion);
app.use('/admin/configuracion', admin_configuracion);
app.use('/admin/migrar-datos', datos);
app.use('/migrar-datos', datos_externamente);
app.use('/criptonoticias-por-uneeverso', criptonoticias_uneeverso);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
