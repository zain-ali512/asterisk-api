// Imports
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
//const sequelize = require("./config/dbConfig");
// require("./models");

// Config
const PORT = process.env.PORT || 8001;
const app = express();
app.use(bodyparser.json());

/*Sync sql tables
sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Database and tables created!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });*/

// Cors options
const allowedOrigins = [
  "http://localhost:5173",
  "https://crud-project-by-zain.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
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

// Routes
app.use("/sip", require("./routes/sipRoutes"));
app.use("/extn", require("./routes/extnRoutes"));

// Server
app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});
