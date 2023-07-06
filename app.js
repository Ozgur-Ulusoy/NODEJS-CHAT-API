const express = require('express');
const app = express();
const morgan = require('morgan'); //* import morgan // npm install --save-dev morgan
const bodyParser = require('body-parser') //* npm install --save body-parser

app.use(morgan('dev')); //* use morgan to log requests in console
app.use(bodyParser.urlencoded({extended: false})); //* use body-parser to parse urlencoded bodies
app.use(bodyParser.json()); //* use body-parser to parse json bodies

//* CORS error handling
app.use((req, res, next) => { //* set headers to allow CORS
    res.header('Content-Type', 'application/json'); //* allow all origins
    res.header('Access-Control-Allow-Origin', '*'); //* allow all origins
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //* allow headers
    if (req.method === 'OPTIONS') { //* browser always sends OPTIONS request first
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //* allow methods
        return res.status(200).json({}); //* return empty json response
    }
    next(); //* forward request
});

const userRoutes = require('./Api/Routes/user'); //* import auth routes
const messageRoutes = require('./Api/Routes/message'); //* import message routes
const roomRoutes = require('./Api/Routes/room'); //* import room routes

app.use('/user', userRoutes); //* use auth routes
app.use('/message', messageRoutes); //* use message routes
app.use('/room', roomRoutes); //* use room routes 

//? üstteki satırlarda yönlendirme yapılmadıysa hata vericek burda hatayı yakalıyoruz
app.use((req, res, next) => { //* handle errors
    const error = new Error('Not found');
    error.status = 404;
    next(error); //* forward error request
});

app.use((error, req, res, next) => { //* handle errors
    res.status(error.status || 500); //* set status code
    res.json({ //* return json response NOT html
        error: {
            message: error.message
        }
    });
});

module.exports = app;