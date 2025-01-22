const {User} = require('../models/User');
const jwt = require('jsonwebtoken');

async function authTokenCheck(req, res,next){
    const {authToken} = req.cookies;

    try{
        if(!authToken){
            return res.status(401).send("Please Login.");
        }
        
        var decoded = jwt.verify(authToken, 'Secret');
        
        var user = await User.findOne({_id: decoded._id});
        req.user=user;
        next();
        
    }catch(err){
        res.status(401).send("ERROR : "+err);
    }
}

module.exports = {authTokenCheck}