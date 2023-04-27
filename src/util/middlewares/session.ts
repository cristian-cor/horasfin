import expressSession from "express-session";
import MemoryStore from "memorystore";

const Store = MemoryStore(expressSession);

const sessionOptions: expressSession.SessionOptions = {
	secret: process.env.SESSION_SECRET,
	cookie: { secure: true, maxAge: 86400000 },
	store: new Store({ checkPeriod: 86400000 }),
	resave: true,
	saveUninitialized: true,
};

export default expressSession(sessionOptions);
