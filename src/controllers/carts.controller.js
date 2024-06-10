import { cartServices } from "../services/services.js";
import { productServices } from "../services/services.js";

class CartController {

    async createCart (req,res) {
        try {
            const cart = await cartServices.createCart();
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getcartById (req, res) {
        try {
            const cart = await cartServices.getCartById(req.params.cid);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async addProductCart (req, res) {
        const { cid, pid } = req.params;
        const cart = await cartServices.getCartById(cid);
        if (!cart) {
            res.json("El carrito no existe");
        }
        const product = await productServices.getProductById(pid);
        if (!product) {
            res.json("El producto no existe");
        }

        try {
            const exist = cart.products.find(item => item.product._id.toString() === pid);
            if (exist) {
                if (exist.quantity < product.stock) {
                    exist.quantity++
                } else {
                    res.json("Legaste al stock maximo");
                }
            } else {
                cart.products.push({product: pid, quantity: 1})
            }
            await cartServices.updateCart(cart._id, cart);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async updateCart (req,res) {
        const { cid } = req.params;
        const update = req.body;
        try {
            let cart = await cartServices.getCartById(cid);
            if (!cart) {
                res.json("El carrito no existe");
            }
            const products = [];
            for (const prod of update) {
                let product = await productServices.getProductById(prod.product);
                if (!product) {
                    res.json("El producto no existe");
                }

                if (prod.quantity <= product.stock) {
                    products.push(prod);
                } else {
                    prod = {
                        product: prod.product,
                        quantity: product.stock
                    }
                    products.push(prod);
                    res.json(`el producto ${prod._id}, el stock maximo es de ${product.stock}`)
                }
            }
            cart = await cartServices.updateCart(cid, products);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async updateProductCart (req, res) {
        const { cid, pid } = req.params;
        const update = req.body;
        try {
            let cart = await cartServices.getCartById(cid);
            if (!cart) {
                res.json("El carrito no existe");
            }
            const product = await productServices.getProductById(pid);
            if (!product) {
                res.json("El producto no existe");
            }
            const exist = cart.products.find(item => item.product._id.toString() === pid);
            if (!exist) {
                res.json("El producto no existe en el carrito");
            }
            if (update.quantity <= product.stock) {
                exist.quantity = update.quantity;
                await cartServices.updateCart(cid, cart);
                res.json(cart);
            } else {
                res.json(`El estock maximo para el producto ${pid}, es de ${product.stock}`);
            }
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteProductCart (req, res) {
        const { cid, pid } = req.params;
        try {
            let cart = await cartServices.getCartById(cid);
            if (!cart) {
                res.json("El carrito no existe");
            }
            const product = await productServices.getProductById(pid);
            if (!product) {
                res.json("El producto no existe");
            }
            const exist = cart.products.find(item => item.product._id.toString() === pid);
            if (!exist) {
                res.json("El productono existe en el carrito");
            }
            cart.products.splice(cart.products.indexOf(exist),1);
            await cartServices.updateCart(cid, cart);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async substractCartProduct (req, res) {
        const { cid, pid } = req.params;
        const cart = await cartServices.getCartById(cid);
        if (!cart) {
            res.json("El carrito no existe");
        }
        const product = await productServices.getProductById(pid);
        if (!product) {
            res.json("El producto no existe");
        }
        try {
            const exist = cart.products.find(item => item.product._id.toString() === pid);
            if (!exist) {
                res.json("El productono existe en el carrito");
            }
            if (exist.quantity = 1) {
                res.json("Tenes solo 1 item de este priducto, te recomiendo que lo elimines del carrito");
            }
            exist.quantity = exist.quantity--;
            await cartServices.updateCart(cid, cart);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async clearCart (req, res){
        try {
            let cart = await cartServices.clearCart(req.params.cid);
            res.json(cart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

export default CartController;