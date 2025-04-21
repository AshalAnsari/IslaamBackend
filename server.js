const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sql = require("./utils/sqlDB")
const quranRoutes = require("./routes/QuranRoutes")

dotenv.config()

const app = express()

const allowedOrigin = 'https://islam247.netlify.app';

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // if you're using cookies or auth headers
}));

app.use(express.json())

app.use("/quran", quranRoutes)

sql.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to MySQL Database: ISLAAM");
    }
});

app.get("/", (req,res) => {
    return res.status(200).json({message: "server is listening"});
})

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Islaam App Backend is Listening to http://${process.env.HOST}:${process.env.PORT}`)
});