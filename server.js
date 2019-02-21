const express = require("express"),
  app = express(),
  ejs = require("ejs"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  layout = require("express-layout"),
  passport = require("passport"),
  expressSession = require("express-session"),
  connectMongo = require("connect-mongo")(expressSession),
  expressFlash = require("express-flash"),
  cookieParser = require("cookie-parser");

const config = require("./config/secret");
const auth = require("./middlewares/requireLogin");
const addToCartAuth = require("./middlewares/addToCartAuth");

//models
require("./models/User");
require("./models/Product");
require("./models/Cart");
require("./models/Billing");
require("./models/Contact");
require("./authentication/socialAuth");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(layout());
app.set("layouts", "./views/layouts");
app.set("layout", "layout");

const Product = mongoose.model("products");
const Cart = mongoose.model("carts");

//sessesion midleware
app.use(
  expressSession({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: new connectMongo({ url: config.database, autoReconnect: true })
  })
);
app.use(expressFlash());
////////////////////////passport config/////////////
app.use(cookieParser());
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //for session handling (persistent logins)
app.use(async (req, res, next) => {
  res.locals.user = req.user;
  const userIsLoggedIn = req.user ? req.user._id : null;
  res.locals.cartCheckout_number = await Cart.find({
    user: userIsLoggedIn,
    hasCheckedout: false
  });
  //fetch product cat
  res.locals.productsMen_1 = await Product.aggregate([
    { $match: { category: "Men" } }
  ]);

  res.locals.productsWomen_1 = await Product.aggregate([
    { $match: { category: "Women" } }
  ]);
  res.locals.productsBoys_1 = await Product.aggregate([
    { $match: { category: "Boys" } }
  ]);
  res.locals.productsGirls_1 = await Product.aggregate([
    { $match: { category: "Girls" } }
  ]);
  res.locals.numberWithCommas = function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  next();
});
//connect to db
mongoose.Promise = global.Promise;
mongoose.connect(
  config.database,
  function(err) {
    if (err) {
      console.log(err.message);
    } else {
      console.log("database connected");
    }
  }
);

//ROUTES/////

//Home
require("./routes/home/views")(app, auth);
require("./routes/home/api")(app, auth, addToCartAuth);
require("./routes/authApi")(app);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log("Tajiri connected successfully at port: ", port);
});
