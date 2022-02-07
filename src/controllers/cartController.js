const { Cart, Product } = require('../models');
const { sendErrorResponse, checkValidObjectId } = require('../helpers');

const getTotalAmout = async (userId) => {
    try {
        const cartTotal = await Cart.aggregate([
            {
                $match: {
                    user: userId,
                },
            },
            {
                $unwind: '$cartItems',
            },
            {
                $project: {
                    productId: '$cartItems.productId',
                    quantity: '$cartItems.quantity',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $project: {
                    quantity: 1,
                    productId: 1,
                    product: { $arrayElemAt: ['$product', 0] },
                },
            },
            {
                $group: {
                    _id: '$productId',
                    total: {
                        $sum: { $multiply: ['$quantity', '$product.price'] },
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$total' },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                },
            },
        ]);
        return cartTotal[0].totalAmount;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    /*
    re.body = {
        productId: "12djnnd76asjnj7sabj",
        "quantity": "1"
    }
    */
    addItemToCart: async (req, res) => {
        try {
            const { productId } = req.body;

            if (!productId) {
                return sendErrorResponse(res, 400, 'productId not provided');
            }

            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const product = await Product.findById(productId);
            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            const cart = await Cart.findOne({ user: req.user._id });
            if (cart) {
                let productExist = cart.cartItems.findIndex((item) => {
                    return item.productId.toString() === productId.toString();
                });

                if (productExist !== -1) {
                    const quantity = parseInt(req.body.quantity) || 1;

                    await Cart.findOneAndUpdate(
                        {
                            'cartItems.productId': productId,
                            user: req.user._id,
                        },
                        { $inc: { 'cartItems.$.quantity': quantity } },
                        { new: true }
                    );
                } else {
                    await Cart.findOneAndUpdate(
                        { user: req.user._id },
                        { $push: { cartItems: req.body } }
                    );
                }
            } else {
                const newCart = new Cart({
                    user: req.user._id,
                    cartItems: req.body,
                });
                await newCart.save();
            }

            res.status(200).json({
                message: 'cart updated successfully',
            });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getCartItems: async (req, res) => {
        try {
            const cart = await Cart.aggregate([
                {
                    $match: {
                        user: req.user._id,
                    },
                },
                {
                    $unwind: '$cartItems',
                },
                {
                    $project: {
                        productId: '$cartItems.productId',
                        quantity: '$cartItems.quantity',
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'product',
                    },
                },
                {
                    $project: {
                        quantity: 1,
                        productId: 1,
                        product: { $arrayElemAt: ['$product', 0] },
                    },
                },
                {
                    $project: {
                        quantity: 1,
                        productId: 1,
                        'product._id': 1,
                        'product.name': 1,
                        'product.thumbnail': 1,
                        'product.price': 1,
                    },
                },
            ]);

            let cartTotal = 0;

            if (cart.length > 0) {
                cartTotal = await getTotalAmout(req.user._id);
            }

            res.status(200).json({ cartItems: cart, cartTotal });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    incrementProductQuantity: async (req, res) => {
        try {
            const { productId } = req.params;
            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const cart = await Cart.findOneAndUpdate(
                {
                    'cartItems.productId': productId,
                    user: req.user._id,
                },
                { $inc: { 'cartItems.$.quantity': 1 } }
            );

            if (!cart) {
                return sendErrorResponse(res, 400, 'cart not found');
            }

            res.status(200).json({ message: 'product quantity incremented' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    decrementProductQuantity: async (req, res) => {
        try {
            const { productId } = req.params;
            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const cart = await Cart.findOneAndUpdate(
                {
                    'cartItems.productId': productId,
                    user: req.user._id,
                },
                { $inc: { 'cartItems.$.quantity': -1 } }
            );

            if (!cart) {
                return sendErrorResponse(res, 400, 'cart not found');
            }

            res.status(200).json({ message: 'product quantity decremented' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            const { productId } = req.params;
            if (!checkValidObjectId(productId)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { cartItems: { productId: productId } } }
            );

            if (!cart) {
                return sendErrorResponse(res, 400, 'cart not found');
            }

            res.status(200).json({ message: 'cart item deleted' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    clearCart: async (req, res) => {
        try {
            await Cart.findOneAndRemove({ user: req.user._id });

            res.status(200).json({ message: 'cart cleared' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
