$(document).ready(function() {
    $(".have_account_2").on("click", function() {
      $(".modal_text").text("Sign Up");
      $(".sigup_div").css({ display: "block" });
      $(".login_div").css({ display: "none" });
      $("#error").fadeOut();
    });
    $(".have_account").on("click", function() {
      $(".modal_text").text("Sign In");
      $(".sigup_div").css({ display: "none" });
      $(".login_div").css({ display: "block" });
      $("#error").fadeOut();
      $("#error_sign").fadeOut();
    });
  
    //sign in
  
    $(".signin_btn").on("click", function(e) {
      e.preventDefault();
      var name = $(".name").val();
      var lname = $(".lname").val();
      var email_signup = $(".email_signup").val();
      var pass_signup = $(".pass_signup").val();
      var cpass_signup = $(".cpass_signup").val();
  
      e.preventDefault();
      if (name === "") {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Please enter your First Name");
        return $(".name").focus();
      } else {
        $("#error_sign").fadeOut();
      }
      
  
      if (email_signup === "") {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Please enter your Email");
        return $(".email_signup").focus();
      } else {
        $("#error_sign").fadeOut();
      }
      if (!validateEmail(email_signup)) {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Email is not valid");
        return $(".email_signup").focus();
      } else {
        $("#error_sign").fadeOut();
      }
  
      if (pass_signup === "") {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Please enter your password");
        return $(".pass_signup").focus();
      } else {
        $("#error_sign").fadeOut();
      }
      if (cpass_signup === "") {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Please Confirm Your password");
        return $(".cpass_signup").focus();
      } else {
        $("#error_sign").fadeOut();
      }
      if (pass_signup != cpass_signup) {
        $("#error_sign").fadeIn();
        $("#error_sign").text("Password does not match confirm password");
        return $(".cpass_signup").focus();
      } else {
        $("#error_sign").fadeOut();
      }
  
      //ajax call
      var data = {};
  
      data.name = $(".name").val();
      data.email_signup = $(".email_signup").val();
      data.pass_signup = $(".pass_signup").val();
  
      $.post("/api/signup", { data }).then(result => {
        if (result.suc) {
          return (window.location.href = "/");
        } else {
          $("#error_sign").fadeIn();
          return $("#error_sign").text(
            "User Already Exist why don't you try to login"
          );
        }
      });
    });
  
    $(".login_btn_").on("click", function(e) {
      var email = $(".email_login").val();
      var password = $(".pass_login").val();
  
      e.preventDefault();
      if (email === "") {
        $("#error").fadeIn();
        $("#error").text("Please enter your email");
        return $(".email_login").focus();
      } else {
        $("#error").fadeOut();
      }
      if (!validateEmail(email)) {
        $("#error").fadeIn();
        $("#error").text("Email is not valid");
        return $(".email_login").focus();
      } else {
        $("#error").fadeOut();
      }
  
      if (password === "") {
        $("#error").fadeIn();
        $("#error").text("Please enter Your password");
        return $(".pass_signup").focus();
      } else {
        $("#error").fadeOut();
      }
      //ajax call
  
      $.post("/api/login", {
        email: email,
        password: password
      }).then(result => {
        if (result.suc) {
          return (window.location.href = "/");
        } else {
          $("#error").fadeIn();
          return $("#error").text(
            "Invalid email or password"
          );
        }
      });
    });
  });
  
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  