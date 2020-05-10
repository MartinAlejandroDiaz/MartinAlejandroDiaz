const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var SEED = require('../config/config');

const app = express();
const Usuario = require('../models/usuario');
// Rutas
app.post('/', (req, res, next) => {
    const body = req.body
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: `Credenciales inconrrectas`,
                errors: {
                    message: `Credenciales inconrrectas`
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: `Credenciales inconrrectas`,
                errors: {
                    message: `Credenciales inconrrectas`
                }
            });
        }
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 hs
        res.status(200).json({
            ok: true,
            body,
            id: usuarioDB.id,
            usuario: usuarioDB,
            token
        })
    })
})

module.exports = app;