// const { Pool } = require('pg');
import pg from "pg";
import dotenv from "dotenv";
dotenv.config()


let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;
const credentials = {
  connectionString,
  ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
};

class DB {
  #client = null;
  constructor(){
    this.#client = new pg.Client(credentials);
    this.#client.connect();
    
  }

  async query(sql, params){
    //await this.#client.connect();
    return await this.#client.query(sql, params);
  }
}



const { Pool } = pg;
const db = new Pool({
  user: 'junistormoen',
  host: 'localhost',
  database: 'junistormoen',
  password: 'juni',
  port: 5432,
});


export default new DB();