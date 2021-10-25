'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

pool.on('error', (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});


const preparedSQL = [
  `DROP TABLE IF EXISTS "task"`,
  `DROP TABLE IF EXISTS "area"`,
  `DROP TABLE IF EXISTS "event"`
];


dropTables(preparedSQL);


async function dropTables(sqlList) {
  let success = 1;
  let client;
  try {
    client = await pool.connect();
    for (const sql of sqlList) {
      await client.query(sql);
    }
    client.release();
  } catch (err) {
    if (client) client.release();
    console.log("Postgresql Error:\n", err);
    success = 0;
  }
  if (success) {
    console.log("Tables successfully dropped");
  } else {
    console.log("Tables failed to drop.");
  }
  process.exit();
}