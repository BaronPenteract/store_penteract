const Router = require("express").Router;
const userController = require("../controllers/userController");
const auth = require("../midllewares/auth");
const checkRole = require("../midllewares/checkRole");

const router = new Router();

const { ADMIN } = require("../utils/constants");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/auth", auth, userController.checkAuth);

router.get("/getAll", auth, checkRole(ADMIN), userController.getAll);
router.post("/create", auth, checkRole(ADMIN), userController.create);
router.delete("/delete/:id", auth, checkRole(ADMIN), userController.delete);

module.exports = router;
