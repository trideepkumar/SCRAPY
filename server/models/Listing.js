import mongoose from "mongoose";

const { Schema } = mongoose;

const listingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type:String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
    },
    type: {
        type: String,
        // required: true,
        // enum: ['apartment', 'house', 'condo'] 
    },
    offer: {
        type: Boolean,
        default: false 
    },
    images: [{ 
        type: String, 
        required: true
    }],
    userRef: {
        type: String, 
        required: true
    },
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
