import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    _id: Number,
    title:{
        type: String,
        required: true,
        index: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
        min:0,
    },
   /*  code:{
        type: String,
        required: true,
    }, */
    stock:{
        type: Number,
        required: true,
        min:0,
    },
    /* category:{
        type: String,
        required: true,
    }, */
    thumbnail:{
        type: String,
        required: true,
    },
    /* status:{
        type: Boolean,
        required: true,
    }, */
});

export const productModel = mongoose.model(productCollection, productSchema);


