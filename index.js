const express = require('express'), http = require('http');
const app = express();
const path = require('path');
const fs = require('fs');

const server = http.createServer(app);
const io = require('socket.io').listen(server);

// iniciamos la conexion con redis-serve
const redis_client = require('./models/modelo');
const PORT = 3000;

app.use(express.static(path.join(__dirname, "/views")))

// cargamos las regiones a redis
var regiones = JSON.parse(fs.readFileSync('./utils/regiones.json'));

// Obteniendo todas las claves del JSON
for (let clave in regiones.region){
  
  let nombre = regiones.region[clave]['nombre'];
  let coors = {
    "lat": regiones.region[clave]['lat_lon']['lat'],
    "lon": regiones.region[clave]['lat_lon']['lon'],
    "codigo": regiones.region[clave]['codigo']
  };
  redis_client.post_lat_lon(nombre, coors);
}


// iniciamos la instancia de express
server.listen(PORT, function () {
  console.log('Servidor express en el puerto ' + PORT);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var webhook = require('./controllers/webhook');
app.get('/api', async function (req, res) {
  let resultado = await webhook.get_informacion_region();
  res.send(resultado);
});

io.on('connection', function (socket) {

  socket.on('emit', function(){
    webhook.get_informacion_region().then(function(res){
      socket.emit('evento', res);
    });
  });
  /*
  setInterval( async function(){
    webhook.get_informacion_region().then(function(res){
      socket.emit('evento', res);
    });
  }, 10000);
  */
});