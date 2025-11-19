/* db/conexion.js */

const mysql = require('mysql2/promise'); //1

const pool = mysql.createPool({          //2
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,           //3
    connectionLimit: 10,                //4
    queueLimit: 0                       //5
});

module.exports = pool;

//4 
//5 
//3 
/* 
1 Esta línea importa la versión promisificada del paquete mysql2. 
Eso significa que todas las funciones (como createConnection, query, etc.) devuelven promesas, y puedes usar async/await 
require('mysql2') usa callbacks tradicionales (la forma vieja de manejar asincronía) 
*/  
/* 
2 createPool maneja varias conexiones (mejor que createConnection en apps reales). 
*/  
/* 
3 waitForConnections: true  Le dice al pool de MySQL que, si todas las conexiones disponibles están ocupadas,  
las nuevas peticiones esperen en cola hasta que se libere una conexión 
Con el valor de false cuando todas las conexiones del pool están ocupadas, las nuevas consultas fallan de inmediato 
*/  
/* 
4 connectionLimit: 10  Indica el máximo número de conexiones activas que puede mantener el pool al mismo tiempo 
En proyectos pequeños o académicos, 10 es más que suficiente.
En producción podrías subirlo (por ejemplo, 50 o 100 según el servidor) 
*/  
/* 
5 queueLimit   Controla cuántas peticiones pueden quedar en espera (cola) cuando ya se alcanzó el límite de conexiones 
Si queueLimit = 0 → significa “sin límite de cola (cola infinita”: las peticiones extra esperan hasta que haya una conexión libre. 
Si le pusieras, por ejemplo, queueLimit: 5, entonces solo 5 peticiones podrían quedarse esperando;  
la sexta sería rechazada con error. 
*/ 