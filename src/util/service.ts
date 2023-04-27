import {
	Attributes,
	CreateOptions,
	CreationAttributes,
	FindOptions,
	fn,
	InferAttributes,
	InferCreationAttributes,
	Model,
	ModelStatic,
	Op,
	UpdateOptions,
} from "sequelize";
import { Col, Fn, Literal } from "sequelize/types/utils";
import { merge } from "./merge";

export type updateData<T extends Model<InferAttributes<T>, InferCreationAttributes<T>>> = {
	[key in keyof Attributes<T>]?: Attributes<T>[key] | Fn | Col | Literal;
};

export class Service<T extends Model<InferAttributes<T>, InferCreationAttributes<T>>> {
	protected deletedField = "deleted_at";
	protected raw: boolean = false;

	getOptionsDefault(): FindOptions<T> {
		return {
			where: {
				[Op.or]: [
					{ [this.deletedField]: "1969-12-31 23:59:59.000000 +00:00" },
					{ [this.deletedField]: { [Op.gt]: fn("now") } },
				],
			},
		} as any;
	}

	constructor(protected model: ModelStatic<T>) {}

	create(data: CreationAttributes<T>, options?: CreateOptions<Attributes<T>>) {
		return this.model.create(data, options);
	}

	count(options?: FindOptions<T>) {
		return this.model.findAll(merge(options, this.getOptionsDefault())).then((rows) => rows.length);
	}

	findAll(options?: FindOptions<T>) {
		return this.model.findAll(merge(options, this.getOptionsDefault()));
	}

	findOneById(id: number, options?: FindOptions<T>) {
		return this.model.findOne(merge({ where: { id } }, options, this.getOptionsDefault()));
	}
	findOneByIdCode(code: string, options?: FindOptions<T>) {
		return this.model.findOne(merge({ where: { activation_code: code } }, options, this.getOptionsDefault()));
	}

	findOneBy(id_unidrogas: string, options?: FindOptions<T>) {
		return this.model.findOne(merge({ where: { id_unidrogas } }, options, this.getOptionsDefault()));
	}
	update(data: updateData<T>, options: Omit<UpdateOptions<Attributes<T>>, "returning">): Promise<T[]> {
		return this.model
			.update<T>(data, {
				...options,
				returning: true,
			})
			.then(([, rows]) => rows);
	}

	remove(id: number, options?: Omit<UpdateOptions<Attributes<T>>, "returning">) {
		const deleteDate: any = { [this.deletedField]: new Date() };
		const where: any = { id };
		return this.update(deleteDate, merge({ where: { ...where } }, options));
	}

	delete(id: number, options?: Omit<UpdateOptions<Attributes<T>>, "returning">) {
		const deleteDate: any = { [this.deletedField]: new Date() };
		const where: any = { id };
		return this.remove(deleteDate, merge({ where: { ...where } }, options));
	}
}
