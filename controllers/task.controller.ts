import express, { Request, Response } from "express";
import * as TaskService from "../services/task.service";
import { Task } from "../data/task.interface";


export const taskRouter = express.Router();


taskRouter.get("/:id", async (req: Request, res: Response) => {
  if (!req.params.id) return res.sendStatus(400);

  const id: number = parseInt(req.params.id);
  
  try {
    const task: Task = await TaskService.find(id);

    res.status(200).send({ task });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(400);
  }
});


taskRouter.post("/", async (req: Request, res: Response) => {
  try {
    const task: Task = req.body;

    let taskID: number = await TaskService.create(task);
    res.status(201).send({ "id": taskID });
  
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
})


taskRouter.put("/", async (req: Request, res: Response) => {
  try {
    const task: Task = req.body;

    await TaskService.update(task);
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500).send(error.message);
  }
})