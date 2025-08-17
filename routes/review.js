const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const {validatereview,isloggedin,isreviewauthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");
//review route
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.createreview));
//delete review route
router.delete("/:reviewid",isloggedin,isreviewauthor,wrapAsync(reviewcontroller.deletereview));
module.exports=router;