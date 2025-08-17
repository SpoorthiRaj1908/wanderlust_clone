let Listing=require("../models/listing.js");
let Review=require("../models/review.js");
module.exports.createreview=async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newreview=new Review(req.body.review);
   newreview.author=req.user._id;
   listing.reviews.push(newreview);
   await newreview.save();
   await listing.save();
   req.flash("success","new review created");
   res.redirect(`/listings/${listing._id}`);
};
module.exports.deletereview=async(req,res,next)=>{
    let {id,reviewid}=req.params;
        await Listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewid } });

    await Review.findByIdAndDelete(reviewid);
   req.flash("success"," review deleted");

    res.redirect(`/listings/${id}`);

};