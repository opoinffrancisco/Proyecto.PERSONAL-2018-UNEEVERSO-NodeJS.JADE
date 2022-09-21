var crypto = require("crypto");
var key_master = "CODIGOCLAVE";
var ENCRIPTACION = {};

ENCRIPTACION.encryptUneeverso = function(datos){
  var cipher = crypto.createCipher('aes-256-cbc', key_master);
  var crypted = cipher.update(datos,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

ENCRIPTACION.decryptUneeverso = function(datos){
  var decipher = crypto.createDecipher('aes-256-cbc', key_master);
  var dec = decipher.update(datos,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}



ENCRIPTACION.encrypt = function(text,key_encriptacion){
  var cipher = crypto.createCipher('aes-256-cbc', key_encriptacion);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

ENCRIPTACION.decrypt = function(text, key_desencriptacion){
  var decipher = crypto.createDecipher('aes-256-cbc', key_desencriptacion);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports = ENCRIPTACION;

