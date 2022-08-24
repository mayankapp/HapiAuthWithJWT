const Joi = require('joi');
const movieController = require("../controllers/movieController");

const routes = [
    {
        method: 'GET',
        path: '/movie',
        handler: movieController.getAllMovie,
        options: {
            description: "Get all Movies",
            tags: ['api'],
            auth: {
                strategy: 'jwt',
            }
        }
    },
    {
        method: 'POST',
        path: '/movie/create',
        handler: movieController.createMovie,
        options: {
            description: "Create a Movie",
            tags: ['api'],
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
        path: '/movie/{id}',
        handler: movieController.getOneMovie,
        options: {
            description: "Get One Movies",
            tags: ['api'],
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
        method: 'GET',
        path: '/movie/search',
        handler: movieController.searchMovie,
        options: {
            description: "Search Movie",
            notes: "Enter Movie Name",
            tags: ['api'],
            auth: {
                strategy: 'jwt'
            },
            validate: {
                query: Joi.object({
                    movieName: Joi.string(),
                    generic: Joi.string()
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/movie/update/{id}',
        handler: movieController.updateMovie,
        options: {
            description: "Update a Movie",
            tags: ['api'],
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
        path: '/movie/delete/{id}',
        handler: movieController.deleteMovie,
        options: {
            description: "Delete a Movie",
            tags: ['api'],
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
        path: "/user/register",
        handler: movieController.createUser,
        options: {
            description: "Register a User",
            tags: ['api','user'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().required().email(),
                    password: Joi.string().required(),
                    confirmPassword: Joi.ref('password')
                }),
                failAction: (request, h, error) => {
                    return h.response({ message: error.details[0].message.replace(/['"]+/g, '') }).code(400).takeover();
                }
            }
        }
    },
    {
        method: 'POST', 
        path: '/user/login',
        handler: movieController.loginUser,
        options: {
            description: "Login a User",
            tags: ['api','user'],
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
        path: '/user/logout',
        handler: movieController.logoutUser,
        options: {
            description: "Logout a User",
            tags: ['api','user'],
        }
    },
    {
        method: 'GET',
        path: '/about',
        handler: movieController.aboutPage,
        options: {
            description: "About Page",
            tags: ['api'],
            auth: {
                strategy: 'simple',
            }
        }
    }
]

module.exports = routes;




