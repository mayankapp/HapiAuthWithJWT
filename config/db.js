const { MongoClient } = require('mongodb');
let db;
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url);
const main = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Mongo DB Connected successfully to Server');
    } catch (error) {
        console.log(error);
    }
}
exports.dbConnect = () => {
    main();
};

exports.get = () => {
    return db;
};