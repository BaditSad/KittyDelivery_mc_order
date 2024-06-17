var mongoose = require("mongoose");
var Order = require("./models/order");

var mongoDB = "mongodb://mongo:27017/kittydelivery";
mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateOrderDates() {
  let orderDate = randomDate(new Date(2022, 0, 1), new Date());
  let deliveryDate = randomDate(
    orderDate,
    new Date(orderDate.getTime() + 24 * 60 * 60 * 1000)
  );
  return { orderDate, deliveryDate };
}

db.once("open", async function () {
  console.log("Connected to MongoDB");

  try {
    await Order.deleteMany({});
    console.log("Orders collection cleared");

    let orders = [
      {
        user_id: 1,
        user_name: "Alice",
        restaurant_id: 1,
        restaurant_name: "Le Gourmet",
        restaurant_address: "123 Rue Principale, Ville A",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 50.0,
        order_items: ["Burger", "Menu du Jour"],
        delivery_address: "456 Rue de la Liberté, Ville B",
        delivery_person_accept_id: 1,
        delivery_person_refuse_id: [2],
        delivery_status: "pending",
        qr_code: "ABC123",
      },
      {
        user_id: 2,
        user_name: "Bob",
        restaurant_id: 2,
        restaurant_name: "Chez Luigi",
        restaurant_address: "456 Rue Secondaire, Ville B",
        order_date: new Date(),
        order_status: "refused",
        order_total_amount: 30.0,
        order_items: ["Pâtes", "Tiramisu"],
        delivery_address: "789 Rue de la Paix, Ville C",
        delivery_person_accept_id: null,
        delivery_person_refuse_id: [3, 4],
        delivery_status: "pending",
        qr_code: "DEF456",
      },
      {
        user_id: 3,
        user_name: "Charlie",
        restaurant_id: 3,
        restaurant_name: "Salad & Smoothie",
        restaurant_address: "789 Rue Tertiaire, Ville C",
        order_date: new Date(),
        order_status: "canceled",
        order_total_amount: 40.0,
        order_items: ["Salade", "Smoothie"],
        delivery_address: "321 Rue de la République, Ville D",
        delivery_person_accept_id: null,
        delivery_person_refuse_id: [5],
        delivery_status: "pending",
        qr_code: "GHI789",
      },
      {
        user_id: 10,
        user_name: "David",
        restaurant_id: 1,
        restaurant_name: "Le Gourmet",
        restaurant_address: "123 Rue Principale, Ville A",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 25.0,
        order_items: ["Nuggets", "Menu Enfant"],
        delivery_address: "654 Avenue de la Victoire, Ville E",
        delivery_person_accept_id: 6,
        delivery_person_refuse_id: [2],
        delivery_status: "finished",
        qr_code: "JKL012",
      },
      {
        user_id: 4,
        user_name: "Eve",
        restaurant_id: 2,
        restaurant_name: "Chez Luigi",
        restaurant_address: "456 Rue Secondaire, Ville B",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 60.0,
        order_items: ["Foie gras", "Filet mignon", "Crème brûlée"],
        delivery_address: "987 Boulevard des Champs, Ville F",
        delivery_person_accept_id: 7,
        delivery_person_refuse_id: [4],
        delivery_status: "pending",
        qr_code: "MNO345",
      },
      {
        user_id: 5,
        user_name: "Frank",
        restaurant_id: 3,
        restaurant_name: "Salad & Smoothie",
        restaurant_address: "789 Rue Tertiaire, Ville C",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 25.0,
        order_items: ["Sushi assortis", "Mochi glacé"],
        delivery_address: "159 Place de la Liberté, Ville G",
        delivery_person_accept_id: 8,
        delivery_person_refuse_id: [6],
        delivery_status: "finished",
        qr_code: "PQR678",
      },
      {
        user_id: 1,
        user_name: "Alice",
        restaurant_id: 1,
        restaurant_name: "Le Gourmet",
        restaurant_address: "456 Rue Secondaire, Ville B",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 50.0,
        order_items: ["Pâtes", "Menu Italien"],
        delivery_address: "123 Rue Principale, Ville A",
        delivery_person_accept_id: 1,
        delivery_person_refuse_id: [2],
        delivery_status: "pending",
        qr_code: "ABC124",
      },
      {
        user_id: 2,
        user_name: "Bob",
        restaurant_id: 2,
        restaurant_name: "Chez Luigi",
        restaurant_address: "456 Rue Secondaire, Ville B",
        order_date: new Date(),
        order_status: "refused",
        order_total_amount: 30.0,
        order_items: ["Pizza", "Salade"],
        delivery_address: "1313 Voie Rapide, Ville H",
        delivery_person_accept_id: null,
        delivery_person_refuse_id: [3, 4],
        delivery_status: "pending",
        qr_code: "DEF457",
      },
      {
        user_id: 3,
        user_name: "Charlie",
        restaurant_id: 3,
        restaurant_name: "Salad & Smoothie",
        restaurant_address: "789 Rue Tertiaire, Ville C",
        order_date: new Date(),
        order_status: "canceled",
        order_total_amount: 40.0,
        order_items: ["Salade César", "Jus de fruits"],
        delivery_address: "78 Rue Tertiaire, Ville I",
        delivery_person_accept_id: null,
        delivery_person_refuse_id: [5],
        delivery_status: "pending",
        qr_code: "GHI790",
      },
      {
        user_id: 4,
        user_name: "David",
        restaurant_id: 1,
        restaurant_name: "Le Gourmet",
        restaurant_address: "123 Rue Principale, Ville A",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 25.0,
        order_items: ["Menu du Jour"],
        delivery_address: "3 Rue Secondaire, Ville J",
        delivery_person_accept_id: 1,
        delivery_person_refuse_id: [2],
        delivery_status: "finished",
        qr_code: "JKL013",
      },
      {
        user_id: 11,
        user_name: "Eve",
        restaurant_id: 2,
        restaurant_name: "Chez Luigi",
        restaurant_address: "456 Rue Secondaire, Ville B",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 60.0,
        order_items: ["Foie gras", "Filet mignon", "Crème brûlée"],
        delivery_address: "26 Rue Secondaire, Ville K",
        delivery_person_accept_id: 9,
        delivery_person_refuse_id: [4],
        delivery_status: "pending",
        qr_code: "MNO346",
      },
      {
        user_id: 5,
        user_name: "Frank",
        restaurant_id: 3,
        restaurant_name: "Salad & Smoothie",
        restaurant_address: "789 Rue Tertiaire, Ville C",
        order_date: new Date(),
        order_status: "accepted",
        order_total_amount: 25.0,
        order_items: ["Sushi assortis", "Pad Thai"],
        delivery_address: "1414 Place du Marché, Ville L",
        delivery_person_accept_id: 5,
        delivery_person_refuse_id: [6],
        delivery_status: "finished",
        qr_code: "PQR679",
      },
    ];

    orders = orders.map((order) => {
      let { orderDate, deliveryDate } = generateOrderDates();
      return {
        ...order,
        order_date: orderDate,
        delivery_date: deliveryDate,
      };
    });

    await Order.insertMany(orders);
    console.log("Orders inserted successfully");
  } catch (err) {
    console.error("Error inserting orders:", err);
  } finally {
    mongoose.connection.close();
  }
});
