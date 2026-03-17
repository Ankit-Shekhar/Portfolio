import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import projectRoutes from "./modules/projects/project.routes.js";
import timelineRoutes from "./modules/timeline/timeline.routes.js";
import aiAgentRoutes from "./modules/ai-agent/agent.routes.js";
import { errorHandler } from "./core/middlewares/error.middleware.js";
import { getRedisClient } from "./core/database/redis.connection.js";
import { getVectorClient } from "./core/database/vector.connection.js";


const app = express();

// app.use -> .use is used to deal with Middlewares and Configurations.
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8000",
    credentials: true
}));

//configuring the limit of Json that can be accepted. This data comes from user filled forms. Form data comes as json
app.use(express.json({
    limit: "16kb"
}));

//with extended we can send nested objects in the request body, not highly used. This config tells express that data may also come from url, so handle that as well : mostly this data comes because of the GET request.
app.use(express.urlencoded({extended: true, limit: "16kb"}));

//used to store static files like images, css, js, etc. within my local server in public named file, used while dealing with multer and Cloudinary file uploads
app.use(express.static("public"));

//cookie parser is used to read imp cookies from users browser and update them as well, basically performing CRUD ops over the users cookies
app.use(cookieParser());



//routes import
// import userRouter from './routes/user.routes.js'

//before when we satrted the course we had all the routes and their controllers in a single file only, but now since we have separated routes and controllers into different files, we have to import the routes here in app.js as middlewares.
//as now we have separated routes and controllers, so we have to import the routes as Middlewares, and so we use "app.use()"
//when the "users" endpoint will be hitted the control will be passed to "userRouter" and it will take us to "user.route.js"

// app.use("/api/v1/users", userRouter) //this creates the url: http://localhost:8000/api/v1/users/register

// health endpoint tells if server is up or not
app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

// readiness endpoint tells if required services are connected and ready
app.get("/api/v1/readiness", (req, res) => {
    const mongoReady = mongoose.connection.readyState === 1;
    const redisReady = Boolean(getRedisClient()?.isOpen);
    const vectorReady = Boolean(getVectorClient());

    const allReady = mongoReady && redisReady && vectorReady;

    return res.status(allReady ? 200 : 503).json({
        success: allReady,
        message: allReady ? "All services are ready" : "One or more services are not ready",
        services: {
            mongo: mongoReady,
            redis: redisReady,
            vectorDb: vectorReady
        }
    });
});

//project module routes
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/timeline", timelineRoutes);
app.use("/api/v1/ai-agent", aiAgentRoutes);

// global error handler middleware should be mounted after all routes
app.use(errorHandler);

export { app }