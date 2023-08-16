// Imports
const app = require("express")();
const cors = require("cors");
const sequelize = require("./config/dbConfig");
require("dotenv").config();
require("./models");

// Config
app.use(require("express").json());

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

// Create or sync database tables
sequelize.sync()
  .then(() => {
    console.log('Tables created / updated');
  })
  .catch((err) => {
    console.error('Cannot create / update tables.', err);
  });


// Routes
app.use("/sip", require("./routes/sipRoutes"));
app.use("/extn", require("./routes/extnRoutes"));
app.use("/astr", require("./routes/astr"));

// Server start
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
