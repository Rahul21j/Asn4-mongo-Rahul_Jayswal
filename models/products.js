var mongoose = require('mongoose');
var Schema = mongoose.Schema;
PrdSchema = new Schema({
    asin : String,
    title : String,
    imgUrl : String,
    stars : Number,
    reviews : Number,
    price : Number,
    listPrice : Number,
    categoryName : String,
    isBestSeller : String,
    boughtInLastMonth : Number
});
module.exports = mongoose.model('Product', PrdSchema);