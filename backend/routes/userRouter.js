const Router = require("express").Router;
const userController = require("../controllers/userController");
const auth = require("../midllewares/auth");

const router = new Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/auth", auth, userController.checkAuth);

module.exports = router;
