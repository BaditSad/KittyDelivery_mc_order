const fs = require("fs");
const path = require("path");

const method = process.argv[2].toLowerCase();
const modelName =
  process.argv[3].charAt(0).toUpperCase() + process.argv[3].slice(1);
const modelFileName = `${modelName.toLowerCase()}.js`;

const supportedMethods = ["get", "post", "put", "delete"];

if (!supportedMethods.includes(method)) {
  console.error("Unsupported method. Use one of: get, post, put, delete.");
  process.exit(1);
}

const modelTemplate = {
  Article: () => `
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  article_name: { type: String, required: true },
  article_description: { type: String, required: true },
  article_price: { type: Number, required: true },
  restaurant_id: { type: Number, required: true },
  article_type: { type: String, required: true },
});

module.exports = mongoose.model("Article", articleSchema);
`,
  Delivery: () => `
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  order_id: { type: Number, required: true },
  delivery_status: { type: String, required: true },
  delivery_date: { type: Date, required: true },
  delivery_person_id: { type: Number, required: true },
  qr_code: { type: String, required: true },
  restaurant_id: { type: Number, required: true }
});

module.exports = mongoose.model("Delivery", deliverySchema);
`,
  Menu: () => `
  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;
  
  const menuSchema = new Schema({
    restaurant_id: { type: Number, required: true },
    menu_name: { type: String, required: true },
    article_list: { type: String, required: true },
    menu_price: { type: Number, required: true },
    menu_description: { type: String, required: true },
  });
  
  module.exports = mongoose.model('Menu', menuSchema);
  
`,
  Notification: () => `
  var mongoose = require("mongoose");
  var Schema = mongoose.Schema;
  
  var notificationSchema = new Schema({
    notification_type: { type: String, required: true },
    notification_message: { type: String, required: true },
    notification_date: { type: Date, required: true },
    user_id: { type: Number, required: true },
  });
  
  module.exports = mongoose.model("Notification", notificationSchema);  
`,
  Order: () => `
  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  
  const orderSchema = new Schema({
    user_id: { type: Number, required: true },
    restaurant_id: { type: Number, required: true },
    delivery_id: { type: Schema.Types.ObjectId, required: false },
    order_date: { type: Date, required: true },
    order_status: { type: String, required: true },
    order_total_amount: { type: Number, required: true },
    order_items: { type: String, required: true },
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  
`,
};

const modelsDir = path.join(__dirname, "backend", "models");
const modelFilePath = path.join(modelsDir, modelFileName);

let modelContent = "";

if (modelTemplate[modelName]) {
  modelContent = modelTemplate[modelName]();
} else {
  console.error("Model not found.");
  process.exit(1);
}

if (!fs.existsSync(modelFilePath)) {
  fs.writeFileSync(modelFilePath, modelContent);
  console.log(`Model ${modelName} created successfully.`);
} else {
  console.log(`Model ${modelName} already exists.`);
}

const frontendTemplate = {
  get: (model) => `
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const get${model} = async () => {
  try {
    const response = await axios.get(\`\${API_URL}/${model.toLowerCase()}s\`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de ${model.toLowerCase()}:", error);
    throw error;
  }
};`,

  post: (model) => `
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const create${model} = async (data) => {
  try {
    const response = await axios.post(\`\${API_URL}/${model.toLowerCase()}s\`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de ${model.toLowerCase()}:", error);
    throw error;
  }
};`,

  put: (model) => `
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const update${model} = async (id, data) => {
  try {
    const response = await axios.put(\`\${API_URL}/${model.toLowerCase()}s/\${id}\`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de ${model.toLowerCase()}:", error);
    throw error;
  }
};`,

  delete: (model) => `
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const delete${model} = async (id) => {
  try {
    const response = await axios.delete(\`\${API_URL}/${model.toLowerCase()}s/\${id}\`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de ${model.toLowerCase()}:", error);
    throw error;
  }
};`,
};

const backendTemplate = {
  get: (model) => `
router.get("/${model.toLowerCase()}s", async (req, res) => {
  try {
    const ${model.toLowerCase()} = await ${model}.find({});
    res.json(${model.toLowerCase()});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
`,

  post: (model) => `
router.post("/${model.toLowerCase()}s", async (req, res) => {
  try {
    const ${model.toLowerCase()} = new ${model}(req.body);
    await ${model.toLowerCase()}.save();
    res.status(201).json(${model.toLowerCase()});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
`,

  put: (model) => `
router.put("/${model.toLowerCase()}s/:id", async (req, res) => {
  try {
    const ${model.toLowerCase()} = await ${model}.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(${model.toLowerCase()});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
`,

  delete: (model) => `
router.delete("/${model.toLowerCase()}s/:id", async (req, res) => {
  try {
    const ${model.toLowerCase()} = await ${model}.findByIdAndDelete(req.params.id);
    res.json({ message: "${model} deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
`,
};

// Create frontend service file
const frontendDir = path.join(__dirname, "frontend", "src", "services");
const frontendFilePath = path.join(
  frontendDir,
  `Handler${method.charAt(0).toUpperCase() + method.slice(1)}${modelName}s.js`
);
fs.writeFileSync(frontendFilePath, frontendTemplate[method](modelName));

// Create or update backend controller file
const backendDir = path.join(__dirname, "backend", "controllers");
const backendFilePath = path.join(backendDir, `${modelName}Controller.js`);
let backendFileContent = "";

if (fs.existsSync(backendFilePath)) {
  backendFileContent = fs.readFileSync(backendFilePath, "utf8");

  if (
    !backendFileContent.includes(
      `const ${modelName} = require("../models/${modelName.toLowerCase()}");`
    )
  ) {
    const requireLine = `const ${modelName} = require("../models/${modelName.toLowerCase()}");\n`;
    const routerIndex = backendFileContent.indexOf(
      "const router = express.Router();"
    );
    backendFileContent = [
      backendFileContent.slice(0, routerIndex + 30),
      requireLine,
      backendFileContent.slice(routerIndex + 30),
    ].join("");
  }

  if (
    !backendFileContent.includes(
      `router.${method}("/${modelName.toLowerCase()}s/:id"`
    )
  ) {
    backendFileContent += backendTemplate[method](modelName);
  }
} else {
  backendFileContent = `
const express = require("express");
const router = express.Router();
module.exports = router;
const ${modelName} = require("../models/${modelName.toLowerCase()}");
${backendTemplate[method](modelName)}
`;
}

fs.writeFileSync(backendFilePath, backendFileContent);

// Update backend server.js
const serverFilePath = path.join(__dirname, "backend", "server.js");
let serverFileContent = fs.readFileSync(serverFilePath, "utf8");

const controllerRequireLine = `const ${modelName.toLowerCase()}sRouter = require("./controllers/${modelName}Controller");\n`;
const controllerUseLine = `app.use("/api", ${modelName.toLowerCase()}sRouter);\n`;

if (!serverFileContent.includes(controllerRequireLine)) {
  serverFileContent = controllerRequireLine + serverFileContent;
}

if (!serverFileContent.includes(controllerUseLine)) {
  const appUseIndex = serverFileContent.indexOf("app.use");
  serverFileContent = [
    serverFileContent.slice(0, appUseIndex),
    controllerUseLine,
    serverFileContent.slice(appUseIndex),
  ].join("");
}

fs.writeFileSync(serverFilePath, serverFileContent);

console.log(
  `${method.toUpperCase()} endpoint for ${modelName} created successfully.`
);
