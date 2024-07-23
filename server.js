import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js"
import cors from "cors"

// configure env
dotenv.config();

//config database
connectDB();

// rest object 
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

//routes
app.use('/api/v1/auth', authRoutes);

//rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the hindu religious store!</h1>")
})

// port 
const port = process.env.port;


// run listen
app.listen(port, () => {
    console.log(`server is running on port number: ${port}`)
})