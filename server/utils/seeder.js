const Product=require('../models/product');
require('dotenv').config()
require('../config/database')
const products = require('../data/product')

const seedProducts=async () => {
    try{
            await Product.deleteMany();
            console.log('Product deleted successfully')
            await Product.insertMany(products);
            console.log('Product inserted successfully')
            process.exit();
    }
    catch(e){
        console.log(e);
        process.exit();
    }
}
seedProducts();