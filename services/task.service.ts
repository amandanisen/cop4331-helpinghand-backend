import { Task } from '../data/task.interface';
import { pool } from './database.pool';


function makeTaskObj(id: number, name: string, description: string, volunteer_limit: number, current_volunteers: number,
                     task_location: string, start_time: string, end_time: string, area_id: number): Task {
  return { id, name, description, volunteer_limit, current_volunteers, task_location, start_time, end_time, area_id };
}


export const find = async (task_id: number): Promise<Task> => {
  let client;
  let task: Task;
  const sql = `SELECT * FROM task WHERE task_id = $1`;
  let values: Array<any> = [task_id];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      throw new Error("Invalid task_id: "+task_id+" for Find single Area");
    } else {
      sqlResult = sqlResult.rows[0];
    }

    task = makeTaskObj(sqlResult.task_id, sqlResult.task_name, sqlResult.description, sqlResult.volunteer_limit,
      sqlResult.current_volunteers, sqlResult.task_location, sqlResult.start_time, sqlResult.end_time, sqlResult.area_id);
    
    client.release();
    return task;

  } catch (error) {

    if (client) client.release();
    console.log("Get Task Error:", error);
    throw new Error("Finding Task Error");

  }
}


export const find_all_area_id = async (area_id: number): Promise<Array<Task>> => {
  let client;
  let tasks: Array<Task>;
  const sql = `SELECT * FROM task WHERE area_id = $1`;
  const values: Array<any> = [area_id];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      return [];
    }

    tasks = sqlResult.rows.map((task: any) => 
      makeTaskObj(task.task_id, task.task_name, task.description, task.volunteer_limit, task.current_volunteers,
        task.task_location, task.start_time, task.end_time, task.area_id)
    )
    
    client.release();
    return tasks;

  } catch (error) {

    if (client) client.release();
    console.log("Get Tasks from area_id Error:", error);
    throw new Error("Finding Tasks from area_id Error");

  }
}


export const find_all_event_id = async (event_id: number): Promise<Array<Task>> => {
  let client;
  let tasks: Array<Task>;
  const sql = `SELECT * FROM task TK
               INNER JOIN event ET
               ON ET.event_id = $1
               INNER JOIN area AR
               ON AR.event_id = ET.event_id
               WHERE TK.area_id = AR.area_id`;

  let values: Array<any> = [event_id];
  try {
    
    client = await pool.connect();
    let sqlResult = await client.query(sql, values);

    if (sqlResult.rows.length === 0) {
      return [];
    }

    tasks = sqlResult.rows.map((task: any) => 
      makeTaskObj(task.task_id, task.task_name, task.description, task.volunteer_limit, task.current_volunteers,
        task.task_location, task.start_time, task.end_time, task.area_id)
    )
    
    client.release();
    return tasks;

  } catch (error) {

    if (client) client.release();
    console.log("Get Tasks from event_id Error:", error);
    throw new Error("Finding Tasks from event_id Error");

  }
}


export const create = async (new_task: Task): Promise<number> => {
  let client;
  let sql = `INSERT INTO task (task_name, description, volunteer_limit, task_location, start_time, end_time, area_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING task_id`;

  let values: Array<any> = [new_task.name, new_task.description, new_task.volunteer_limit, new_task.task_location,
                              new_task.start_time, new_task.end_time, new_task.area_id];
  try {
    
    client = await pool.connect();
    let task = await client.query(sql, values);

    client.release();
    return task.rows[0].task_id;

  } catch (error) {

    if (client) client.release();
    console.log("Create Task Error:", error);
    if (error.code === '23505') {
      console.log("error.constraint:", error.constraint);
    }
    throw new Error("Create Task Error");

  }
}


export const update = async (updated_task: Task): Promise<void> => {
  let client;
  const sql = `UPDATE task SET task_name = $1, description = $2, volunteer_limit = $3, current_volunteers = $4,
                task_location = $5, start_time = $6, end_time = $7, area_id = $8)
               WHERE task_id = $9`;

  let values: Array<any> = [updated_task.name, updated_task.description, updated_task.volunteer_limit, updated_task.current_volunteers, updated_task.task_location,
                              updated_task.start_time, updated_task.end_time, updated_task.area_id, updated_task.id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Update Task Error:", error);
    throw new Error("Update Task Error");

  }
}


export const remove = async (task_id: number): Promise<void> => {
  let client;
  const sql = `DELETE FROM task WHERE task_id = $1`;

  let values: Array<any> = [task_id];
  try {
    
    client = await pool.connect();
    await client.query(sql, values);

    client.release();
  } catch (error) {

    if (client) client.release();
    console.log("Remove Task Error:", error);
    throw new Error("Remove Task Error");

  }
}