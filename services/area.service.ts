import { Area } from '../data/area.interface';
import { pool } from './database.pool';


function makeAreaObj(id: number, name: string, eventID: number): Area {
  return { id, name, eventID };
}

 
export const find = async (area_id: number): Promise<Area> => {
  let client;
  let area: Area;
  const sql = `SELECT * FROM area WHERE area_id = $1`;
  const values: Array<any> = [area_id];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      throw new Error("Invalid area_id for Find single Area");
    } else {
      sqlResult = sqlResult.rows[0]
    }

    area = makeAreaObj(sqlResult.area_id, sqlResult.area_name, sqlResult.event_id);

    client.release();
    return area;

  } catch (error) {

    if (client) client.release();
    console.log("Post Area Error:", error);
    throw new Error("Find Area Error");

  }
}


export const find_all_with_event_id = async (event_id: number): Promise<Array<Area>> => {
  let client;
  let areas: Array<Area>;
  const sql = `SELECT * FROM area WHERE event_id = $1`;
  const values: Array<any> = [event_id];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      return [];
    }

    areas = sqlResult.rows.map((area: any) => 
      makeAreaObj(area.area_id, area.area_name, area.event_id)
    );

    client.release();
    return areas;

  } catch (error) {

    if (client) client.release();
    console.log("Post Area Error:", error);
    throw new Error("Find Area Error");

  }
}


export const create = async (new_area: Area): Promise<number> => {
  let client;
  const sql = `INSERT INTO area (area_name, event_id)
               VALUES ($1, $2) RETURNING area_id`;

  const values: Array<any> = [new_area.name, new_area.eventID];
  try {
    
    client = await pool.connect();
    let area = await client.query(sql, values);

    client.release();
    return area.rows[0].area_id;

  } catch (error) {

    if (client) client.release();
    console.log("Create Area Error:", error);
    if (error.code === '23505') {
      console.log("error.constraint:", error.constraint);
    }
    throw new Error("Create Area Error");

  }
}


export const update = async (updated_area: Area): Promise<void> => {
  let client;
  const sql = `UPDATE area SET area_name = $1, SET event_id = $2)
               WHERE area_id = $3`;

  const values: Array<any> = [updated_area.name, updated_area.eventID, updated_area.id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Update Area Error:", error);
    throw new Error("Update area Error");

  }
}


export const remove = async (area_id: number): Promise<void> => {
  let client;
  const sql = `DELETE FROM area WHERE area_id = $1`;

  const values: Array<any> = [area_id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Delete Area Error:", error);
    throw new Error("Delete area Error");

  }
}