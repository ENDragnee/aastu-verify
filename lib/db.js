import mariadb from 'mariadb';
import fs from 'fs';
import path from 'path';

const caCertPath = path.join(process.cwd(), 'lib', 'ca.pem');
const caCert = fs.readFileSync(caCertPath);



const pool = mariadb.createPool({ 

  host: "mysql-3b4d61fd-aastu-verify.l.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_gVrBXAZuNj3_5HM5dhX",
  database: "defaultdb",
  connectionLimit: 5,
  port: "14924",
  connectTimeout: 30000,   
  ssl: {
    ca: caCert,
    rejectUnauthorized: false
  },

});

export default pool;