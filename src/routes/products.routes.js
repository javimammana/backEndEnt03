import { Router } from "express";
import ProductController from "../controllers/products.controler.js";
import { validate } from "../utils/utils.js";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getProductsPaginate);
router.get("/:pid", productController.getProductById)
router.post("/",validate, productController.createProduct);
router.put("/:pid",validate, productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router;
