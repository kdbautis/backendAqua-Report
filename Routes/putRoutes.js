const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.put('/editarUsuario/:id', (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    //console.log(id);
    //console.log(updateData);
  
    const updatePromises = [];
    try{
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
    }catch(err){
      console.error("Error al hacer consulta:", err);
      res.status(500).json(
        {
          message: 'Ocurrió un error al hacer la consulta a la base de datos',
          error: err,
          status : 500
        }
      );
    }
});

router.put('/editarPerfil/:id', (req, res) => {
  const id = req.params.id;
    const updateData = req.body;

    const updatePromises = [];
    try{

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

    if (updateData.passwordNueva && updateData.passwordActual) {
      sql.query`SELECT password
      FROM Usuario WHERE id_usuario = ${id};`
      .then(result => {
          const inputPassword = updateData.passwordActual;
          const hashedPasswordFromDatabase = result.recordset[0].password;

          if (bcrypt.compareSync(inputPassword, hashedPasswordFromDatabase)) {
          const hashedPassword = bcrypt.hashSync(updateData.passwordNueva, 10);
          updatePromises.push(
            sql.query`UPDATE Usuario SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = ${id}`
          );
          } else{
            res.status(400).json(
              {
                message: 'La contraseña actual no coincide',
                status : 400
              }
            );
            return;
          }
          res.status(200).json(
            {
              status : 200,
              message: 'Usuario actualizado exitosamente!',
              data: updateData
            }
          );
      }).catch(err => {
        res.status(400).json(
          {
            message: 'Usuario no encontrado',
            error: err,
            status : 400
          }
        );
      });
    }


    }catch(err){
      console.error("Error al hacer consulta:", err);
      res.status(500).json(
        {
          message: 'Ocurrió un error al hacer la consulta a la base de datos',
          error: err,
          status : 500
        }
      );
    }

  });
  
  


router.put('/reasignarUsuarioLectura/:id', (req, res) => {
  const id = req.params.id;
  const id_usuario_asignado = req.body.id_usuario_asignado;
  const fecha = req.body.fechaLectura? req.body.fechaLectura : null;
  const repeticion = req.body.repeticion? req.body.repeticion : null;
  
  sql.query`UPDATE Lectura SET id_usuario_asignado = ${id_usuario_asignado}, fecha_proxima_lectura = ${fecha}, repeticion = ${repeticion} WHERE id_lectura = ${id}`
  .then(result => {
    res.status(200).json(
      {
        status : 200,
        message: 'Usuario reasignado exitosamente!'
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
    });
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

router.put('/asignarReporte/:id', (req, res) => {
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