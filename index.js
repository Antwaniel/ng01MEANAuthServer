const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();
// console.log(process.env);

// Crear el servidor/aplicacion express
const app = express();


// Base de datos
dbConnection();


// Directorio Publico
app.use( express.static('public'));

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );


// Rutas
// Para configurar rutas se usa el midlleware de express
// UN middleware es una funcion que se ejecuta cuando el interprete pase evaluando cada linea de codigo de este archivo
// use: es el middlware
app.use('/api/auth', require('./routes/auth'));



// Levantar express server
app.listen( process.env.PORT, () => {
    console.log(`Servidor corrinendo el puerto ${ process.env.PORT }`);
} );