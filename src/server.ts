import { errorHandler } from "./common/middleware/error.middleware.js";
import http from "http";
import { connectDB } from "./config/db.js";


import dotenv from "dotenv";

dotenv.config({override:true});

import app from "./app.js";

app.use(errorHandler);

// const server=http.createServer(app);

const PORT = process.env.PORT || 9094;
const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || 'localhost';

// ==================== DATABASE CONNECTION ====================
const connectDatabase = async (): Promise<void> => {
    try {
        await connectDB();
        console.log({ message: '✅ MongoDB connected successfully!' });
    } catch (error: any) {
        console.error({ Error: '❌ Database connection failed!' });
        throw error;
    }
};


// ==================== START SERVER ====================
const startServer = async (): Promise<void> => {
    try {

        await connectDatabase();
        // Start Express server
        app.listen(PORT, () => {
            console.log("server started at port :", PORT);
        })
    } catch (error: any) {
        console.log("Error : ", error);

        process.exit(1);
    }
};

startServer();

