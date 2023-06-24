const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const sequelize = require("./config/dbConfig");
const cors = require("cors");
require("./models/sipModel");

dotenv.config();
const PORT = process.env.PORT || 8001;
const app = express();
app.use(bodyparser.json());

sequelize.sync({
  /*force: true*/
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://crud-project-by-zain.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use("/", require("./routes/sipRoutes"));

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
