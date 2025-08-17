const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isloggedin,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer = require('multer');
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});
//index route
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(validatelisting,isloggedin,upload.single('image'),wrapAsync(listingcontroller.create));
//new route
router.get("/new",isloggedin,listingcontroller.new);
//update
router.route("/:id")
.put(isloggedin,isowner,upload.single('image'),validatelisting,wrapAsync(listingcontroller.update))
.delete(isloggedin,isowner,wrapAsync(listingcontroller.delete))
.get(wrapAsync(listingcontroller.show));
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.edit));
router.get("/category/:categoryName",listingcontroller.category );
module.exports=router;