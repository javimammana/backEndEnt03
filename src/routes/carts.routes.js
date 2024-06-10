import { Router } from "express";
import CartController from "../controllers/carts.controller.js";

const router = Router();
const cartController = new CartController();

router.get("/:cid", cartController.getcartById);
router.post("/:cid/product/:pid", cartController.addProductCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/product/:pid", cartController.updateProductCart);
router.delete("/:cid", cartController.clearCart);
router.delete("/:cid/product/:pid", cartController.deleteProductCart);

export default router;
