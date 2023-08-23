const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.delete('/eliminarUsuario/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM users WHERE id = ${id};`
    .then(result => {
        res.status(200).json(
            {
                status : 200,
                message: 'Usuario eliminado exitosamente!'
            });
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
        res.status(200).json(
            {
                status : 200,
                message: 'Lectura eliminada exitosamente!'
            });
    }
    ).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).json(
            {
                message: 'Ocurrió un error al hacer la consulta a la base de datos',
                error: err,
                status : 500
            });
    }
    );
});

router.delete('/eliminarReporte/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Reporte WHERE id_reporte = ${id};`
    .then(result => {
        res.status(200).json(
            {
                status : 200,
                message: 'Reporte eliminado exitosamente!'
            });
    }
    ).catch(err => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});

router.delete('/eliminarMedidor/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Medidor WHERE id_medidor = ${id};`
    .then(result => {

        res.status(200).json(
            {
                status : 200,
                message: 'Medidor eliminado exitosamente!'
            });
    })
    .catch(err => {

        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});

router.delete('/eliminarLecturasPorMedidor/:id', (req, res) => {
    const id = req.params.id;
    //console.log(id);
    sql.query`DELETE FROM Lectura WHERE id_medidor = ${id};`
    .then(result => {
            
            res.status(200).json(
                {
                    status : 200,
                    message: 'Lecturas eliminadas exitosamente!'
                });
        }
    ).catch(err => {

        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    }
    );
});





module.exports = router;