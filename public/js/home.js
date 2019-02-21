function close_cart() {
  $(".cart_data").fadeOut();
}

$(document).on("click", "#cat1", function(e) {
  var d = $(this).attr("value");
  window.location.href = "/products/" + d;
});

$(document).on("click", "#discount", function(e) {
  var d = $(this).attr("value");
  window.location.href = "/products/discount/" + d;
});

$(document).on("change", "#cat_id", function(e) {
  var d = $(this).val();
  window.location.href = "/product/single/" + d;
});

function launch_toast() {
  var x = document.getElementById("toast");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 5000);
}

//contact
$(document).on("click", "#submitConactMessage", function(e) {
  e.preventDefault();
  var contactusername = $("#contactusername").val();
  var contactemail = $("#contactemail").val();
  var contactpnum = $("#contactpnum").val();
  var contactcomment = $("#contactcomment").val();
  if (contactusername === "") {
    $(".error").css({ display: "block" });
    $(".error").text("Name Required");
    $("#contactusername").css({ border: "1px solid red" });
    return $("#contactusername").focus();
  } else {
    $(".error").css({ display: "none" });
    $("#contactusername").css({ border: "1px solid #eeeeee" });
  }
  if (contactemail === "") {
    $(".error").css({ display: "block" });
    $(".error").text("Email Required");
    $("#contactemail").css({ border: "1px solid red" });
    return $("#contactemail").focus();
  } else {
    $(".error").css({ display: "none" });
    $("#contactemail").css({ border: "1px solid #eeeeee" });
  }
  if (!validateEmail(contactemail)) {
    $(".error").css({ display: "block" });
    $(".error").text("Email Not Valid");
    $("#contactemail").css({ border: "1px solid red" });
    return $("#contactemail").focus();
  } else {
    $(".error").css({ display: "none" });
    $("#contactemail").css({ border: "1px solid #eeeeee" });
  }
  if (contactpnum === "") {
    $(".error").css({ display: "block" });
    $(".error").text("Phone Number Required");
    $("#contactpnum").css({ border: "1px solid red" });
    return $("#contactpnum").focus();
  } else {
    $(".error").css({ display: "none" });
    $("#contactpnum").css({ border: "1px solid #eeeeee" });
  }
  if (contactcomment === "") {
    $(".error").css({ display: "block" });
    $(".error").text("Message Required");
    $("#contactcomment").css({ border: "1px solid red" });
    return $("#contactcomment").focus();
  } else {
    $(".error").css({ display: "none" });
    $("#contactcomment").css({ border: "1px solid #eeeeee" });
  }
  $.post("/api/contact", {
    contactusername,
    contactemail,
    contactpnum,
    contactcomment
  }).then(result => {
    $("#contactusername").val("");
    $("#contactemail").val("");
    $("#contactpnum").val("");
    $("#contactcomment").val("");
    $(".alert_m").css({ display: "block" });
  });
});
