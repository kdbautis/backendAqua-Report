const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.put('/editarUsuario/:id', (req, res) => {
  console.log('eeeeeeeeeeeee',req.body);
    const id = req.params.id;
    const updateData = req.body;
    //console.log(id);
    //console.log(updateData);
  
    const updatePromises = [];
  
    // Agrega la columna `updated_at` en la consulta de actualización
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
    console.log(updatePromises);
  
    Promise.all(updatePromises)
      .then(() => {
        res.status(200).json(
          {
            status : 200,
            message: 'Usuario actualizado exitosamente!',
            data: updateData
          }
        );
      })
      .catch((err) => {
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
  
//Reportes

router.put('/asignarReporte/:id', (req, res) => {
  console.log('eeeeeeeeeeeee',req.body);
    const id = req.params.id;
    const updateData = req.body;
    
    const updatePromises = [];

    if (updateData.idPersonal) {
      updatePromises.push(
        sql.query`UPDATE Reporte SET id_usuario_asignado = ${updateData.idPersonal}, prioridad = ${updateData.prioridad}, updated_at = CURRENT_TIMESTAMP WHERE id_reporte = ${id}`
      );
    }

    Promise.all(updatePromises)
      .then(() => {
        res.status(200).json(
          {
            status : 200,
            message: 'Reporte actualizado exitosamente!',
            data: updateData
          }
        );
      })
      .catch((err) => {
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