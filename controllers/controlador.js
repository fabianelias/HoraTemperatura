const redis = require('./../models/modelo');
const request =  require('request');
const moment = require('moment-timezone');

var api_url = 'https://api.darksky.net/forecast/81c9d16eed663e0885ed736184d827c9/';

const tasa_fallo_random = () => {
    if(Math.random(0, 1) < 0.8){
        throw new Error('How unfortunate! The API Request Failed') 
    }
}
  
const get_hora_temperatura =  function(region) {
    return new Promise(async function(resolve, reject){
        let datos = await redis.get_lat_lon(region);
        datos = JSON.parse(datos);
        let endpoint = api_url + datos.lat + ',' + datos.lon + '?units=si';
        request(endpoint, function (error, response, body) {
            if(error){
                reject(error);
            }
            body = JSON.parse(body);
            let temp = '/ '+ Math.round(body.currently.temperature) + 'º';
            let hora = moment.tz(body.hourly.data.time, body.timezone).format('ha');

            let respuesta = {
                "hora": hora,
                "temperatura": temp,
                "codigo": datos.codigo,
            };
            resolve(respuesta);
        });  
    });
};

module.exports = {get_hora_temperatura};