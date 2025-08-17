const Listing = require("./models/listing.js");
const Review= require("./models/listing.js");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isloggedin= (req,res,next)=>{
     if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login");
    }
    next();
};
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
     res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
};
module.exports.isowner=async(req,res,next)=>{
      let {id}=req.params;
    let listing=await Listing.findById(id).populate("owner");
 
    if( !listing.owner || listing.owner.username  !==req.user.username)
    {
        req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);

    }
    next();
};
module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((ele)=>ele.message).join(",");
        throw new expressError(400,errmsg);
    }
    else{
        next();
    }
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { convert: true }); // ✅ ensures "3" → 3
    if (error) {
        let errmsg = error.details.map(ele => ele.message).join(",");
        throw new expressError(400, errmsg);
    } else {
        next();
    }
};
module.exports.isreviewauthor=async(req,res,next)=>{
      let {reviewid,id}=req.params;
    let listing=await Review.findById(reviewid).populate("author");
 
    if( !review.author || review.author.username  !==req.user.username)
    {
        req.flash("error","you did not create this review");
    return res.redirect(`/listings/${id}`);

    }
    next();
};