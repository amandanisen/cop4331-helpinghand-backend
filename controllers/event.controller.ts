import express, { Request, Response } from "express";
import * as EventService from "../services/event.service";
import { find_all_with_event_id } from "../services/area.service";
import { find_all_event_id } from "../services/task.service";
import { Event } from "../data/event.interface";
import { Area } from "../data/area.interface";
import { Task } from "../data/task.interface";


export const eventRouter = express.Router();


eventRouter.get("/volunteer/:id", async (req: Request, res: Response) => {
  if (!req.params.id) return res.sendStatus(400);

  const id: string = req.params.id;
  
  try {
    const event: Event = await EventService.find_event_with_volunteer_code(id);
    const areas: Array<Area> = await find_all_with_event_id(event.id);
    const tasks: Array<Task> = await find_all_event_id(event.id);

    let areaObj:any = {};
    areas.forEach((area: any) => {
      area["volunteer_limit"] = 0;
      area["current_volunteers"] = 0;
      area["tasks"] = [];
      areaObj[area.id] = area;
    })

    tasks.forEach((task: any) => {
      areaObj[task.area_id]["tasks"].push(task);
      areaObj[task.area_id]["volunteer_limit"] = areaObj[task.area_id]["volunteer_limit"] + task.volunteer_limit;
      areaObj[task.area_id]["current_volunteers"] = areaObj[task.area_id]["current_volunteers"] + task.current_volunteers;
    })
  
    res.status(200).send({ event, "areas": Object.values(areas) });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(400);
  }
});


eventRouter.get("/coordinator/:id", async (req: Request, res: Response) => {
  if (!req.params.id) return res.sendStatus(400);

  const id: string = req.params.id;

  try {
    const event: Event = await EventService.find_event_with_coordinator_code(id);
    const areas: Array<any> = await find_all_with_event_id(event.id);
    const tasks: Array<Task> = await find_all_event_id(event.id);

    let areaObj:any = {};
    areas.forEach((area: any) => {
      area["volunteer_limit"] = 0;
      area["current_volunteers"] = 0;
      area["tasks"] = [];
      areaObj[area.id] = area;
    })

    tasks.forEach((task: any) => {
      areaObj[task.area_id]["tasks"].push(task);
      areaObj[task.area_id]["volunteer_limit"] = areaObj[task.area_id]["volunteer_limit"] + task.volunteer_limit;
      areaObj[task.area_id]["current_volunteers"] = areaObj[task.area_id]["current_volunteers"] + task.current_volunteers;
    })
  
    res.status(200).send({ event, "areas": Object.values(areas) });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(400);
  }
});


eventRouter.post("/", async (req: Request, res: Response) => {
  try {
    const event: Event = req.body;

    let returnCodes = await EventService.create(event);
    res.status(201).send(returnCodes);
  
  } catch (error) {
    res.status(400).send(error.message);
  }
});


eventRouter.put("/", async (req: Request, res: Response) => {
  try {
    const event: Event = req.body;

    await EventService.update(event);

    res.sendStatus(200);
  
  } catch (error) {
    res.status(500).send(error.message);
  }
})


eventRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    await EventService.remove(id);

    res.sendStatus(200);
  
  } catch (error) {
    res.status(500).send(error.message);
  }
})