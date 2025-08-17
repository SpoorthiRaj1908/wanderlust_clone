const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null)
    }).allow(null),
    category:Joi.string().valid(
  "rooms",
  "Iconic Cities",
  "mountain",
  "Castles",
  "Arctic",
  "camping",
  "farms",
  "snow",
  "fun"
).required()
  
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
}).prefs({ convert: true }); // ✅ This converts "3" (string) → 3 (number)
