import mongoose from "mongoose";
const schema = mongoose.Schema;

const cartSchema = new schema(
    {
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
                quantity: { type: Number, default: 1, min: 1 }
            }
        ]
    });
export const cartModel = mongoose.model('carts', cartSchema);
