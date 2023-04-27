import { IUser } from "./user.dto";
import {IEntityRead} from "../../util/dto/entity-read.dto";

export interface IUserRead extends IUser, IEntityRead {}
