const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.delete('/eliminarUsuario/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Usuario WHERE id_usuario = ${id};`
    .then(result => {
        res.status(200).send('Usuario eliminado exitosamente!');
    }
    ).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});

router.delete('/eliminarLectura/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Lectura WHERE id_lectura = ${id};`
    .then(result => {
        res.status(200).send('Lectura eliminada exitosamente!');
    }
    ).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});

router.delete('/eliminarReporte/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Reporte WHERE id_reporte = ${id};`
    .then(result => {
        res.status(200).send('Reporte eliminado exitosamente!');
    }
    ).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});

module.exports = router;