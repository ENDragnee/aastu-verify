import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: "localhost",
  user: "END",
  password: "1234",
  database: "studentVerify",
  connectionLimit: 5
});

export default pool;