// require('dotenv').config({path: './.env'}); // Load's environment variables from .env file and makes them available everywhere required in the application. :: "As early as possible import the dotenv file and configure it"
//import syntax for dotenv is an experimental feature, so to use that we have to configure it in package.json as ""dev": "nodemon -r dotenv/config --experimental-json-modules src/server.js""

import dotenv from "dotenv"
import connectMongoDb from "./core/database/mongo.connection.js";
import connectRedis from "./core/database/redis.connection.js";
import connectVectorDb from "./core/database/vector.connection.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

connectMongoDb()
//application is starting to listen only when the required databases are connected
.then(() => connectRedis())
.then(() => connectVectorDb())
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.error(`Startup failed: ${error}`);
});
