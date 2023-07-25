const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/agregarUsuario', (req, res) => {
    //console.log(req.body);
    const { nombre, apellido, correo, tipo, estado } = req.body;
    //console.log(nombre, apellido, correo, tipo, estado);
    sql.query`INSERT INTO Usuario (nombre, apellido, correo, id_tipo_usuario, estado, created_at)
        VALUES (${nombre}, ${apellido}, ${correo}, ${tipo}, ${estado}, CURRENT_TIMESTAMP);`
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'Usuario agregado exitosamente!'
        });
    }).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    });
});

router.post('/agregarMedidor', (req, res) => {
    //console.log(req.body);
    const { id, nombre, latitud, longitud} = req.body;
    sql.query`INSERT INTO Medidor (id_medidor, nombre, latitud, longitud)
        VALUES (${id}, ${nombre}, ${latitud}, ${longitud});`
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'Medidor agregado exitosamente!'
        });
    }).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).json(
            {
                message: 'Ocurrió un error al hacer la consulta a la base de datos',
                error: err,
                status : 500
            }
        );
    });
});

router.post('/agregarLectura', (req, res) => {
    //console.log(req.body);
    const { id, medidor, usuario, fechaLectura, repeticion} = req.body;
    sql.query`INSERT INTO Lectura (id_lectura, id_medidor, id_usuario_asignado, 
        fecha_creacion, fecha_proxima_lectura, repeticion, estado)
        VALUES (${id} ,${medidor}, ${usuario}, CONVERT(DATE, GETDATE()), ${fechaLectura}, ${repeticion} , 'P');`
    .then(result => {
        res.status(200).json({
            status: 200,
            message: 'Lectura agregada exitosamente!'
        });
    }).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).json(
            {
                message: 'Ocurrió un error al hacer la consulta a la base de datos',
                error: err,
                status : 500
            }
        );
    });
});

module.exports = router;