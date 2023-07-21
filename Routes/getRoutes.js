const express = require('express');
const router = express.Router();
const sql = require('mssql');

//Reportes
router.get('/getReportes', (req, res) => {
  console.log("getReportes");
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad
      FROM Reporte`
  .then(result => {
    res.json(result.recordset); // Enviamos los resultados en formato JSON
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getReportesNoAsignados', (req, res) => {
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad
      FROM Reporte
      WHERE estado_nuevo = 'C';`
  .then(result => {
    res.json(result.recordset); // Enviamos los resultados en formato JSON
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getReportesAsignados', (req, res) => {
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad
      FROM Reporte
      WHERE estado_nuevo != 'C' and estado_nuevo != 'F';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getReportesFinalizados', (req, res) => {
  //console.log("getReportesFinalizados");
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad
      FROM Reporte
      WHERE estado_nuevo = 'F';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasPendientes', (req, res) => {
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado,
      Usuario.nombre, Usuario.apellido
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN Usuario
      ON Lectura.id_usuario_asignado = Usuario.id_usuario;
      WHERE Lectura.estado != 'F';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasFinalizadas', (req, res) => {
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, id_usuario_asignado, Usuario.nombre, Usuario.apellido
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN Usuario
      ON Lectura.id_usuario_asignado = Usuario.id_usuario
      WHERE Lectura.estado = 'F';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getUsuarios', (req, res) => {
  sql.query`SELECT id_usuario, nombre, apellido, correo, tipo, Usuario.estado
      FROM Usuario
      JOIN Tipo_Usuario
      ON Usuario.id_tipo_usuario = Tipo_Usuario.id_tipo_usuario;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasPendientes', (req, res) => {
  sql.query`SELECT id_lectura, Medidor.id_medidor, latitud, longitud, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, Usuario.nombre, apellido
      FROM Lectura
      Join Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      Join Usuario
      ON Lectura.id_usuario_asignado = Usuario.id_usuario
      WHERE fecha_proxima_lectura != NULL;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasFinalizadas', (req, res) => {
  sql.query`SELECT id_lectura, Medidor.id_medidor, latitud, longitud, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, Usuario.nombre, apellido
      FROM Lectura
      Join Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      Join Usuario
      ON Lectura.id_usuario_asignado = Usuario.id_usuario
      WHERE fecha_proxima_lectura = NULL;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

module.exports = router;