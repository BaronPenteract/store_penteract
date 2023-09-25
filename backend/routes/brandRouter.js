const Router = require("express").Router;
const brandController = require("../controllers/brandController");
const checkRole = require("../midllewares/checkRole");
const auth = require("../midllewares/auth");

const router = new Router();

const { ADMIN } = require("../utils/constants");

router.post("/", auth, checkRole(ADMIN), brandController.create);
router.get("/", brandController.getAll);

module.exports = router;
