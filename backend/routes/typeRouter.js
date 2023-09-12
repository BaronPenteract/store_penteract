const Router = require("express").Router;

const typeController = require("../controllers/typeController");
const checkRole = require("../midllewares/checkRole");

const router = new Router();

router.post("/", checkRole("ADMIN"), typeController.create);
router.get("/", typeController.getAll);

module.exports = router;
