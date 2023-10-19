import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
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
    code:{
        type: String,
        required: false,
    }, 
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

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);


