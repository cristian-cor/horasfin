import { ModelStatic } from "sequelize";

class Sync {
	public static models: ModelStatic<any>[] = [];

	public static register(model: ModelStatic<any>) {
		Sync.models.push(model);
	}

	public static async synchronize() {
		for (const model of Sync.models) {
			await model.sync({});
		}
	}
}

export default Sync;
