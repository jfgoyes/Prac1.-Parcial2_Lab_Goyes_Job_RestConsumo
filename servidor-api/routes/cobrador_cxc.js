const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../conexion');

// Método GET para obtener todos los cobradores
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM cobrador_cxc');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Método GET para consultar cobrador mediante su cédula
router.get('/cedula/:cedula', async (req, res) => {
    try {
        const { cedula } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input('cedula', sql.VarChar(15), cedula)
            .query('SELECT * FROM cobrador_cxc WHERE cobrador_cedula = @cedula');
        
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Cobrador no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Método POST para crear nuevo cobrador
router.post('/', async (req, res) => {
    try {
        const { cobrador_cedula, cobrador_nombre, cobrador_direccion } = req.body;
        const pool = await getConnection();
        const result = await pool.request()
            .input('cedula', sql.VarChar(15), cobrador_cedula)
            .input('nombre', sql.VarChar(300), cobrador_nombre)
            .input('direccion', sql.VarChar(300), cobrador_direccion)
            .query('INSERT INTO cobrador_cxc (cobrador_cedula, cobrador_nombre, cobrador_direccion) VALUES (@cedula, @nombre, @direccion); SELECT SCOPE_IDENTITY() as cobrador_id');
        
        res.json({
            message: 'Cobrador creado exitosamente',
            cobrador_id: result.recordset[0].cobrador_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Método PUT para actualizar algún cobrador mediante su ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cobrador_cedula, cobrador_nombre, cobrador_direccion } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('cedula', sql.VarChar(15), cobrador_cedula)
            .input('nombre', sql.VarChar(300), cobrador_nombre)
            .input('direccion', sql.VarChar(300), cobrador_direccion)
            .query('UPDATE cobrador_cxc SET cobrador_cedula = @cedula, cobrador_nombre = @nombre, cobrador_direccion = @direccion WHERE cobrador_id = @id');
        
        res.json({ message: 'Cobrador actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Método DELETE para eliminar algún cobrador mediante su ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM cobrador_cxc WHERE cobrador_id = @id');
        
        res.json({ message: 'Cobrador eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;