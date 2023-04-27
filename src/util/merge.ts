function keysOf(obj: any) {
	return Reflect.ownKeys(obj).filter((key: string) => key !== "length");
}

// function merge immutable objects with concat arrays
export function merge(...objs: any[]): any {
	const result: any = {};
	for (const obj of objs) {
		const keys = keysOf(obj || {});
		for (const key of keys) {
			if (obj[key] !== null && typeof obj[key] === "object") {
				if (Array.isArray(obj[key])) {
					if (result[key] && !Array.isArray(result[key])) {
						result[key] = [result[key]];
					}
					result[key] = (result[key] || []).concat(obj[key]);
				} else {
					result[key] = merge(result[key], obj[key]);
				}
			} else {
				result[key] = obj[key];
			}
		}
	}
	return result;
}

export function arrayToObject(array: any[], k1: string, k2: string) {
	return array.reduce((obj, item) => {
		obj[item[k1]] = item;
		if (item[k2]) obj[item[k1]].include = arrayToObject(Array.isArray(item[k2]) ? item[k2] : [item[k2]], k1, k2);
		return obj;
	}, {});
}

export function objectToArray(obj: any, k1: string, k2: string) {
	return Object.keys(obj).map(key => {
		const item = obj[key];
		if (item[k2]) item[k2] = objectToArray(item[k2], k1, k2);
		return { [k1]: key, ...item };
	});
}

export function mergeIncludes(...args: any[]) {
	const objs = args.map(it => arrayToObject(it, 'association', 'include'));
	return objectToArray(merge(objs[0], ...objs.slice(1)), 'association', 'include');
}
