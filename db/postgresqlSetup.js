// const { Pool } = require('pg');
import pg from "pg";
const { Pool } = pg;

const db = new Pool({
  user: 'junistormoen',
  host: 'localhost',
  database: 'junistormoen',
  password: 'juni',
  port: 5432,
});

export default db;