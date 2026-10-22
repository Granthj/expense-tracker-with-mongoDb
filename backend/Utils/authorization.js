const jwt = require('jsonwebtoken');

const auth = async(req,res,next)=>{

    
    try{
        const header = req.header('Authorization');
        // console.log(header,'bubububu')
        if(!header){
           return res.status(401).json({message:'No token found'});
        }

        const token = header.split(' ')[1];
       
        const decoded = jwt.verify(token,'expense_userId');
        if(!decoded){
            req.auth = false;
            req.userId = null;
            return;
        }
        else{
            req.auth = true;
            req.userId = decoded.data;
            next();
        }
    }
    catch(err){
        return res.status(401).json({message:'Token is wrong'});
    }
}

module.exports = auth;