$(document).ready(function() {
  $(document).on("click", ".addToCart", function() {
    //start progress bar  and clear data
    //  $(".cart_data").fadeIn();
    $(".close_cartbtn").css({ display: "none" });
    $(".checkout_btn").css({ display: "none" });

    //display loading bar
    $(".noitems").css({ display: "none" });
    $(".loading_bar").css({ display: "block" });
    $(".cart_content").html("");

    var product = $(this).attr("id");
    var price = $("#product_price" + product).text();
    $.post("/api/addToCart", {
      product,
      price
    }).then(result => {
      if (result.error) {
        //user has not been autnticated open login modal and display error message
        $("#myModal_btn").modal();
        $("#error_sign").text("Signup or login to Continue");
        $("#error_sign").css({ display: "block" });
      } else {
        launch_toast();
        $(".close_cartbtn").css({ display: "block" });
        $(".checkout_btn").css({ display: "block" });
        $(".loading_bar").css({ display: "none" });

        if (result[0].items.length === 0) {
          //no data in cart
          $(".noitems").css({ display: "block" });
        } else {
          //cart has data
          $(".noitems").css({ display: "none" });
          $(".cartNumber").attr("data-badge", result[0].items.length);
          $(".cart_content").html("");
          result[0].items.forEach(function(cart) {
            //  console.log(cart.products.product_name);
            cartHTML(cart, result);
          });
          displayTotalPrice();
          displayTotalPrice_2();
        }
      }
    });
  });
  open_cart();
  $(".cart_data").css({ display: "none" });
  $(".cart_data").draggable();

  //checkout
  $(document).on("click", ".check_out", function(e) {
    e.preventDefault();
    var name_bill = $("#name_bill").val();
    var mobile_number = $("#mobile_number").val();
    var address_checkout = $("#address_checkout").val();
    var state_city = $("#state_city").val();
    var address_type = $("#address_type").val();
    if (name_bill === "") {
      $(".error").text("Full Name Required");
      $("#name_bill").css({ border: "1px solid red" });
      return $("#name_bill").focus();
    } else {
      $("#name_bill").css({ border: "1px solid #eeeeee" });
    }

    if (mobile_number === "") {
      $(".error").text("Mobile Number Required");
      $("#mobile_number").css({ border: "1px solid red" });
      return $("#mobile_number").focus();
    } else {
      $("#mobile_number").css({ border: "1px solid #eeeeee" });
    }
    if (address_checkout === "") {
      $(".error").text("Address Required");
      $("#address_checkout").css({ border: "1px solid red" });
      return $("#address_checkout").focus();
    } else {
      $("#address_checkout").css({ border: "1px solid #eeeeee" });
    }
    if (state_city === "") {
      $(".error").text("State/City Required");
      $("#state_city").css({ border: "1px solid red" });
      return $("#state_city").focus();
    } else {
      $("#state_city").css({ border: "1px solid #eeeeee" });
    }

    //checkout
    var handler = StripeCheckout.configure({
      key: "pk_test_HR6sgMddOlVwJ7AwqvR8Wu0e",
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      locale: "auto",
      token: function(token) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        var p = displayTotalPrice_3();
        var priceTotal =
          parseFloat(
            $(".cartTotal2")
              .text()
              .replace(/,/g, "")
          ) * 100;
        var email = $(".user").val();
        var token = token.id;
        $.post("/api/checkout", {
          token,
          email,
          name_bill,
          mobile_number,
          address_checkout,
          state_city,
          address_type,
          p
        }).then(result => {
          if (result.message === "success") {
            $("#checkout_section").remove();
            $(".checkout_succes").css({ display: "block" });
          } else {
            console.log("error");
          }
        });
      }
    });

    document.getElementById("customButton");
    // Open Checkout with further options:

    var priceTotal =
      parseFloat(
        $(".cartTotal2")
          .text()
          .replace(/,/g, "")
      ) * 100;
    var email = $(".user").val();

    handler.open({
      name: "tajirisani.com",
      description: "Jewelry Purchase",
      zipCode: true,
      amount: priceTotal,
      email: email
    });
    e.preventDefault();

    // Close Checkout on page navigation:
    window.addEventListener("popstate", function() {
      handler.close();
    });
  });
});
var t;

function open_cart() {
  $(".cart_data").fadeIn();
  $(".close_cartbtn").css({ display: "none" });
  $(".checkout_btn").css({ display: "none" });
  //start progress bar  and clear data
  $(".cart_content").html("");

  //display loading bar
  $(".noitems").css({ display: "none" });
  $(".loading_bar").css({ display: "block" });
  $.get("/api/fetchCart").then(result => {
    $(".close_cartbtn").css({ display: "block" });
    $(".checkout_btn").css({ display: "block" });
    $(".loading_bar").css({ display: "none" });
    var length = result.length ? result[0].items.length : 0;
    if (length === 0) {
      //no data in cart
      $(".close_cartbtn").css({ display: "block" });
      $(".checkout_btn").css({ display: "none" });
      $(".loading_bar").css({ display: "none" });
      $(".noitems").css({ display: "block" });
    } else {
      //cart has data
      $(".noitems").css({ display: "none" });
      //  console.log(result[0].items);
      $(".cart_content").html("");

      result[0].items.forEach(function(cart) {
        cartHTML(cart, result);
      });
      displayTotalPrice_2();
      displayTotalPrice();
    }
  });
}

