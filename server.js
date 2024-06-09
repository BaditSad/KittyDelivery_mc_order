const ordersRouter = require("./controllers/OrderController");
const deliveriesRouter = require("./controllers/DeliveryController");
const restaurantsRouter = require("./controllers/RestaurantController");
const usersRouter = require("./controllers/UserController");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3004;

app.use(cors());

const db = require("./models");
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Ici on envoit les infos vers le front

app.use(bodyParser.json());

app.use("/orders", ordersRouter);
app.use("/deliveries", deliveriesRouter);
app.use("/user", usersRouter);
app.use("/restaurant", restaurantsRouter);

app.listen(port, () => console.log(`app running on http://localhost:${port}`));
