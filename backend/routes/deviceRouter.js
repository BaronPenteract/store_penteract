const Router = require("express").Router;
const deviceController = require("../controllers/deviceController");
const checkRole = require("../midllewares/checkRole");
const auth = require("../midllewares/auth");

const router = new Router();

const { ADMIN } = require("../utils/constants");

router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOneByID);

router.post("/", auth, checkRole(ADMIN), deviceController.create);
router.delete("/:id", auth, checkRole(ADMIN), deviceController.deleteById);

module.exports = router;
