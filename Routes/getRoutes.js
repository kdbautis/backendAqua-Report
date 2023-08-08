const express = require('express');
const router = express.Router();
const sql = require('mssql');

//Reportes

router.get('/getReportes', (req, res) => {
  console.log("getReportes");
  sql.query`SELECT r.id_reporte, r.descripcion, r.ubicacion, r.estado, r.estado_nuevo, r.id_usuario_asignado,
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
      WHERE estado_nuevo != 'C' and estado_nuevo != 'F'
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
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre as nombreMedidor, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, fecha_proxima_lectura, id_usuario_asignado,
      users.name as nombre
      FROM Lectura 
      JOIN Medidor 
      ON Lectura.id_medidor = Medidor.id_medidor
      JOIN users
      ON Lectura.id_usuario_asignado = users.id;
      WHERE Lectura.estado != 'F';`
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
  sql.query`SELECT	id_lectura, Lectura.id_medidor, Medidor.nombre, fecha_ultima_lectura, 
      ultima_lectura, fecha_creacion, id_usuario_asignado, users.name as nombre
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

/*
TODO:
  - obtener datos de un usuario x id para el perfil
  */


module.exports = router;