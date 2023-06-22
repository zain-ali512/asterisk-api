const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const sequelize = require("./config/dbConfig");
require("./models/extensionsModel");

dotenv.config();
const PORT = process.env.PORT || 8001;
const app = express();
app.use(bodyparser.json());

sequelize.sync({
  /* alter: true */
});

app.use("/", require("./routes/extensionsRoutes"));

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
