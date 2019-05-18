var http = require("http");

var manejador = function (solicitud, respuesta) {
	console.log("hola mundo");
};

var servidor = http.createServer(manejador);

servidor.listen(6677);