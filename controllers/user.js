const User=require("../models/user.js");
module.exports.signup=async(req,res)=>{
    try{
         let {username,email,password}=req.body;
   const newuser= new User({email,username});
  let registeredUser=  await User.register(newuser,password);

   req.login(registeredUser,(err)=>{
    if(err)
    {
       return  next(err);
    }
          req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
   });
  
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
};
module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
           return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
   
};