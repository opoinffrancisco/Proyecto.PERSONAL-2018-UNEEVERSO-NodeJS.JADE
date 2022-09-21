var moment = require('moment-timezone');
//moment().tz("America/Bogota").format('DD-MM-YYYY hh:mm:ss A')
var UTILIDAD = {};

UTILIDAD.fecha_anterior_ = function () {
	//var d = new Date();
	//return d.getDate()+'/'+d.getMonth()+1+'/'+d.getFullYear();
	return moment().tz("America/Bogota").subtract(1, 'days').format('DD/MM/YYYY')
}

UTILIDAD.fecha_actual_ = function () {
	//var d = new Date();
	//return d.getDate()+'/'+d.getMonth()+1+'/'+d.getFullYear();
	return moment().tz("America/Bogota").format('DD/MM/YYYY')
}
UTILIDAD.hora_actual_ = function () {
	return moment().tz("America/Bogota").format('hh A');
} 

UTILIDAD.fecha_y_hora_actual_ = function () {
	//var d = new Date();
	//return d.getDate()+'/'+d.getMonth()+1+'/'+d.getFullYear();
	//-05:00
	return moment().tz("America/Bogota").format('YYYY/MM/DD hh:mm:ss A')
}

/*
	*****************  servidor/configuracion global STEEM : Europa / Dublin  *****************
*/
UTILIDAD.fecha_actual_STEEM_ = function () {
	//var d = new Date();
	//return d.getDate()+'/'+d.getMonth()+1+'/'+d.getFullYear();
	return moment().tz("Europe/Dublin").format('DD/MM/YYYY')
}
UTILIDAD.hora_actual_STEEM_ = function () {
	return moment().tz("Europe/Dublin").format('hh A');
} 

UTILIDAD.fecha_y_hora_actual_STEEM_ = function () {
	//var d = new Date();
	//return d.getDate()+'/'+d.getMonth()+1+'/'+d.getFullYear();
	//-05:00
	return moment().tz("Europe/Dublin").format('YYYY/MM/DD hh:mm:ss A')
}

module.exports = UTILIDAD;