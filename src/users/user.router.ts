import { Router } from "express";
import {controller} from "../util/controller";
import {create, edit, findAll, findOne, remove} from "./user.controller";

const router = Router();

router.get("/:id",  controller(findOne));

router.get("/", controller(findAll));

router.post("/", controller(create));

router.patch("/:id",  controller(edit));

router.delete("/:id", controller(remove));

export default router;
