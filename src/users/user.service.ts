import {IUserRead} from "./dto/user-read.dto";
import {IUserCreate} from "./dto/user-create.dto";
import {UserModel} from "./model/user.model";
import {Service} from "../util/service";

export class UserService extends Service<IUserRead, IUserCreate, UserModel>{
    constructor() {
        super(UserModel);
    }
}

export const userService = new UserService();
