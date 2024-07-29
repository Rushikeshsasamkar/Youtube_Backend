import mongoose from "mongoose";

import {DB_NAME} from "../constants.js"

import express from "express"
const app  = express();


const connectDB = async ()=>{
try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n mongoDB connected !! DB host: ${connectionInstance.connection.host}`);
} catch (error) {
    console.error(error)
}

}

export default connectDB;