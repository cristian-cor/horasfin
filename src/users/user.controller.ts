import { Response } from "express";

import {UsersService} from "./user.service";
import {makeQuery} from "../util/makeQuery";
import {IUserCreate} from "./dto/user-create.dto";
import {encrypt} from "../util/encrypt";
import {merge} from "../util/merge";
import {Request} from "../util/request";
export async function findAll(req: Request, res: Response) {
    const userService = new UsersService();
    const query = makeQuery(req);

    query.attributes = { exclude: ["password"] };

    const data = await userService.findAll(query);
    const total = await userService.count();

    res.status(200).json({ total, data });
}

export async function findOne(req: Request, res: Response) {
    const userService = new UsersService();

    const id = +req.params.id;
    const query = makeQuery(req);

    const associations = [{ association: "application" }];

    query.attributes = { exclude: ["password"] };
    query.include = Array.isArray(query.include) ? [...query.include, ...associations] : associations;

    const user = await userService.findOneById(id, query);

    res.status(200).json(user);
}

export async function createUserOwner(req: Request, res: Response) {
    const userService = new UsersService();
    const data = req.body as IUserCreate;


    data.email = data.email.toLowerCase();
    data.password = data.password ? encrypt(data.password) : data.password;
    // const user = await userService.create();

    res.status(201).json({
    });
}

export async function create(req: Request, res: Response) {
    const userService = new UsersService();
    const data = req.body;

    data.email = data.email.toLowerCase();
    data.membership_id = 0;
    data.password = data.password ? encrypt(data.password) : data.password;

    const user = await userService.create(data);

    res.status(201).json({
        user,
    });
}


export async function edit(req: Request, res: Response) {
    const userService = new UsersService();
    const id = +req.params.id;
    const data = req.body;
    data.identification_number = `${data.identification_number}`;
    data.password = data.password ? encrypt(data.password) : data.password;

    const query: any = merge(makeQuery(req), { where: { id } });



    res.status(200).json();
}
export async function remove(req: Request, res: Response) {
    const userService = new UsersService();
    const id = +req.params.id;

    const [user] = await userService.update({ deleted_at: new Date() }, { where: { id } });

    res.status(200).json(user);
}
