const redis = require('redis');
const client = redis.createClient();
/**
 * verificamos el estado de Redis
 */
client.on('connect', function () {
    console.log('Redis conectado');
});

client.on('error', function (err) {
    console.log('Error al conectarse con redis : ' + err);
});

/**
 * Registra la region mas su latitud y longitud
 */
exports.post_lat_lon = function (region, coors) {
    client.hset('Regiones', region, JSON.stringify(coors),  function(err, reply) {
        if(err) {
        console.error(err);
        } else {
        console.log(reply);
        }
    });
};

/**
 * Retorna la latitud y longitud según la region
 */
exports.get_lat_lon = function (region) {

    return new Promise(function(resolve, reject) {
        client.hmget('Regiones', region, function(error, resultado) {
            if(error) {
                reject(error);
            } else {
                resolve(resultado);
            }    
        });
    });
};

/**
 * Registramos los errores de los request
 */
