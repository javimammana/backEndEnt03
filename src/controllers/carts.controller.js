import { cartServices, ticketServices } from "../services/services.js";
import { productServices } from "../services/services.js";
import { userServices } from "../services/services.js";
import nodemailer from "nodemailer";

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
            res.redirect("/products");
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
                res.json(`El stock maximo para el producto ${pid}, es de ${product.stock}`);
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
            console.log(error)
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

    async checkOut (req, res) {
        try {

            const { cid } = req.params;
            const user = req.user;
            let cart = await cartServices.getCartById(cid);

            //si el carrito esta vacio redirecciono al carrito
            if (!cart.products) {
                res.redirect(`/carts/${cart._id}`)
                return
            }

            const sinStock = [];
            const enStock = [];

            //reviso que se pueda cubrir los stock que pide el cliente
            for (let prod of cart.products) {
                prod.quantity <= prod.product.stock ? enStock.push({...prod, price: prod.product.price}) : sinStock.push(prod);
            }

            //si ningun producto cubre el stock pedido del cliente, se corta el codigo
            if (!enStock) {
                res.send("no hay stock de ningun profucto")
                return
            }

            //resto los productos del stock de productos para evitar problemas con otra compra
            for (let prod of enStock) {
                await productServices.updateProduct(prod.product._id, {...prod.product, stock: prod.product.stock - prod.quantity});
            }

            console.log(user)
            //preparo ticket
            const ticket = {
                purchaser: user.email,
                products: enStock,
                amount: enStock.reduce((acumulador, elemento) => acumulador + Number(elemento.price * elemento.quantity),0).toFixed(2),
                code: `ECMRS-`
            }

            //proceso compra y guardo en db.
            const buy = await ticketServices.createTicket(ticket);

            //sin hay error en la compra, devuelvo el stock de productos y corto codigo
            if (!buy) {
                for (let prod of enStock) {
                    await productServices.updateProduct(prod.product._id, {...prod.product, stock: prod.product.stock + prod.quantity});
                }

                res.send("Error al computar compra")
                return;
            }

            console.log(buy);
            //asiga ticket a usuario
            let usuario = await userServices.getUserByEmail({email: buy.purchaser});
            console.log(usuario)
            usuario.purchases.unshift({ purchasesId: buy._id, code: buy.code});
            await userServices.updateUserByEmail({email:buy.purchaser}, usuario);
            console.log(usuario)
            const algo = await userServices.getUserByEmail({email: buy.purchaser})
            console.log(algo)

            //Envio notificacion
            await transport.sendMail({
                from:"Javi M <javiermammana.deb@gmail.com>",
                to: buy.purchaser,
                subject: `Detalle de compra, pedido ${buy.code}.-`,
                html: `<h1>Confirmamos tu compra ${buy.code}, Saludos!!`
            })

            //actualizo el carrito del usuario
            const cartSinStock = {
                ...cart,
                products: sinStock
            }

            await cartServices.updateCart(cid, cartSinStock);


            res.redirect(`/carts/${buy._id}/checkout`)
                        
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "javiermammana.dev@gmail.com",
        pass: "xnln qlld uvbj ktdc"
    }
})

export default CartController;