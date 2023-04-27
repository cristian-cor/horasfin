import { DataTypes, InferAttributes, Model, ModelAttributes, ModelStatic, Optional } from "sequelize";
import { sequelize } from "../sequelize";
import Sync from "./sync";

export function initModel<T extends ModelStatic<M>, M extends Model>(
	model: T,
	attributes: ModelAttributes<M, Optional<InferAttributes<M>, never>>
) {
	model.init(
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				autoIncrement: true,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			...attributes,
		},
		{
			sequelize,
			tableName: model.tableName,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	Sync.register(model);
}
