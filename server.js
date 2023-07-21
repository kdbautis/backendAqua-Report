const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();
const port = 3000;
const getRoutes = require('./Routes/getRoutes');
const postRoutes = require('./Routes/postRoutes');
const putRoutes = require('./Routes/putRoutes');
const deleteRoutes = require('./Routes/deleteRoutes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', getRoutes);
app.use('/', postRoutes);
app.use('/', putRoutes);
app.use('/', deleteRoutes);

require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

sql.connect(config).then(() => {
  console.log("Conexión a la base de datos exitosa!");
  app.listen(port, () => {
    console.log(`El servidor está corriendo en http://localhost:${port}`);
  });
}).catch(err => {
  console.error("Error al conectar a la base de datos:", err);
});  

app.get('/', (req, res) => {
  res.send('Servidor corriendo!');
});