-- Primero, añade la columna nueva
ALTER TABLE Reporte
ADD estado_nuevo CHAR(1);

-- Luego, actualiza los valores en la columna nueva
UPDATE Reporte
SET estado_nuevo = 
    CASE
        WHEN Estado = 'A' THEN 'C'
        WHEN Estado = 'I' THEN 'F'
        ELSE estado_nuevo
    END;

--Añadimos las columnas para medir el tiempo de todos los estados
ALTER TABLE Reporte
ADD fecha_aceptacion date,
	hora_aceptacion time(7),
	fecha_encurso date,
	hora_encurso time(7);

--Añadimos la tabla para registrar los medidores
CREATE TABLE Medidor (
  id_medidor INT PRIMARY KEY,
  nombre VARCHAR(255),
  latitud VARCHAR(50),
  longitud VARCHAR(50)
);

--Añadimos la tabla para registrar las lecturas
CREATE TABLE Lectura (
  id_lectura INT PRIMARY KEY,
  id_medidor INT,
  id_usuario_asignado INT,
  fecha_creacion DATE,
  fecha_ultima_lectura DATE,
  fecha_proxima_lectura DATE,
  ultima_lectura DECIMAL(10, 2),
  repeticion INT,
  estado varchar(2),
  FOREIGN KEY (id_medidor) REFERENCES Medidor(id_medidor),
  FOREIGN KEY (id_usuario_asignado) REFERENCES Usuario(id_usuario)
);

--Añadimos la tabla para el histórico de lecturas
CREATE TABLE Lecturas_Historicas (
  id_lectura_historica INT PRIMARY KEY,
  id_medidor INT,
  fecha_lectura DATETIME,
  lectura DECIMAL(10, 2),
  FOREIGN KEY (id_medidor) REFERENCES Medidor(id_medidor)
);