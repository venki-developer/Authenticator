
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();
const database = process.env.DATABASE;
// console.log(database);

const db = mongoose.connect(database)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

