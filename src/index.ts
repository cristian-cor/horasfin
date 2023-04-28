import makeApp from "./app";
import Sync from "./util/sync";

const { app } = makeApp();

if (process.env.DB_SYNC === "true") {
	// noinspection JSIgnoredPromiseFromCall
	Sync.synchronize();
}

app.listen(3000, () => {
	console.log(`Example app listening on port ${3000}`);
});
