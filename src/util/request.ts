import { Request as ERequest } from "express";
import { WhereOptions } from "sequelize";
import { IUserRead } from "../users/dto/user-read.dto";

export interface Request<M = any> extends ERequest {
	pagination?: { limit: number; offset: number };
	sort?: string[][];
	queryAbilities?: WhereOptions<M>;
	queryClient?: WhereOptions<M>;
	user?: IUserRead | undefined;
}