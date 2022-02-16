require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) =>{
    let header;
    console.log(req.headers)
    req.headers['authorization']?
    header = req.headers['authorization']: 
    res.status(401).send('Please add bearer token')
    console.log(header)
    const token = header.split(' ')
    console.log('Token',token[1])
    token[1]?
    jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
        err? res.status(401).json({
            messgae:"Token didn't match",
            error : err    
        }):
        console.log(user)
        next()
    }): res.status(401).send('Authorization token missing')
}

module.exports = verifyJWT