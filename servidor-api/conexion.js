const sql = require('mssql');

const config = {
    server: 'JOBFGA\\SQLSERVERDEV',
    authentication: {
        type: 'default',
        options: {
            userName: 'jfgoyes',
            password: 'sqlserverdb123'
        }
    },
    options: {
        database: 'Prac1_Parcial2_Lab_Goyes_Job_RestCosumo',
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    }
};

const pool = new sql.ConnectionPool(config);

async function getConnection() {
    try {
        await pool.connect();
        console.log('Conexión a SQL Server establecida correctamente a:', config.server);
        return pool;
    } catch (error) {
        console.error('Error de conexión:', error.message);
        if (error.code === 'ELOGIN') {
            console.log('Error de autenticación. Verifica usuario/contraseña');
        } else if (error.code === 'ESOCKET') {
            console.log('Error de red. Verifica que SQL Server esté corriendo y accesible');
        }
        
        throw error;
    }
}

async function testConnection() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('Versión de SQL Server:', result.recordset[0].version);
        return true;
    } catch (error) {
        console.error('Error en test de conexión:', error.message);
        return false;
    }
}

module.exports = {
    sql,
    getConnection,
    testConnection,
    config
};