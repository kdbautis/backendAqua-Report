const express = require('express');
const router = express.Router();
const sql = require('mssql');

//Reportes

router.get('/getReportes', (req, res) => {
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;
  const estado = req.query.estado;
  sql.query`SELECT r.id_reporte, r.descripcion, r.ubicacion, r.estado, r.estado_nuevo, r.id_usuario_asignado,
  r.created_at, r.latitud, r.longitud, r.prioridad, r.imagen,
  CASE WHEN r.id_usuario_asignado IS NULL THEN '' ELSE u.name END as nombrePersonal
  FROM Reporte r      
  LEFT JOIN users u ON r.id_usuario_asignado = u.id
  WHERE r.created_at BETWEEN ${fechaInicio} AND ${fechaFin}
  AND r.estado_nuevo = ${estado}
  ORDER BY r.created_at DESC;`

  .then(result => {
    res.json(result.recordset); // Enviamos los resultados en formato JSON
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});
router.get('/getUltimosReportes', (req, res) => {
  const cantidad = req.query.cantidad;
  sql.query`SELECT TOP 5
   r.id_reporte, r.descripcion, r.ubicacion, r.estado, r.estado_nuevo, r.id_usuario_asignado,
  r.created_at, r.latitud, r.longitud, r.prioridad, r.imagen,
  CASE WHEN r.id_usuario_asignado IS NULL THEN '' ELSE u.name END as nombrePersonal
  FROM Reporte r      
  LEFT JOIN users u ON r.id_usuario_asignado = u.id
  ORDER BY r.created_at DESC;`
  .then(result => {
    res.json(result.recordset); // Enviamos los resultados en formato JSON
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getTotalReportes', (req, res) => {
  sql.query`SELECT COUNT(*) as total
      FROM Reporte;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Reportes obtenidos exitosamente!',
      data: result.recordset[0]
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

router.get('/getReportesNoAsignados', (req, res) => {
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad, imagen
      FROM Reporte
      WHERE estado_nuevo = 'C'
      ORDER BY created_at DESC;`
  .then(result => {
    res.json(result.recordset); // Enviamos los resultados en formato JSON
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getReportesAsignados', (req, res) => {
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad, imagen
      FROM Reporte
      WHERE estado_nuevo = 'A'
      ORDER BY created_at DESC;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getReportesFinalizados', (req, res) => {
  //console.log("getReportesFinalizados");
  sql.query`SELECT id_reporte, descripcion, ubicacion, estado, estado_nuevo, created_at, latitud, longitud, prioridad, imagen
      FROM Reporte
      WHERE estado_nuevo = 'F'
      ORDER BY created_at DESC;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

//Lecturas
router.get('/getLecturas', (req, res) => {
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, repeticion,
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado, Lectura.estado as estado,
      users.name as nombrePersonal
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN users
      ON Lectura.id_usuario_asignado = users.id;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lecturas obtenidas exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasPendientes', (req, res) => {
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, repeticion,
  ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado, Lectura.estado as estado,
  users.name as nombrePersonal
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN users
      ON Lectura.id_usuario_asignado = users.id
      WHERE Lectura.estado != 'F' AND fecha_proxima_lectura is not NULL;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lecturas obtenidas exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasFinalizadas', (req, res) => {
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, id_usuario_asignado, users.name as nombrePersonal
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN users
      ON Lectura.id_usuario_asignado = users.id
      WHERE Lectura.estado = 'F';`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lecturas obtenidas exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturaPorId/:id', (req, res) => {
  const id = req.params.id;
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, repeticion,
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado, Lectura.estado as estado, 
      Usuario.nombre as nombrePersonal, Usuario.apellido as apellidoPersonal, latitud, longitud
      FROM Lectura
      JOIN Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN Usuario
      ON Lectura.id_usuario_asignado = Usuario.id_usuario
      WHERE id_lectura = ${id};`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lectura obtenida exitosamente!',
      data: result.recordset[0],
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturaPorIdUsuarioP/:id', (req, res) => {
  const id = req.params.id;
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, repeticion,
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado, Lectura.estado as estado, 
      users.name as nombrePersonal
      FROM Lectura
      JOIN Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN users
      ON Lectura.id_usuario_asignado = users.id
      WHERE id_usuario_asignado = ${id} AND Lectura.estado = 'P';`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lectura obtenida exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturaPorIdUsuarioF/:id', (req, res) => {
  const id = req.params.id;
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, repeticion,
  ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado, Lectura.estado as estado, 
  users.name as nombrePersonal
  FROM Lectura
  JOIN Medidor
  ON Lectura.id_medidor = Medidor.id_medidor
  JOIN users
  ON Lectura.id_usuario_asignado = users.id
  WHERE id_usuario_asignado = ${id} AND Lectura.estado = 'F';`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lectura obtenida exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

//medidor
router.get('/getMedidores', (req, res) => {
  sql.query`SELECT id_medidor, nombre, latitud, longitud
      FROM Medidor;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Medidores obtenidos exitosamente!',
      data: result.recordset,
      total: result.recordset.length
    }
    );
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


//Usuarios

router.get('/getUsuarios', (req, res) => {
  sql.query`SELECT users.id, name as nombre, email, tipo, users.estado, users.id_tipo_usuario
      FROM users
      JOIN Tipo_Usuario
      ON users.id_tipo_usuario = Tipo_Usuario.id_tipo_usuario;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getLecturasPendientes', (req, res) => {
  sql.query`SELECT id_lectura, Medidor.id_medidor, latitud, longitud, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, users.nombre
      FROM Lectura
      Join Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      Join users
      ON Lectura.id_usuario_asignado = users.id
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
      ultima_lectura, fecha_creacion, users.name as nombre
      FROM Lectura
      Join Medidor
      ON Lectura.id_medidor = Medidor.id_medidor
      Join users
      ON Lectura.id_usuario_asignado = users.id
      WHERE fecha_proxima_lectura = NULL;`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getPersonal', (req, res) => {
  sql.query`SELECT id, name as nombre, email, tipo, users.estado
      FROM users
      JOIN Tipo_Usuario
      ON users.id_tipo_usuario = Tipo_Usuario.id_tipo_usuario
      AND Tipo_Usuario.tipo = 'Personal'
      WHERE users.estado = 'A';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getPersonalLectura', (req, res) => {
  sql.query`SELECT id, name as nombre, email, tipo, users.estado
      FROM users
      JOIN Tipo_Usuario
      ON users.id_tipo_usuario = Tipo_Usuario.id_tipo_usuario
      AND Tipo_Usuario.tipo = 'Lectura'
      WHERE users.estado = 'A';`
  .then(result => {
    res.json(result.recordset);
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});

router.get('/getTiposUsuario', (req, res) => {
  sql.query`SELECT id_tipo_usuario as id,
  tipo
      FROM Tipo_Usuario 
      WHERE estado = 'A';`
  .then(result => {
    res.json({
      status: 200,
      message: 'Tipos de usuario obtenidos exitosamente!',
      data: result.recordset
    });
  }).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  });
});


//Graficos
//Reportes x mes
router.get('/getReportesXMes', (req, res) => {
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;
  sql.query`SELECT MONTH(created_at) as mes, YEAR(created_at) as anio, COUNT(*) as cantidad
      FROM Reporte
      WHERE created_at BETWEEN ${fechaInicio} AND ${fechaFin}
      GROUP BY MONTH(created_at), YEAR(created_at);`
  .then(result => {
    res.json({
      status: 200,
      message: 'Reportes obtenidos exitosamente!',
      data: result.recordset,
      total: result.recordset.length
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

//Reportes x mes y año por prioridad
router.get('/getReportesXMesPrioridad', (req, res) => {
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;
  console.log(fechaInicio);
  console.log(fechaFin);
  sql.query`SELECT MONTH(created_at) as mes, YEAR(created_at) as anio, prioridad, COUNT(*) as cantidad
      FROM Reporte
      WHERE created_at BETWEEN ${fechaInicio} AND ${fechaFin}
      AND prioridad IS NOT NULL
      GROUP BY MONTH(created_at), YEAR(created_at), prioridad
      ORDER BY YEAR(created_at), MONTH(created_at);`
  .then(result => {
    res.json({
      status: 200,
      message: 'Reportes obtenidos exitosamente!',
      data: result.recordset,
      total: result.recordset.length
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

//Dias promedio que toma pasar de creado a asignado, asignado a aceptado, aceptado a en curso, en curso a finalizado
router.get('/getDiasPromedio', (req, res) => {
  sql.query`SELECT AVG(DATEDIFF(day, created_at, fecha_asignacion)) as "Creado a Asignado",
  AVG(DATEDIFF(day, fecha_asignacion, fecha_aceptacion)) as "Asignado a Aceptado",
  AVG(DATEDIFF(day, fecha_aceptacion, fecha_encurso)) as "Aceptado a En curso",
  AVG(DATEDIFF(day, fecha_encurso, fecha_finalizo)) as "En curso a Finalizado"
      FROM Reporte
      WHERE fecha_asignacion IS NOT NULL AND fecha_aceptacion IS NOT NULL AND fecha_encurso IS NOT NULL AND fecha_finalizo IS NOT NULL;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Reportes obtenidos exitosamente!',
      data: result.recordset[0],
      total: result.recordset.length
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


//Evolucion de medidor por mes
router.get('/getEvolucionMedidores', (req, res) => {
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;
  const idMedidor = req.query.idMedidor;
  sql.query`SELECT fecha_lectura as fecha, lectura as lectura, Medidor.nombre as nombreMedidor
      FROM Lecturas_Historicas
      JOIN Medidor
      ON Lecturas_Historicas.id_medidor = Medidor.id_medidor
      WHERE fecha_lectura BETWEEN ${fechaInicio} AND ${fechaFin}
      AND Lecturas_Historicas.id_medidor = ${idMedidor}
      AND Lecturas_Historicas.id_medidor = Medidor.id_medidor
      GROUP BY MONTH(fecha_lectura), fecha_lectura, lectura, Medidor.nombre
      ORDER BY fecha_lectura;`
  .then(result => {
    res.json({
      status: 200,
      message: 'Lecturas obtenidas exitosamente!',
      data: result.recordset,
      total: result.recordset.length
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