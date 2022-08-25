"use strict"
const Hapi = require('@hapi/hapi');
require('dotenv').config();
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

// Database configuration
const db = require('./config/db');
const routes = require('./routes/route');

// Middleware configuration
const { validateBasic, validateJWT }  = require('./middleware/auth');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(require('hapi-auth-jwt2'));
    await server.register(require('@hapi/basic'));
    server.auth.strategy('simple','basic',{ validate: validateBasic()});
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET_KEY,
        validate: validateJWT(),
        // verifyOptions: {
        //     ignoreExpiration: true,    // Enables/Accept Expired Tokens
        // }
    });

    const swaggerOptions = {
        info: {
            title: 'Swagger of Hapi js APIs',
            version: '1.0.0'
        },
        securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            },
            simple: {
                type: 'basic'
            }
        },
        security: [{ jwt: [] , simple: []}]
    }

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    server.route(routes)
    await db.dbConnect();
    await server.start();
    console.log('Server is running on', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();