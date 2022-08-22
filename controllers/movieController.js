const db = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

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
        return await db.get().collection("movies").find({}).toArray();
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
        if (password !== confirmPassword) {
            return h.response({ error: "Password & Confirm Password are not Matched!!" }).code(400);
        } else {
            const user = await db.get().collection('users').findOne({ email });
            if (user) return h.response({ error: "User Already Exist!!" }).code(400);
            password = await bcrypt.hash(password, 10); 
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
        const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6s' });
        await db.get().collection('users').updateOne({ _id: user._id }, { $set: { token: token } });
        return h.response({ success: "User Login Successfully!!" }).code(200);
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

const aboutPage = async (req, h) => {
    try {
        return h.response("Welcome to the About page!!");
    } catch (error) {
        console.log(error.message);
        return h.response({ error: error.message }).code(400);
    }
}

module.exports = {
    createMovie,
    getAllMovie,
    getOneMovie,
    updateMovie,
    deleteMovie,
    createUser,
    loginUser,
    aboutPage
}