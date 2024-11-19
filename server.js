

// Here is where we import modules

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new
const path = require("path");
dotenv.config();
const app = express();
// Import the Fruit model
const Fruit = require("./models/fruit.js");


// form data to js object middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new
app.use(express.static(path.join(__dirname, "public"))); // serves static files from directory
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// log connection status
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
/////////////////////code//////////////////////////////
// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// GET /fruits
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find();
 res.render("fruits/index.ejs", { fruits: allFruits });
});

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    res.render('fruits/new.ejs')
  });

app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
  });
  
app.get("/fruits/:fruitId/edit", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/edit.ejs", {
    fruit: foundFruit,
  });
});

// POST /fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
      } else {
        req.body.isReadyToEat = false;
      }
      await Fruit.create(req.body);
    console.log(req.body);
    res.redirect("/fruits");
  });

  //DELETE Fruits
  app.delete("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
    if(req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }

  // Update fruit in the database
    await Fruit.findByIdAndDelete(req.params.fruitId);

  // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });

  
  app.listen(3007, () => {
    console.log("Listening on port 3007");
  });
  