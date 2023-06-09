// Dependencies
const bcrypt = require("bcrypt");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const sequelize = require("./config/connection");
const models = require("./models");
const { apiRouter, frontendRouter } = require("./controllers");
const path = require("path");
const hbs = exphbs.create({});
const SequelizeStore = require("connect-session-sequelize")(session.Store);

async function main() {
	const app = express();
	const PORT = process.env.PORT || 3001;

	const sess = {
		secret: "972eece8-7efe-4d70-89d5-18059dbc5566",
		cookie: {
			maxAge: 300000,
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		},
		resave: false,
		saveUninitialized: true,
		store: new SequelizeStore({
			db: sequelize,
		}),
	};

	app.use(session(sess));
	app.engine("handlebars", hbs.engine);
	app.set("view engine", "handlebars");
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(express.static(path.join(__dirname, "public")));

	app.use("/", frontendRouter);
	app.use("/api", apiRouter);

	await sequelize.sync({ force: true });
	app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
}

main();
