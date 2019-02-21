const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_v7ZVDHiaLp9PXgOqQ65c678g");
const Product = mongoose.model("products");
const Cart = mongoose.model("carts");
const Billing = mongoose.model("billing");
const Contact = mongoose.model("contact");

//image upload

var multer = require("multer");
let fs = require("fs-extra");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `./public/images/products`;
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      callback(null, file.originalname);
    }
  })
});

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dtfyfl4kz",
  api_key: "223622844967433",
  api_secret: "r20BlHgHcoH8h-EznEJPQmG6sZ0"
});

module.exports = (app, auth, addToCartAuth) => {
  //new product
  app.post(
    "/api/product",
    upload.fields([
      {
        name: "image1",
        maxcount: 1
      },
      {
        name: "image2",
        maxcount: 1
      },
      {
        name: "image3",
        maxcount: 1
      }
    ]),
    async (req, res) => {
      var req_body = {
        product_name: req.body.product_name,
        price: req.body.price,
        prev_price: req.body.prev_price,
        description: req.body.description,
        image1: req.files.image1[0].filename,
        image2: req.files.image2[0].filename,
        image3: req.files.image3[0].filename,
        category: "Men",
        discount: "50"
      };
      console.log(req_body);
      //console.log(req.files.image1[0])

      const product = await new Product(req_body).save();
      res.redirect("/admin");
    }
  );

  //fetch product
  app.get("/api/products", async (req, res) => {
    const products = await Product.find({});
    return res.send({ success: true, products });
  });

  //fetch categories
  app.get("/api/products", async (req, res) => {
    const categories = await Category.find({});
    return res.send({ success: true, categories });
  });

  //add to cart
  app.post("/api/addToCart", addToCartAuth, async (req, res) => {
    //check if user has a cart
    const cartCount = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    }).count();
    var cartExist = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    });
    const item = {
      products: req.body.product,
      qty: 1,
      price: req.body.price
    };

    if (cartCount === 0) {
      //item does not exsit in cart creat cart

      const newCart = await new Cart({
        items: item,
        user: req.user._id
      }).save();
    } else {
      //checking if product exist
      const productExistCount = await Cart.find({
        _id: cartExist[0]._id,
        items: {
          $elemMatch: { products: req.body.product }
        }
      }).count();
      //  console.log(productExistCount);
      //product exist update product qty
      if (productExistCount !== 0) {
        //update product
        const updatedProduct = await Cart.update(
          {
            _id: cartExist[0]._id,
            items: {
              $elemMatch: { products: req.body.product }
            }
          },
          {
            $inc: { "items.$.qty": 1 }
          }
        );

        //get qty and update price
        const qty_ = await Cart.find(
          { _id: cartExist[0]._id },
          { items: { $elemMatch: { products: req.body.product } } }
        );
        var newPrice = req.body.price * qty_[0].items[0].qty;
        const updatePrice = await Cart.update(
          {
            _id: cartExist[0]._id,
            items: {
              $elemMatch: { products: req.body.product }
            }
          },
          {
            $set: { "items.$.price": newPrice.toFixed(2) }
          }
        );
      } else {
        const updatedProduct = await Cart.update(
          { _id: cartExist[0]._id },
          { $push: { items: item } }
        );
      }
    }

    const getCart = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    }).populate("items.products");
    return res.send(getCart);
  });

  app.get("/api/fetchCart", async (req, res) => {
    const getCart = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    })
      .populate("items.products")
      .sort("-_id");
    return res.send(getCart);
  });
  app.post("/api/updateCart", async (req, res) => {
    if (req.body.actionType === "inc") {
      const updated = await Cart.update(
        {
          _id: req.body.cartId,
          items: {
            $elemMatch: { products: req.body.productId }
          }
        },
        {
          $inc: { "items.$.qty": 1 },
          $set: { "items.$.price": req.body.totalPricePerItem }
        }
      );
      return res.send({ success: true });
    }
    if (req.body.actionType === "dec") {
      const updated = await Cart.update(
        {
          _id: req.body.cartId,
          items: {
            $elemMatch: { products: req.body.productId }
          }
        },
        {
          $inc: { "items.$.qty": -1 },
          $set: { "items.$.price": req.body.totalPricePerItem }
        }
      );
      return res.send({ success: true });
    }
    if (req.body.actionType === "del") {
      const updated = await Cart.update(
        {
          _id: req.body.cartId,
          user: req.user._id,
          hasCheckedout: false
        },
        {
          $pull: {
            items: {
              _id: req.body.itemId
            }
          }
        },

        {
          safe: true,
          multi: true
        }
      );
      const getCart = await Cart.find({
        user: req.user._id,
        hasCheckedout: false
      }).populate("items.products");

      return res.send(getCart);
    }
  });
  app.post("/api/checkout", auth, async (req, res) => {
    stripe.customers
      .create({
        email: req.user.email
      })
      .then(function(customer) {
        return stripe.customers.createSource(customer.id, {
          source: req.body.token
        });
      })
      .then(function(source) {
        return stripe.charges.create({
          amount: req.body.priceTotal,
          currency: "usd",
          customer: source.customer
        });
      })
      .then(function(charge) {
        //update the cart
      })
      .catch(function(err) {
        // Deal with an error
        return res.send({ message: "error" });
      });

    const updated = await Cart.update(
      {
        user: req.user._id,
        hasCheckedout: false
      },
      {
        $set: { hasCheckedout: true, totalPrice: req.body.p }
      },

      {
        safe: true,
        multi: true
      }
    );
    const checkBillingInfo = await Billing.find({ user: req.user._id });
    if (checkBillingInfo.length === 0) {
      //no billing infor
      const billingFields = {
        name_bill: req.body.name_bill,
        mobile_number: req.body.mobile_number,
        address_checkout: req.body.address_checkout,
        state_city: req.body.state_city,
        address_type: req.body.address_type,
        user: req.user._id
      };
      const billing = await new Billing(billingFields).save();
    }

    return res.send({ message: "success" });
  });
  app.post("/api/contact", auth, async (req, res) => {
    const contactFields = {
      contactusername: req.body.contactusername,
      contactemail: req.body.contactemail,
      contactpnum: req.body.contactpnum,
      contactcomment: req.body.contactcomment
    };
    const contact = await new Contact(contactFields).save();
    return res.send({ message: "success" });
  });
};
