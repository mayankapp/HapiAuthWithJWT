const db = require('../config/db');
const { ObjectId } = require('mongodb');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const createMovie = async (req, h) => {
    try {
        await db.get().collection('movies').insertOne(req.payload);
        return { success: "Movie Created Successfully!!" };
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const getAllMovie = async (req, h) => {
    try {
        return await db.get().collection("movies").find({}).sort({ name: 1}).toArray();
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const getOneMovie = async (req, h) => {     
    try {
        const _id = new ObjectId(req.params.id);
        const data = await db.get().collection("movies").findOne({ _id });
        return h.response({ success: data });
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const searchMovie = async (req, h) => {
    try {
        const { movieName, generic } = req.query;
        let condition = [];
        if (movieName) condition.push({ $match: { name: movieName } });
        if (generic) condition.push({ $match: { generic: generic } });
        const data = await db.get().collection("movies").aggregate(condition).toArray();
        return h.response({ success: true, data }).code(200);
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const updateMovie = async (req, h) => {
    try {
        const _id = new ObjectId(req.params.id);
        await db.get().collection("movies").updateOne({ _id }, { $set: req.payload });
        return h.response({ success: "Movie updated successfully!!" });
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
    
}

const deleteMovie = async (req, h) => {
    try {
        const _id = new ObjectId(req.params.id);
        await db.get().collection("movies").deleteOne({ _id });
        return h.response({ success: "Movie Deleted Successfully!!" });
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const createUser = async (req, h) => {
    try {
        let { name, email, password, confirmPassword } = req.payload;
        if (!confirmPassword) {
            return h.response({ error: "Confirm Password must be required" }).code(400);
        } else {
            const user = await db.get().collection('users').findOne({ email });
            if (user) return h.response({ error: "User Already Exist!!" }).code(400);
            password = await Bcrypt.hash(password, 10); 
            await db.get().collection('users').insertOne({ name, email, password });
            return h.response({ success: "User Created Successfully!!"}).code(400)
        }
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const loginUser = async (req, h) => {
    try {
        const { email, password } = req.payload;
        const user = await db.get().collection('users').findOne({ email });
        if (!user) return h.response({ error: "User not Registered!!" }).code(400);
        const isMatch = await Bcrypt.compare(password, user.password);
        if (!isMatch) return h.response({ error: "Invalid Credentials!!" }).code(400);
        const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        await db.get().collection('users').updateOne({ _id: user._id }, { $set: { token: token } });
        
        return h.response({ success: "User Login Successfully!!", token }).code(200);
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const logoutUser = async (req, h) => {
    try {
        return Boom.unauthorized("You are Successfully logged out!!");
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const aboutPage = async ({ auth }, req, h) => {
    try {
        console.log("Hello ", auth.credentials.name);
        return { success: `Hello ${auth.credentials.name}` };
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

module.exports = {
    createMovie,
    getAllMovie,
    getOneMovie,
    searchMovie,
    updateMovie,
    deleteMovie,
    createUser,
    loginUser,
    logoutUser,
    aboutPage
}