import express from "express";
import * as productRoutesHandler from "./productRoutesHandler.js";

const router = express.Router();

router.get("/", productRoutesHandler.getAllProducts);
router.get("/:productId", productRoutesHandler.getProduct);
router.post("/", productRoutesHandler.createProduct);
router.put("/:productId", productRoutesHandler.updateProduct);
router.delete("/:productId", productRoutesHandler.deleteProduct);

export default router;