const sql = require('mssql');

const config = {
  server: 'billigent-dev-sql-eus2.database.windows.net',
  database: 'BilligentAppDev',
  user: 'billigentadmindev',
  password: 'B1ll1g3ntD3v!',
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    console.log('Server:', config.server);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    
    const pool = await sql.connect(config);
    console.log('✅ Database connection successful!');
    
    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Query test successful:', result.recordset);
    
    await pool.close();
    console.log('✅ Connection closed successfully');
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('Number:', err.number);
  }
}

testConnection();