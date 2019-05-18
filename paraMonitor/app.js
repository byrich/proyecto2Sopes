/*var http = require("http");

var manejador = function (solicitud, respuesta) {
	console.log("hola mundo");
};

var servidor = http.createServer(manejador);

servidor.listen(6677);
*/

var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/holam',function (req, res) {
	resstatus(200).send('Hola desde una ruta');
});

server.listen(6677,function () {
	console.log("ze");
});