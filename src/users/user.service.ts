import { FindOptions, FindOrCreateOptions, Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import {merge} from "../util/merge";
import {Service} from "../util/service";
import {UserModel} from "./model/user.model";
import {IUserRead} from "./dto/user-read.dto";
import {IUserCreate} from "./dto/user-create.dto";

export class UsersService extends Service<UserModel> {
    constructor() {
        super(UserModel);
    }

    async findOneByEmail(email: string, options?: FindOptions<UserModel>) {
        const [user] = await this.findAll(merge({ where: { email } }, options));
        return user;
    }

    async findOneOrCreateByPhone(
        phone: string,
        options?: FindOrCreateOptions<IUserRead, Optional<IUserCreate, NullishPropertiesOf<IUserCreate>>>
    ) {
        const [user] = await this.model.findOrCreate(merge({ where: { phone } }, options));
        return user;
    }

    async findOneByActivationCode(activation_code: string, options?: FindOptions<UserModel>) {
        const [user] = await this.findAll(merge({ where: { activation_code } }, options));
        return user;
    }

    findOnePhone(phone: string, options?: FindOptions<UserModel>) {
        return this.model.findOne(merge({ where: { phone: phone } }, options, this.getOptionsDefault()));
    }
}
