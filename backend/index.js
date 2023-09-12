require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const models = require("./models/models");
const routes = require("./routes");
const errorHandler = require("./midllewares/errorHandler");
const auth = require("./midllewares/auth");
const { NotFoundError } = require("./utils/errors");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, "static")));

//Routes
app.use("/api", routes);

app.use(auth, (req, res, next) => {
  next(new NotFoundError());
});

// Обработка ошибок
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
