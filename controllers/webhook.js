
const redis = require('./../models/modelo');
const fs = require('fs');
const moment = require('moment-timezone');

var controlador = require('../controllers/controlador');
var regiones = JSON.parse(fs.readFileSync('./utils/regiones.json'));

const tasa_fallo_random = () => {
  if(Math.random(0, 1) < 0.1){
      throw new Error('How unfortunate! The API Request Failed') 
  }
}
const get_informacion_region = async function(){

    var respuesta = [];
    for (let clave in regiones.region){
      try{
        tasa_fallo_random();
        let region = regiones.region[clave]['nombre'];
        let info = await controlador.get_hora_temperatura(region);
        respuesta.push(info);
      }catch(e){
          console.error('Error con la request, intentanto nuevamente...');
          timestamp = moment().unix();
          redis.post_error(timestamp, {'error' : e.message });
          return get_informacion_region();
      }
      
    };

    return respuesta;
}

module.exports = {get_informacion_region};