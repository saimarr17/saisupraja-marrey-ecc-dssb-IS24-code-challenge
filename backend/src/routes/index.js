import express from "express";
import productRouter from "./product/index.js";
import {logger} from "../utils/logger.js";

const router = express.Router();

router.get("/healthcheck", (req, res) => {
    logger.info("Health Check component was called")
    res.status(200).send("OK");
})

router.use("/product", productRouter);

export default router;