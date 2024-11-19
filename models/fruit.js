// models/fruit.js
const mongoose = require("mongoose");

// fruit schema
const fruitSchema = new mongoose.Schema({
  name: String,
  isReadyToEat: Boolean,
});

// Fruit model
const Fruit = mongoose.model("Fruit", fruitSchema); // create model
module.exports = Fruit;