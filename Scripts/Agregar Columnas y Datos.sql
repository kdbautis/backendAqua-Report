-- Primero, añade la columna nueva
ALTER TABLE Reporte
ADD EstadoNuevo CHAR(1);

-- Luego, actualiza los valores en la columna nueva
UPDATE Reporte
SET estadoNuevo = 
    CASE
        WHEN Estado = 'A' THEN 'C'
        WHEN Estado = 'I' THEN 'F'
        ELSE estadoNuevo
    END;
