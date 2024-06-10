import { Router } from "express";
// import { ProductManager } from "../manager/ProductManager.js";
import ChatManager from "../manager/ChatManager.js";
// import { CartManager } from "../manager/CartManager.js";
import passport from "passport";

import ViewController from "../controllers/views.controller.js";

const router = Router();
const viewController = new ViewController();

router.get("/", viewController.viewHome);
router.get("/products", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProductsPaginate);
router.get ("/product/:pid", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProductById);
router.get("/carts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewCart);
router.get("/realtimeproducts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewRealTimeProducts);
//CHAT//
router.get ("/messages", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewMessages);

router.get("/login", viewController.viewLogin);
router.get("/register", viewController.viewRegister);
router.get("/profile", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProfile);


export default router;