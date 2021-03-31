//env
require('dotenv').config();

const express = require('express')
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const app = express();
const port = process.env.PORT || 8800;
app.use(express.urlencoded());
app.use(express.json());

//limiter
const apiLimiter = rateLimit({
  windowMs: 3 * 1000, // 3 seconds
  max: 1 // limit each IP to 1 requests per windowMs
});

//import
const {msc} = require('./src/command');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

let message = {}
const mc = new msc();

const pwd = process.env.RANDOM_PWD;

const authToken=(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const verify= (res, query, command)=>{
    if(query){
        if(query.secret === pwd){
            switch(command){
                case "restart": mc.restart(res);break;
                case "start": mc.start(res);break;
                case "stop": mc.stop(res);break;
                case "status": mc.status(res);break;
            }
            return;
        }
    }
    res.send("Access Denied")
}

const generateToken = (user)=>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
}

app.get('/', (req, res) => {
    res.send("te ehe nandayo")
})
app.post('/login', (req, res) => {
    const user = {username: req.body.username}
    if( req && req.body && req.body.secret && req.body.secret === process.env.RANDOM_PWD ){
        const accessToken = generateToken(user)
        console.log('login attempt')
        res.json({token:accessToken})
    }else{
        res.sendStatus(403);
    }
})
app.get('/panel', (req, res) => {
    res.render('index.ejs');
})
app.post('/restart', authToken, apiLimiter, (req, res) => {
    verify(res, req.body, "restart")
})
app.post('/start', authToken, apiLimiter, (req, res) => {
    verify(res, req.body, "start")
})
app.post('/stop', authToken, apiLimiter, (req, res) => {
    verify(res, req.body, "stop")
})
app.get('/status', authToken, (req, res) => {
    verify(res, req.query, "status")
})

app.listen(port, () => {
  console.log(`MC Control App listening at http://localhost:${port}`)
})