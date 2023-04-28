import { Router } from "express";
import {controller} from "../util/controller";
import {create} from "./user.controller";

const router = Router();



router.post("/", controller(create));


export default router;
