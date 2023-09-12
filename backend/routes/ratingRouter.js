const Router = require("express").Router;

const ratingController = require("../controllers/ratingController");
const auth = require("../midllewares/auth");

const router = new Router();

router.post("/:id([0-9]+)/rate/:rate([1-5])", auth, ratingController.create);
router.delete("/:id([0-9]+)", auth, ratingController.delete);
router.get("/:id([0-9]+)", ratingController.getOneById);

module.exports = router;
