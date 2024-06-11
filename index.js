const express = require('express');
const mongoose = require('mongoose');
const Database = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors')

const { options } = require('./routes/userRoutes');


const app = express();



const corsOptions ={
    origin : true,
    credentials : true,
    optionSuccessStatus : 200
 }

 app.use(cors(corsOptions))


app.use(express.json())


dotenv.config()

Database()


const PORT = process.env.PORT;

app.get('/Lensify',(req,res)=>{
    res.send('Test API is working!....')
}) 


app.use('/api/user', require('./routes/userRoutes'))

app.use('/api/products', require('./routes/productRoutes'))


app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT} !`)
}) 
