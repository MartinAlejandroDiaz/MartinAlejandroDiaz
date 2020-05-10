const jwt = require('jsonwebtoken');

var SEED = require('../config/config');

// ===============================
// Verificar token
// ===============================
exports.verificaToken = function(req, res, next){
    app.use('/',(req,res,next)=>{
        var token = req.query.token;
        jwt.verify(token, SEED, (err, decoded)=>{
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Error el usuario o contraseña incorrecto',
                    errors: err                
                });
            }
            req.usuario = decoded.usuario;
            next();
        });
    });
}


