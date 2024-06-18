import { Router } from "express";
import passport from "passport";

import ViewController from "../controllers/views.controller.js";
import { checkRole } from "../utils/utils.js";


const router = Router();
const viewController = new ViewController();

router.get("/", viewController.viewHome);
router.get("/products", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProductsPaginate);
router.get ("/product/:pid", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProductById);
router.get("/carts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER']), viewController.viewCart);
router.get("/realtimeproducts", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['ADMIN']), viewController.viewRealTimeProducts);
router.get("/carts/:tid/checkout", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER']), viewController.viewCheckOut);
router.get("/buys/:tid", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER']), viewController.viewBuys);

//CHAT//
router.get ("/messages", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), checkRole(['USER']), viewController.viewMessages);

router.get("/login", viewController.viewLogin);
router.get("/register", viewController.viewRegister);
router.get("/profile", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewProfile);
router.get("/restricted", passport.authenticate("jwt", {session: false, failureRedirect: "/login"}), viewController.viewRestricted);


export default router;