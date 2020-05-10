const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
const Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

// ===============================
// Obtener todos los usuarios
// ===============================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios
                })
            })

});


// ===============================
// Actualizar un usuario
// ===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id: ${usuario.id} no existe`,
                errors: {
                    message: `No existe el usuario ${usuario.id} en la base de datos`
                }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usaurioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error guardando usuarios',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                usuario: usaurioGuardado
            });
        });

    });
});

// ===============================
// Crear un nuevo usuario
// ===============================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;
    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usaurioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usaurioGuardado,
            usuarioToken: req.usuario
        });
    });
});
// ===============================
// Borrar un nuevo usuario
// ===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    const id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id: ${usuario.id} no existe`,
                errors: {
                    message: `No existe el usuario ${usuario.id} en la base de datos`
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});

module.exports = app;