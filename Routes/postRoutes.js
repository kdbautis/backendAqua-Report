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
        res.status(200).send('Usuario agregado exitosamente!');
    }).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    });
});

module.exports = router;