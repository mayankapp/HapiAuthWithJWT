"use strict"
const Hapi = require('@hapi/hapi');
require('dotenv').config();

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
        verifyOptions: {
            ignoreExpiration: true,    // Enables/Accept Expired Tokens
        }
    });

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