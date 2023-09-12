const Router = require("express").Router;
const deviceController = require("../controllers/deviceController");
const checkRole = require("../midllewares/checkRole");

const router = new Router();

router.post("/", checkRole("ADMIN"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOneByID);
router.delete("/:id", checkRole("ADMIN"), deviceController.deleteById);

module.exports = router;
