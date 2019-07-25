const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
// iniciamos la conexion con redis-serve
const redis_client = require('./models/modelo');
const PORT = 3000;

app.use(express.static(path.join(__dirname, "/views")))

// cargamos las regiones a redis
let regiones = JSON.parse(fs.readFileSync('./utils/regiones.json'));

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

//console.log(redis_client.get_lat_lon('CL'));

app.get('/', function (req, res) {
  res.render('index');
});

var controlador = require('./controllers/controlador');
app.get('/api', function (req, res) {
    res.send(controlador.get_hora_temperatura());
});
// iniciamos la instancia de express
app.listen(PORT, function () {
  console.log('Servidor express: puerto ' + PORT);
});
