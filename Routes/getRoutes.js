const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/getReportesNoAsignados', (req, res) => {
    sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estadoNuevo, created_at, latitud, longitud, prioridad
        FROM Reporte
        WHERE estadoNuevo = 'C'`
    .then(result => {
      res.json(result.recordset); // Enviamos los resultados en formato JSON
    }).catch(err => {
      console.error("Error al hacer consulta:", err);
      res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    });
});

router.get('/getReportesAsignados', (req, res) => {
    sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estadoNuevo, created_at, latitud, longitud, prioridad
        FROM Reporte
        WHERE estadoNuevo != 'C' and estadoNuevo != 'F'`
    .then(result => {
      res.json(result.recordset);
    }).catch(err => {
      console.error("Error al hacer consulta:", err);
      res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    });
});

router.get('/getReportesFinalizados', (req, res) => {
    sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estadoNuevo, created_at, latitud, longitud, prioridad
        FROM Reporte
        WHERE estadoNuevo != 'F'`
    .then(result => {
      res.json(result.recordset);
    }).catch(err => {
      console.error("Error al hacer consulta:", err);
      res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
    });
});

module.exports = router;