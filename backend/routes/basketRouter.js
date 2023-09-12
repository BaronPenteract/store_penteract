const Router = require("express").Router;
const basketController = require("../controllers/basketController");

const router = new Router();

router.post("/", basketController.add);
router.get("/", basketController.getAll);
router.delete("/:id", basketController.remove);

module.exports = router;
