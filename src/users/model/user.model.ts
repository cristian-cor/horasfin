import {DataTypes, Model} from "sequelize";
import {IUserRead} from "../dto/user-read.dto";
import {IUserCreate} from "../dto/user-create.dto";
import {sequelize} from "../../sequelize";

export class UserModel
    extends Model<IUserRead, IUserCreate>
    implements IUserRead
{
    declare id: number;
    declare document_type: string;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare password: string;
    declare identification_number: string;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;
    declare mobile: number;
}

UserModel.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        document_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        identification_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

UserModel.sync({ alter: true }).then();
