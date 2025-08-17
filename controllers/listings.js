const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find();
    res.render("listing/index.ejs",{allListings});
};
module.exports.new=(req,res)=>{
  
    res.render("listing/new.ejs");
};
module.exports.update=async(req,res)=>{
   
      let {id}=req.params;
      let response=   await geocodingClient.forwardGeocode({
 
  query: req.body.location,
  limit: 1
})
  .send()
  
    let listing=await Listing.findById(id);
      listing.set(req.body);
    listing.geometry=response.body.features[0].geometry;
    if(typeof req.file!== "undefined")
    {
           let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    }
    await listing.save();

   req.flash("success","listing updated");
   res.redirect(`/listings/${id}`);
};
module.exports.create=async(req,res,next)=>{
let response=   await geocodingClient.forwardGeocode({
 
  query: req.body.location,
  limit: 1
})
  .send()

    let url=req.file.path;
    let filename=req.file.filename;
         let {title,description,price,country,category,location}=req.body;
         
    let newlisting=new Listing({
        title:title,
        description:description,
         image: {
               url: url,
            filename: filename, 
        },
        price:price,
        country:country,
        category:category,
        location:location
    });
    
    newlisting.owner=res.locals.curruser;
newlisting.geometry=response.body.features[0].geometry
   const savedlisting= await newlisting.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");

   
};
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing)
{
    req.flash("error","listing you requested for does not exist!");
   return res.redirect("/listings");

}   let originalimageurl=listing.image.url;
     originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250")
    res.render("listing/edit.ejs",{listing,originalimageurl});
};
module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};
module.exports.show=async(req,res)=>{
let {id}=req.params;
let listing = await Listing.findById(id)
    .populate("owner")  
    .populate({
        path: "reviews",     
        populate: { path: "author" } 
    });

if(!listing)
{
    req.flash("error","listing you requested for does not exist!");
   return res.redirect("/listings");

}
res.render("listing/show.ejs",{listing});
};
module.exports.category=async (req, res) => {
  const { categoryName } = req.params;
  const listings = await Listing.find({
  category: { $regex: new RegExp(`^${categoryName}$`, "i") }
});
  res.render("listing/category.ejs", { listings, categoryName });
}