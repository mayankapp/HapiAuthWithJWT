const db = require('../config/db');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const validateJWT = () => {
    return async (decode, req, h) => {
        const _id = new ObjectId(decode._id);
        const user = await db.get().collection('users').findOne({ _id });
        if (!user) return { isValid: false };
        return { isValid: true, credentials: user };
    }    
}

const validateBasic =  () => {
    return async (req, username, password, h) => {
        const user = await db.get().collection('users').findOne({ email: username });
        if (!user) return { isValid: false };
        const isValid = await bcrypt.compare(password, user.password);
        return { isValid , credentials: user};
    };
}

module.exports = {
    validateBasic,
    validateJWT
};