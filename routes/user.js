const express=require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveredirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js");
router.route("/signup")
.get((req,res)=>{
    res.render("users/signup.ejs");
})
.post(wrapAsync(usercontroller.signup));
router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(saveredirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),usercontroller.login);
router.get("/logout",usercontroller.logout);

module.exports=router;
