/* const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //autorizacion por header
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('No aunteticado, no hay JWT');
        error.statusCode = 401;
        throw error;
    }

    //obtener token y verificarlo
    const token = authHeader.split(' ')[1]
    let revisarToken;
    try {
        revisarToken = jwt.verify(token, process.env.AUTH_KEY)
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    
    //si es un token valido pero hay algun error
    if(!revisarToken){
        const error = new Error('No aunteticado');
        error.statusCode = 401;
        throw error;
    }
    next();
} */