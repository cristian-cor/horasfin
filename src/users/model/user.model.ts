import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import {initModel} from "../../util/initModel";

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    public static readonly tableName: string = "users";

    declare id: CreationOptional<number>;
    declare document_type: string;
    declare first_name: boolean;
    declare last_name: string;
    declare email: string;
    declare password: string;
    declare identification_number: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date>;
}
initModel(UserModel, {
    document_type: {
        type: DataTypes.STRING(255),
    },
    first_name: {
        type: DataTypes.STRING(255),
    },
    last_name: {
        type: DataTypes.STRING(255),
    },
    email: {
        type: DataTypes.STRING(255),
    },
    password: {
        type: DataTypes.DATE,
    },
    identification_number: {
        type: DataTypes.STRING(255),
    },
});