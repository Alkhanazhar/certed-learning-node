require("dotenv").config();

const express = require("express");
const app = express()
const cors = require("cors");
const port = process.env.PORT || 8789;
const path = require("path");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors("*"));

require("./models/index")

const apiRoutes = require("./routes/api.routes");

app.use("/api", apiRoutes);


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Page Not Found",
    method: req.method,
    path: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log("Server is listening on port: ", port)
})