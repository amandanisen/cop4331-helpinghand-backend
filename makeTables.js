'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    datbase: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});


pool.on('error', (err, client) => {
    console.log("Unexpected error on idle client", err);
    process.exit(-1);
})


const preparedSQL = [
  `CREATE TABLE event (
      event_id INT GENERATED ALWAYS AS IDENTITY,
      event_name VARCHAR(50) NOT NULL,
      event_location VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      event_start_time TIMESTAMP NOT NULL,
      event_end_time TIMESTAMP NOT NULL,
      volunteer_access_code VARCHAR(10) UNIQUE NOT NULL,
      coordinator_access_code VARCHAR(10) UNIQUE NOT NULL,
      PRIMARY KEY(event_id)
  )`,

  `CREATE TABLE area (
      area_id INT GENERATED ALWAYS AS IDENTITY,
      area_name VARCHAR(50) NOT NULL,
      event_id INT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES event (event_id),
      PRIMARY KEY(area_id)
  )`,

  `CREATE TABLE task (
      task_id INT GENERATED ALWAYS AS IDENTITY,
      task_name VARCHAR(50) NOT NULL,
      description VARCHAR(50) NOT NULL,
      volunteer_limit INT NOT NULL,
      current_volunteers INT DEFAULT 0 NOT NULL,
      task_location VARCHAR(50) NOT NULL,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      area_id INT NOT NULL,
      FOREIGN KEY (area_id) REFERENCES area (area_id),
      PRIMARY KEY(task_id)
  )`
]

makeTables();
async function makeTables() {
  await setupDatabase(preparedSQL);
  process.exit();
}

async function setupDatabase(sqlList) {
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
    console.log("Postgres Error:\n", err);
    success = 0;
  }

  if (success) {
    console.log("Tables successfully created");
  } else {
    console.log("Tables failed");
  }
}