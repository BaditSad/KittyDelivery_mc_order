require("dotenv").config(); // Charger les variables d'environnement à partir de .env

const ordersRouter = require("./controllers/OrderController");
const deliveriesRouter = require("./controllers/DeliveryController");
const restaurantsRouter = require("./controllers/RestaurantController");
const usersRouter = require("./controllers/UserController");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const swaggerDocumentd = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"))
);

app.use(cors());
app.use(bodyParser.json());

app.use("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocumentd);
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit();
  });

// Routes vers les différents contrôleurs
app.use("/orders", ordersRouter);
app.use("/deliveries", deliveriesRouter);
app.use("/user", usersRouter);
app.use("/restaurant", restaurantsRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
