const mongoose = require("mongoose");
const Product = mongoose.model("products");
const Cart = mongoose.model("carts");
const Billing = mongoose.model("billing");

module.exports = (app, auth) => {
  app.get("/", async (req, res) => {
    //fetch product

    const productsMen = await Product.aggregate([
      { $match: { category: "Men" } },
      { $sample: { size: 4 } }
    ]);

    const productsWomen = await Product.aggregate([
      { $match: { category: "Women" } },
      { $sample: { size: 4 } }
    ]);
    const productsBoys = await Product.aggregate([
      { $match: { category: "Boys" } },
      { $sample: { size: 4 } }
    ]);
    const productsGirls = await Product.aggregate([
      { $match: { category: "Girls" } },
      { $sample: { size: 4 } }
    ]);

    res.render("desktop/home", {
      title: "Home",
      page: "home",
      productsMen: productsMen,
      productsWomen: productsWomen,
      productsBoys: productsBoys,
      productsGirls: productsGirls
    });
  });
  app.get("/shop", async (req, res) => {
    //fetch product
    const productsMen = await Product.aggregate([
      { $match: { category: "Men" } },
      { $sample: { size: 4 } }
    ]);

    const productsWomen = await Product.aggregate([
      { $match: { category: "Women" } },
      { $sample: { size: 4 } }
    ]);
    const productsBoys = await Product.aggregate([
      { $match: { category: "Boys" } },
      { $sample: { size: 4 } }
    ]);
    const productsGirls = await Product.aggregate([
      { $match: { category: "Girls" } },
      { $sample: { size: 4 } }
    ]);

    res.render("desktop/shop", {
      title: "Shop",
      page: "shop",
      productsMen: productsMen,
      productsWomen: productsWomen,
      productsBoys: productsBoys,
      productsGirls: productsGirls,
      productsGirls: productsGirls
    });
  });
  app.get("/product/single/:id", async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    const moreProducts = await Product.aggregate([{ $sample: { size: 4 } }]);

    // console.log(moreProducts)
    res.render("desktop/single", {
      title: "Single",
      page: "shop",
      product: product,
      moreProducts: moreProducts
    });
  });
  app.get("/contact", async (req, res) => {
    res.render("desktop/contact", {
      title: "Contact page",
      page: "contact"
    });
  });
  app.get("/product/checkout", auth, async (req, res) => {
    const moreProducts = await Product.aggregate([{ $sample: { size: 4 } }]);
    const cartCount = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    });
    if (cartCount.length === 0) {
      return res.redirect("/");
    }

    if (cartCount[0].items.length === 0) {
      return res.redirect("/");
    }

    const getCart = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    })
      .populate("items.products")
      .sort("-_id");
    res.render("desktop/checkout", {
      title: "Checkout",
      page: "shop",

      getCart,
      moreProducts
    });
  });
  app.get("/products/:qry", async (req, res) => {
    var perPage = 12;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var totalRecord = await Product.find({}).count();

    if (req.params.qry === "all") {
      var count = await Product.find({})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .count();
      var products = await Product.find({})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage);
      console.log(totalRecord);
    } else {
      var count = await Product.find({ category: req.params.qry })
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .count();

      var products = await Product.find({ category: req.params.qry })
        .skip(perPage * pageNumber - perPage)
        .limit(perPage);
    }

    res.render("desktop/product", {
      title: "Product",
      page: "shop",
      products: products,
      selected: req.params.qry,
      current: pageNumber,
      pages: Math.ceil(count / perPage),
      totalRecord: totalRecord
    });
  });

  app.get("/products/discount/:qry", async (req, res) => {
    var perPage = 12;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var totalRecord = await Product.find({}).count();

    if (req.params.qry === "all") {
      var count = await Product.find({})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .count();
      var products = await Product.find({})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage);
      console.log(totalRecord);
    } else {
      var count = await Product.find({ discount: req.params.qry })
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .count();

      var products = await Product.find({ discount: req.params.qry })
        .skip(perPage * pageNumber - perPage)
        .limit(perPage);
    }

    res.render("desktop/productqry", {
      title: "Product",
      page: "product",
      products: products,
      selected: req.params.qry,
      current: pageNumber,
      pages: Math.ceil(count / perPage),
      totalRecord: totalRecord
    });
  });

  app.get("/admin", auth, (req, res) => {
    res.render("desktop/admin/dashboard", {
      title: "Admin",
      layout: false
    });
  });
  app.get("/invoice", auth, async (req, res) => {
    const getCart = await Cart.find({
      user: req.user._id,
      hasCheckedout: true
    })
      .populate("items.products")
      .sort("-_id");
    res.render("desktop/invoice", {
      title: "invoice",
      page: "invoice",
      getCart
    });
  });
};
