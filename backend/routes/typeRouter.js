const Router = require("express").Router;

const typeController = require("../controllers/typeController");
const checkRole = require("../midllewares/checkRole");
const auth = require("../midllewares/auth");

const router = new Router();

const { ADMIN } = require("../utils/constants");

router.post("/", auth, checkRole(ADMIN), typeController.create);
router.get("/", typeController.getAll);

module.exports = router;
