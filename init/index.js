const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Connection error", err));
  const initDB=async()=>
{
    await Listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"689b63911b1fa3db81bf6994"}));
    await Listing.insertMany(initdata.data);
    console.log("data was saved initialized");
}
initDB();
