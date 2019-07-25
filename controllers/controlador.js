const redis = require('./../models/modelo');
const request = require('request');

var api_url = 'https://api.darksky.net/forecast/883d52603767cd031f94617c065f584c/';

exports.get_hora_temperatura = async function(region) {
    /**
     * buscamos la data de la region
     */
    try {
        let datos = await redis.get_lat_lon('Santiago');
        datos = JSON.parse(datos);
        let endpoint = api_url + datos.lat + ',' + datos.lon;
        request(endpoint, function (error, response, body) {

            /*if (Math.rand(0, 1) < 0.1) {
                throw new Error('How unfortunate! The API Request Failed');
            }*/

            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.

            body = JSON.parse(body);
            // funcion (°F − 32) × 5/9 = °C
            let celsius = (parseFloat(body.currently.temperature) - parseInt(32)) * 5/9;
            let respuesta = {
                "hora": body.currently.time,
                "temperatura": celsius
            };
            console.log(respuesta);
        });

    } catch(err) {
        console.error(err);
    }
};
