import { FindOptions, IncludeOptions, Op } from "sequelize";
import { Request } from "./request";
import { mergeIncludes } from "./merge";

function keysOf(obj: any) {
	return Reflect.ownKeys(obj).filter((key: string) => key !== "length");
}

function makeAssociations(as: string[], type: "left" | "right" | "inner", value: any, i: number = 0): IncludeOptions {
	return {
		association: as[i],
		attributes: [],
		where: { deleted_at: "1969-12-31T23:59:59+00:00" },
		right: type === "right",
		required: type === "inner",
		...(as[i + 2]
			? { include: [makeAssociations(as, type, value, i + 1)], where: [] }
			: { where: { [as[i + 1]]: value, deleted_at: "1969-12-31T23:59:59+00:00" } }),
	};
}

function getIncludes(query: any) {
	const keys = keysOf(query || {});
	const includes: IncludeOptions[] = [];

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (typeof key === "string") {
			const left = /^\$(?<association>[\w.]+)\$$/gi.exec(key);
			const right = /^\$(?<association>[\w.]+)\$\$$/gi.exec(key);
			const inner = /^\$\$(?<association>[\w.]+)\$\$$/gi.exec(key);
			if (left || right || inner) {
				let associations;
				let type: "left" | "right" | "inner";

				if (left) {
					associations = left.groups.association.split(".");
					type = "left";
				} else if (right) {
					associations = right.groups.association.split(".");
					type = "right";
				} else if (inner) {
					associations = inner.groups.association.split(".");
					type = "inner";
				}

				associations = associations.slice(0, associations.length);
				includes.push(makeAssociations(associations, type, query[key], 0));
				delete query[key];
			} else if (query[key] !== null && typeof query[key] === "object") {
				includes.push(...getIncludes(query[key]));
			}
		} else if (query[key] !== null && typeof query[key] === "object") {
			includes.push(...getIncludes(query[key]));
		}
	}
	return includes;
}

function cleanObject(obj: any) {
	const keys = keysOf(obj || {});
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (typeof obj[key] === "object") {
			cleanObject(obj[key]);
			if (Array.isArray(obj[key]) && obj[key].length === 0) {
				delete obj[key];
			} else if (keysOf(obj[key]).length === 0) {
				obj.splice(key, 1);
			}
		} else if (obj[key] === null || obj[key] === undefined) {
			delete obj[key];
		}
	}
	return obj;
}

export function makeQuery<T = any>(req: Request<T>): FindOptions<T> {
	const abilities = req.queryAbilities || null;
	const query = req.queryClient || null;
	let where: any;
	if (abilities) {
		if (!where) where = {};
		if (!where[Op.and]) where[Op.and] = [];
		where[Op.and].push(abilities);
	}
	if (query) {
		if (!where) where = {};
		if (!where[Op.and]) where[Op.and] = [];
		where[Op.and].push(query);
	}
	const include = getIncludes(where);
	if (where) {
		where = cleanObject(where);
	}

	return {
		...(where ? { where } : {}),
		...(include.length > 0 ? { include: mergeIncludes(...include.map((it) => [it])) } : {}),
		...(req.pagination ? req.pagination : {}),
		...(req.sort ? { order: req.sort as any } : {}),
	};
}
