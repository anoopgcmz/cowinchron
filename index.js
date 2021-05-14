const express = require('express')
const cors = require('cors');

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Defining Route
const routes = require('./route')
app.use('/',routes)





const port = 3000;

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})