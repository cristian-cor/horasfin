import { Response } from "express";
import { IUserRead } from "./dto/user-read.dto";
import { IUserCreate } from "./dto/user-create.dto";
import { UserService} from "./user.service";
import {Request} from "../util/request";



export async function create(req: Request, res: Response) {
    const userService = new UserService()
    const data = req.body as IUserCreate;
    const createdUser: IUserRead = await userService.create(data).then((it) => it.toJSON());
    res.status(201).json({ createdUser });
}


