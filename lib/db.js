import mariadb from 'mariadb';

const isProduction = process.env.NODE_ENV === 'production';


const pool = mariadb.createPool({
  host: isProduction ? "1mcbp.h.filess.io" : "localhost",
  user: isProduction ? "studentVerify_afternoon" :"END",
  password: isProduction ? "acd97ea80cf45f7317ebf90fab28cdb8d2a9e7a7" : "1234",
  database: isProduction ? "studentVerify_afternoon" : "studentVerify",
  connectionLimit: isProduction ? 1 : 5,
  port: isProduction ? "3305" : "3306",
  connectTimeout: isProduction ? 30000 : 10000,  
  ssl: isProduction ? false : false,
});

export default pool;