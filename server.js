// Imports
const app = require("express")();
const cors = require("cors");
require("dotenv").config();

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

// Routes
app.use("/sip", require("./routes/sipRoutes"));
app.use("/extn", require("./routes/extnRoutes"));
app.use("/ivr", require("./routes/ivrRoutes"));

// Server start
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
