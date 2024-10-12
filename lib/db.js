import mariadb from 'mariadb';

const isProduction = process.env.NODE_ENV === 'production';


const pool = mariadb.createPool({
  host: "1mcbp.h.filess.io",
  user: "studentVerify_afternoon",
  password: "acd97ea80cf45f7317ebf90fab28cdb8d2a9e7a7",
  database: "studentVerify_afternoon",
  connectionLimit: 1 ,
  port: "3305",
  connectTimeout: 30000,  
  ssl: false,
});

export default pool;