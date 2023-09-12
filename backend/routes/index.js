const Router = require("express").Router;

const auth = require("../midllewares/auth");

const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const deviceRouter = require("./deviceRouter");
const typeRouter = require("./typeRouter");
const basketRouter = require("./basketRouter");
const ratingRouter = require("./ratingRouter");

const router = new Router();

router.use("/user", userRouter);
router.use("/device", deviceRouter);
router.use("/rating/device", ratingRouter);
router.use("/brand", brandRouter);
router.use("/type", typeRouter);
router.use("/basket", auth, basketRouter);

module.exports = router;
