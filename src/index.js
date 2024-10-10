import dotenv from "dotenv";
import { createClient } from 'redis';
import express from "express";
import fetch from "node-fetch";
import router from './routes.js'; // For default export

// Load environment variables from the .env file
dotenv.config({ path: './.env' });
const app=express();

app.use("/api/v1",router);

const PORT = process.env.PORT || 3000; // You can use 3000 or any other port

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export {app};


