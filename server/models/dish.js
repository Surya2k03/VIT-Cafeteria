const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
    shop:{
        type:String,
    },
    content:[
        {
            dishName: {
                type:String,
                required:true,
                trim:true,
            },
            price:{
                type:String,
            },
            quantity:{
                type:Number,
            }
        }
    ]
});


// user otp model
const dish = new mongoose.model("Dish",dishSchema);

module.exports = dish