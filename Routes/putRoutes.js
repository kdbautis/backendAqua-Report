const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.put('/editarUsuario/:id', (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    //console.log(id);
    //console.log(updateData);
  
    const updatePromises = [];
  
    //#region 
    if (updateData.nombre) {
      updatePromises.push(
        sql.query`UPDATE Usuario SET nombre = ${updateData.nombre}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
      );
    }
  
    if (updateData.apellido) {
      updatePromises.push(
        sql.query`UPDATE Usuario SET apellido = ${updateData.apellido}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
      );
    }
  
    if (updateData.correo) {
      updatePromises.push(
        sql.query`UPDATE Usuario SET correo = ${updateData.correo}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
      );
    }
  
    if (updateData.tipo) {
      updatePromises.push(
        sql.query`UPDATE Usuario SET id_tipo_usuario = ${updateData.tipo}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
      );
    }
  
    if (updateData.estado) {
      updatePromises.push(
        sql.query`UPDATE Usuario SET estado = ${updateData.estado}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
      );
    }
    //#endregion
  
    Promise.all(updatePromises)
      .then(() => {
        res.status(200).send('Usuario editado exitosamente!');
      })
      .catch((err) => {
        console.error("Error al hacer consulta:", err);
        res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
      });
});

router.put('/reasignarUsuarioLectura/:id', (req, res) => {
  const id = req.params.id;
  const id_usuario_asignado = req.body.id_usuario_asignado;
  
  sql.query`UPDATE Lectura SET id_usuario_asignado = ${id_usuario_asignado} WHERE id_lectura = ${id}`
  .then(result => {
    res.status(200).send('Usuario reasignado exitosamente!');
  }
  ).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  }
  );
});

router.put('/reasignarUsuarioReporte/:id', (req, res) => {
  const id = req.params.id;
  const id_usuario_asignado = req.body.id_usuario_asignado;
  
  sql.query`UPDATE Reporte SET id_usuario_asignado = ${id_usuario_asignado} WHERE id_reporte = ${id}`
  .then(result => {
    res.status(200).send('Usuario reasignado exitosamente!');
  }
  ).catch(err => {
    console.error("Error al hacer consulta:", err);
    res.status(500).send('Ocurrió un error al hacer la consulta a la base de datos');
  }
  );
});

module.exports = router;