function cartHTML(cart, result) {
  var cartHtml = "";

  cartHtml += `<div class="col-md-12" style="margin-bottom: 10px;border-bottom: 1px solid #eeeeee;padding: 10px;" id="itemDiv${
    cart.products._id
  }">`;
  cartHtml += '   <div class="row">';

  cartHtml += '   <div class="col-md-6">';
  cartHtml += `${cart.products.product_name}`;
  cartHtml += "  </div>";
  cartHtml += '  <div class="col-md-3">';
  cartHtml += ` <button class="increment_qty" onclick="Cart_operation('${
    result[0]._id
  }', '${cart.products._id}', '${cart._id}','inc')">+</button>`;
  cartHtml += ` <input style="width:20px;text-align:center;background-color:#e0e0e0;border:none" disabled value="${
    cart.qty
  }"  min="0" id="cartQty${cart.products._id}"/>`;
  cartHtml += `  <button class="decrement_qty" onclick="Cart_operation('${
    result[0]._id
  }', '${cart.products._id}', '${cart._id}','dec')">-</button>`;
  cartHtml += " </div>";
  cartHtml += ' <div class="col-md-3">';
  cartHtml += `   $<span id="cartPrice${
    cart.products._id
  }" class="cartPrices">${
    cart.price
  }</span><span style="display:none;" id="originalPrice${cart.products._id}">${
    cart.products.price
  }</span>`;
  cartHtml += ` <span  class="delete_cartitem" onclick="Cart_operation('${
    result[0]._id
  }', '${cart.products._id}','${cart._id}', 'del')">x</span>`;
  cartHtml += " </div>";

  cartHtml += " </div>";
  cartHtml += "</div>";

  $(".cart_content").append(cartHtml);
}

function Cart_operation(cartId, productId, itemId, actionType) {
  //alert(cartId, productId, itemId, actionType);
  var cartQty = parseInt($("#cartQty" + productId).val());
  var cartPrice = parseFloat($("#originalPrice" + productId).text());
  if (actionType === "inc") {
    var inc = cartQty + 1;
    var totalPricePerItem = (cartPrice * inc).toFixed(2);
    $("#cartQty" + productId).val(inc);
    $("#checkoutQty" + productId).text(inc);
    $("#cartPrice" + productId).text(totalPricePerItem);
    $("#cartPrice1" + productId).text(totalPricePerItem);
    $("#otherprice" + productId).text(totalPricePerItem);
    displayTotalPrice();
    displayTotalPrice_2();
    updateCart(actionType, totalPricePerItem, cartId, productId);
  }
  if (actionType === "dec") {
    var cartQty = parseInt($("#cartQty" + productId).val());

    var dec = cartQty - 1;
    if (dec >= 1) {
      var totalPricePerItem = (cartPrice * dec).toFixed(2);
      $("#cartQty" + productId).val(dec);
      $("#checkoutQty" + productId).text(dec);
      $("#cartPrice" + productId).text(totalPricePerItem);
      $("#cartPrice1" + productId).text(totalPricePerItem);
      $("#otherprice" + productId).text(totalPricePerItem);
      displayTotalPrice();
      displayTotalPrice_2();
      updateCart(actionType, totalPricePerItem, cartId, productId);
    }
    //console.log(cartId, productId, actionType);
  }
  if (actionType === "del") {
    $("#itemDiv" + productId).remove();
    $("#checkoutTable" + productId).remove();
    $("#r" + productId).remove();
    var cartNumber = parseInt($(".cartNumber").attr("data-badge")) - 1;
    $(".cartNumber").attr("data-badge", cartNumber);
    displayTotalPrice();
    displayTotalPrice_2();
    updateCart(actionType, totalPricePerItem, cartId, productId, itemId);
  }
}

function updateCart(actionType, totalPricePerItem, cartId, productId, itemId) {
  if (actionType === "inc") {
    $.post("/api/updateCart", {
      actionType,
      totalPricePerItem,
      cartId,
      productId
    }).then(result => {});
  }
  if (actionType === "dec") {
    $.post("/api/updateCart", {
      actionType,
      totalPricePerItem,
      cartId,
      productId
    }).then(result => {});
  }
  if (actionType === "del") {
    $.post("/api/updateCart", {
      actionType,
      cartId,
      productId,
      itemId
    }).then(result => {
      if (result[0].items.length === 0) {
        //no data in cart
        $(".close_cartbtn").css({ display: "block" });
        $(".checkout_btn").css({ display: "none" });
        $(".loading_bar").css({ display: "none" });
        $(".noitems").css({ display: "block" });
        window.location.href = "/";
      }
    });
  }
}
function displayTotalPrice() {
  var totalPrice = 0;
  var g = document.getElementsByClassName("cartPrices");
  for (var i = 0; i < g.length; i++) {
    totalPrice += parseFloat(g[i].innerHTML);
  }

  $(".cartTotal").text("Total: $" + numberWithCommas(totalPrice.toFixed(2)));
  $(".pay").text(
    `Pay with card ($${numberWithCommas(totalPrice.toFixed(2))}) `
  );
}

function displayTotalPrice_2() {
  var totalPrice = 0;
  var g = document.getElementsByClassName("cartPrice1");
  for (var i = 0; i < g.length; i++) {
    totalPrice += parseFloat(g[i].innerHTML);
  }

  $(".cartTotal2").text(numberWithCommas(totalPrice.toFixed(2)));
  $(".pay").text(
    `Pay with card ($${numberWithCommas(totalPrice.toFixed(2))}) `
  );
}

function displayTotalPrice_3() {
  var totalPrice = 0;
  var g = document.getElementsByClassName("cartPrices");
  for (var i = 0; i < g.length; i++) {
    totalPrice += parseFloat(g[i].innerHTML);
  }

  return numberWithCommas(totalPrice.toFixed(2));
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
displayTotalPrice_2();

//
// $(document).on("click", ".open_close", function() {
//   open_cart();
//   $(".cart_data").css({ display: "none" });
// });
