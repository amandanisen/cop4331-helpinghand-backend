import express, { Request, Response } from "express";
import * as AreaService from "../services/area.service";
import { Area } from "../data/area.interface";


export const areaRouter = express.Router();


areaRouter.get("/:id", async (req: Request, res: Response) => {
  if (!req.params.id) return res.sendStatus(400);

  const id: number = parseInt(req.params.id);
  
  try {
    const area: Area = await AreaService.find(id);

    res.status(200).send({ area });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(400);
  }
});


areaRouter.post("/", async (req: Request, res: Response) => {
  try {
    const area: Area = req.body;

    let areaID: number = await AreaService.create(area);
    res.status(201).send({ "id":areaID });
  
  } catch (error) {
    res.status(400).send(error.message);
  }
});