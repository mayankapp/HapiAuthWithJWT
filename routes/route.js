const Joi = require('joi');
const movieController = require("../controllers/movieController");

const routes = [
    {
        method: 'POST',
        path: '/createMovie',
        handler: movieController.createMovie,
        options: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    actorName:Joi.string().required(),
                    actressName:Joi.string().required(),
                    generic:Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: movieController.getAllMovie,
        options: {
            auth: {
                strategy: 'jwt',
            }
        }
    },
    {
        method: 'GET',
        path: '/{id}',
        handler: movieController.getOneMovie,
        options: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/updateMovie/{id}',
        handler: movieController.updateMovie,
        options: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    actorName:Joi.string().required(),
                    actressName:Joi.string().required(),
                    generic:Joi.string().required()
                }),
                params: Joi.object({
                    id: Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/deleteMovie/{id}',
        handler: movieController.deleteMovie,
        options: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                params: Joi.object({
                    id: Joi.string()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'POST',
        path: "/register",
        handler: movieController.createUser,
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().required().email(),
                    password: Joi.string().required(),
                    confirmPassword: Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'POST', 
        path: '/login',
        handler: movieController.loginUser,
        options: {
            auth: {
                strategy: 'simple'
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().required().email(),
                    password: Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/about',
        handler: movieController.aboutPage,
        options: {
            auth: {
                strategy: 'jwt',
            }
        }
    }
]

module.exports = routes;




