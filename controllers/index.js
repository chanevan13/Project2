const bcrypt = require("bcrypt");
const express = require("express");
const models = require("../models");
const apiRouter = express.Router();
const frontendRouter = express.Router();

const SALT_ROUNDS = 7;

function sequelizeErrorHandler(req, res, next) {
	try {
		next();
	} catch (err) {
		if (err.name === "SequelizeValidationError") {
			const errors = err.errors.map((error) => error.message);
			return res
				.status(400)
				.json({ error: "Validation Error", details: errors });
		} else if (err.name === "SequelizeUniqueConstraintError") {
			const errors = err.errors.map((error) => error.message);
			return res
				.status(400)
				.json({ error: "Unique Constraint Error", details: errors });
		}

		console.error("Unhandled error:", err);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

async function loggedInMiddleware(req, res, next) {
	const user = await models.User.findByPk(req.session.userId);
	if (!user) {
		res.redirect("/login");
		return;
	}
	req.user = user;
	next();
}

frontendRouter.get("/", (req, res) => res.render("homepage"));
frontendRouter.get("/login", (req, res) => {
	if (req.session.userId) res.redirect("/lists");
	res.render("login");
});
frontendRouter.get("/dashboard", (req, res) => res.redirect("/lists"));

frontendRouter.get(
	"/lists",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const user = await models.User.findByPk(req.session.userId, {
			include: models.List,
		});
		res.render("lists", { lists: user.lists.map((x) => x.toJSON()) });
	},
);

frontendRouter.post(
	"/lists",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const list = await models.List.create(req.body);
		if (!list) {
			res.status(400).send("Couldn't create list");
			return;
		}
		await req.user.addList(list);
		res.redirect("/lists");
	},
);

frontendRouter.get(
	"/lists/:id",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const list = await models.List.findByPk(req.params.id, {
			include: models.Item,
		});
		if (!list) {
			res.redirect("/lists");
			return;
		}
		res.render("list", list.toJSON());
	},
);

frontendRouter.post(
	"/lists/:id",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const list = await models.List.findByPk(req.params.id);
		if (!list) {
			res.status(404).send("List not found");
			return;
		}
		const item = await models.Item.create(req.body);
		if (!item) {
			res.status(400).send("Could not create item");
			return;
		}
		await list.addItem(item);
	},
);
frontendRouter.delete(
	"/lists/:id",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const list = await models.List.findByPk(req.params.id, {
			include: models.Item,
		});
		if (!list) {
			res.status(400).send("Could not delete list");
			return;
		}
		await models.Item.destroy({ where: { listId: req.params.id } });
		await list.destroy();
    res.status(200).send("success");
	},
);

frontendRouter.delete(
	"/lists/:id/:itemId",
	loggedInMiddleware,
	sequelizeErrorHandler,
	async (req, res) => {
		const item = await models.Item.findByPk(req.params.itemId);
    console.log(item);
		if (!item) {
			res.status(400).send("Couldn't delete the requested item");
			return;
		}
    item.destroy();
    res.status(200).send("success")
	},
);

apiRouter.post("/users/login", async (req, res) => {
	const user = await models.User.findOne({
		where: { username: req.body.username },
	});
	if (!user) {
		res.status(400).send("No user by that name");
	}
	if (await bcrypt.compare(req.body.password, user.password)) {
		req.session.userId = user.id;
		res.redirect("/lists");
	} else {
		res.status(403).send("Incorrect Password");
	}
});

apiRouter.post("/users", async (req, res) => {
	try {
		const user = await models.User.create({
			username: req.body.username,
			password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
		});
		req.session.userId = user.id;
		res.redirect("/lists");
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = {
	apiRouter,
	frontendRouter,
};
