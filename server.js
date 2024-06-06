const notificationsRouter = require("./controllers/NotificationController");
const ordersRouter = require("./controllers/OrderController");
const deliveriesRouter = require("./controllers/DeliveryController");
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Ici on envoit les infos vers le front

app.use(bodyParser.json());

app.use("/api", notificationsRouter);
app.use("/api", ordersRouter);
app.use("/api", deliveriesRouter);

app.listen(port, () => console.log('app running on http://localhost:3000'));