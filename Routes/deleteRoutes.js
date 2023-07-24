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


module.exports = router;