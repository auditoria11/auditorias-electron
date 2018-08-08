// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('dotenv').config();
const path          = require('path');
const express       = require('express');
const app           = express();
var cors            = require('cors');
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var bodyParser      = require('body-parser');


process.env.JWT_SECRET = 'FB2ywB21v60UosPDYcO7HiVQkQZcFhbQ';

if (!process.env.NODE_PORT) {
	process.env.NODE_PORT = 8787;
}


app.use(cors());
app.use(bodyParser.json()); // Para recibir json desde Angular
app.use("/images", express.static(path.join(__dirname, 'app/images')));




app.get('/', function(req, res){
	res.writeHead(301,
		{ Location: 'app/dist_front/' }
	);
	res.end();
});
	






var User            = require(path.join(__dirname, 'app/conexion/Models/User'));
var db              = require(path.join(__dirname, '/app/conexion/connWeb'));







// Para las fechas
window.fixDate = function(fec){
	dia   = fec.getDate();
	mes   = (fec.getMonth() + 1 );
	year  = fec.getFullYear();
  
	if (dia < 10) {
	  dia = '0' + dia;
	}
  
	if (mes < 10) {
	  mes = '0' + mes;
	}
  
	fecha   = '' + year + '-' + mes  + '-' + dia;
  
	return fecha;
}
  