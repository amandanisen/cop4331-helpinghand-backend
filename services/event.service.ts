import { Event } from '../data/event.interface';
import { pool } from './database.pool';

const crypto = require('crypto');
const base64url = require('base64url');

function makeEventObj(id: number, name: string, location: string, email: string, start_time: string,
                      end_time: string, volunteer_access_code: string, coordinator_access_code: string): Event {
  return {id, name, location, email, start_time, end_time, volunteer_access_code, coordinator_access_code};
}


export const find_event_with_volunteer_code = async (volunteer_access_code: string): Promise<Event> => {
  let client;
  let event: Event;
  const sql = `SELECT event_id, event_name, event_location, event_start_time, event_end_time FROM event WHERE volunteer_access_code = $1`;
  const values: Array<any> = [volunteer_access_code];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      throw new Error("Invalid Volunteer_Code for Find Event");
    } else {
      sqlResult = sqlResult.rows[0]
    }

    event = makeEventObj(sqlResult.event_id, sqlResult.event_name, sqlResult.event_location, sqlResult.email,
      sqlResult.event_start_time, sqlResult.event_end_time, sqlResult.volunteer_access_code, sqlResult.coordinator_access_code);

    
    client.release();
    return event;

  } catch (error) {

    if (client) client.release();
    console.log("Post Event Error:", error);
    throw new Error("find_event_with_volunteer_code");

  }
}


export const find_event_with_coordinator_code = async (coordinator_access_code: string): Promise<Event> => {
  let client;
  let event: Event;
  const sql = `SELECT event_id, event_name, event_location, event_start_time, event_end_time FROM event WHERE coordinator_access_code = $1`;
  const values: Array<any> = [coordinator_access_code];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      throw new Error("Invalid Coordinator_Code for Find Event");
    } else {
      sqlResult = sqlResult.rows[0]
    }


    event = makeEventObj(sqlResult.event_id, sqlResult.event_name, sqlResult.event_location, sqlResult.email,
      sqlResult.event_start_time, sqlResult.event_end_time, sqlResult.volunteer_access_code, sqlResult.coordinator_access_code);

    client.release();
    return event;

  } catch (error) {

    if (client) client.release();
    console.log("Post Event Error:", error);
    throw new Error("find_event_with_coordinator_code");

  }
}


export const create = async (new_event: Event): Promise<Object> => {
  let client;
  const sql = `INSERT INTO event (event_name, event_location, email, event_start_time, event_end_time, volunteer_access_code, coordinator_access_code)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  let size = 7;
  let volunteer_access_code = base64url(crypto.randomBytes(size));
  let coordinator_access_code = base64url(crypto.randomBytes(size));
  const values: Array<any> = [new_event.name, new_event.location, new_event.email, new_event.start_time,
                              new_event.end_time, volunteer_access_code, coordinator_access_code];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);
    client.release();
    return {volunteer_access_code, coordinator_access_code}
  } catch (error) {

    if (client) client.release();
    console.log("Post Event Error:", error);
    if (error.code === '23505') {
      console.log("error.constraint:", error.constraint);
    }
    throw new Error("Create Event Error");

  }
}


export const update = async (updated_event: Event): Promise<void> => {
  let client;
  const sql = `UPDATE event SET event_name = $1, event_location = $2, email = $3, event_start_time = $4, event_end_time = $5,
               volunteer_access_code = $6, coordinator_access_code = $7)
               WHERE event_id = $8`;

  const values: Array<any> = [updated_event.name, updated_event.location, updated_event.email, updated_event.start_time,
                              updated_event.end_time, updated_event.volunteer_access_code, updated_event.coordinator_access_code, updated_event.id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Post Event Error:", error);
    throw new Error("Update Event Error");

  }
}


export const remove = async (event_id: number): Promise<void> => {
  let client;
  const sql = `DELETE FROM event WHERE event_id = $1`;

  const values: Array<any> = [event_id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Post Event Error:", error);
    throw new Error("Delete Event Error");

  }
}