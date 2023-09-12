const Router = require("express").Router;
const brandController = require("../controllers/brandController");
const checkRole = require("../midllewares/checkRole");

const router = new Router();

router.post("/", checkRole("ADMIN"), brandController.create);
router.get("/", brandController.getAll);

module.exports = router;
