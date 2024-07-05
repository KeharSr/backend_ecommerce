const express = require('express');
const mongoose = require('mongoose');
const Database = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors')

const fileUpload = require('express-fileupload');

const { options } = require('./routes/userRoutes');


const app = express();



const corsOptions ={
    origin : true,
    credentials : true,
    optionSuccessStatus : 200
 }

 app.use(cors(corsOptions))


app.use(express.json())

app.use(fileUpload());

app.use(express.static('./public'));



dotenv.config()

Database()


const PORT = process.env.PORT;

app.get('/Lensify',(req,res)=>{
    res.send('Test API is working!....')
}) 


app.use('/api/user', require('./routes/userRoutes'))

app.use('/api/product', require('./routes/productRoutes'))

app.use('/api/cart', require('./routes/cartRoutes'))







app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT} !`)
}) 
