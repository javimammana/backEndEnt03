export function validate (req, res, next) {
    const {title, description, price, code, stock, category} = req.body;
    
    if (!title) {
        return res.json ({
            error: "El Nombre del producto es necesario"
        })
    }

    if (!description) {
        return res.json ({
            error: "La Descripcion del producto es necesaria"
        })
    }

    if (!price) {
        return res.json ({
            error: "El precio del producto es necesario"
        })
    }

    if (!code) {
        return res.json ({
            error: "El codigo del producto es necesario"
        })
    }
    if (!stock) {
        return res.json ({
            error: "El stock de productos es necesario"
        })
    }

    if (!category) {
        return res.json ({
            error: "La categoria de producto es necesaria"
        })
    }

    next();
}

import configObject from "../config/configEnv.js";
import jwt from "jsonwebtoken";

const admin = {
    email: configObject.user,
    password: configObject.pass
};
export function adminLoginJWT (req, res, next) {
    const {email, password} = req.body;
    if (email === admin.email) {
        if (password === admin.password) {

            const token = jwt.sign({
                first_name: "Coder",
                last_name: "House",
                // age: usuario.age,
                email: admin.email,
                role: "ADMIN",
                // cart: usuario.cart,
                // favorite: usuario.favorite,
                chatid: "ADMIN"
            }, "coderhouse", {expiresIn: "5m"});
    
            res.cookie("coderCookieToken", token, {
                maxAge: 90000,
                httpOnly: true
            });

                res.redirect("/realtimeproducts");
                return
        
        } else { 
            res.status(401).send("usuario o contraseña incorrecto") 
            return
        }
    }
    next();
}

// export function capitalize(text) {
//     const firstLetter = text.charAt(0);
//     const rest = text.slice(1);
//     return firstLetter.toUpperCase() + rest;
// }

// export default validate;