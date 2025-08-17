if(process.env.NODE_ENV!="production")
{
require('dotenv').config();
}
const express=require("express");
let app=express();
const User=require("./models/user.js");
const mongoose=require("mongoose");
const methodOverride = require("method-override");
const multer=require("multer");
const upload = multer({ dest: 'uploads/' })
app.use(methodOverride('_method'));
mongoose.connect(process.env.ATLASDB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Connection error", err));
let port= process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path=require("path");
const ejsMate= require("ejs-mate");
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrat=require("passport-local");
const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
store.on("error", (error) => {
    console.log("Error in Mongo session store", error);
});
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

//app.get("/",(req,res)=>{
  //  res.send("hi i am root");
//});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})
app.get("/", (req, res) => {
    res.redirect("/listings"); // or render a home page if you have one
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use((err,req,res,next)=>{
    let {status=500,message="smtg went wrong"}=err;
    res.status(status).render("error.ejs",{message});
});
app.listen(port,(req,res)=>{
    console.log("app is listening");
});
