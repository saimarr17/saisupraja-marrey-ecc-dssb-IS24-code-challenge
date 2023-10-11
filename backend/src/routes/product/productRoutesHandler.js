import {Storage} from "../../database/index.js";
import {logger} from "../../utils/logger.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         -productName
 *         -scrumMaster
 *         -productOwnerName
 *         -developerNames
 *         -startDate
 *         -methodology
 *         -location
 *       properties:
 *         productId:
 *           type: string
 *           description: The auto-generated id of the product
 *         productName:
 *           type: string
 *           description: The name of the product
 *         scrumMasterName:
 *           type: string
 *           description: The name of the scrum master
 *         productOwnerName:
 *          type: string
 *          description: The name of the product owner
 *         Developers:
 *          type: string
 *          description: The names of developers (up to 5)
 *         startDate:
 *          type: string
 *          description: The start date of the product
 *         methodology:
 *          type: string
 *          description: Agile or Waterfall methodology
 *         location:
 *          type: string
 *          description: GitHub repository link which can be any project under github.com/bcgov organization
 *       example:
 *        {
 *         "productId": "dc667956-429d-42a6-a894-ec8e6367f897",
 *         "productName": "Handmade Wooden Hat",
 *         "productOwner": "Christian Bruen",
 *         "scrumMaster": "Ginger Nolan",
 *         "developerNames":
 *           [
 *            "Danny Rau",
 *            "Henry Johns",
 *            "Teresa Cronin",
 *            "Randy Dach"
 *           ],
 *         "startDate": "2024-01-17T06:15:45.561Z",
 *         "methodology": "Waterfall",
 *         "location": "github.com/bcgov/handmade_wooden_hat",
 *       }
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       default:
 *         description: Cors headers of the product
 *         headers:
 *           Access-Control-Allow-Origin:
 *              type: string
 *              default: http://localhost:3000
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal Server Error
 */
export const getAllProducts = (req, res) => {
    try {
        const products = Storage.db.products.getAllProducts();
        logger.info("Successfully fetched the list of products");
        res.status(200).json(getSuccessResponseBody(products));
    } catch (error) {
        logger.error("Error fetching the list of the products");
        sendErrorResponse(error, 500, res);
    }
}


/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Returns the product by productId
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by productId
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: No Product was found with given productId
 *       500:
 *         description: Internal Server Error
 */

export const getProduct = (req, res) => {
    try {
        const productId = req.params.productId;
        const product = Storage.db.products.getProduct(productId);
        if (!product) {
            logger.error("No Product was found with given product id");
            res.sendStatus(404);
        }
        logger.info("Successfully fetched the product by product id");
        res.status(200).json(getSuccessResponseBody(product));
    } catch (error) {
        logger.error("Error while fetching the product");
        sendErrorResponse(error, 500, res);
    }
}


/**
 * @swagger
 * /api/product/:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal Server Error
 */
export const createProduct = async (req, res) => {
    try {
        const { productName, scrumMaster, productOwner, developerNames, startDate, methodology } = req.body;

        if(!productName || !scrumMaster || !productOwner || !developerNames || !methodology || !startDate) {
            logger.error("Invalid product data was passed")
            res.status(404).json({ error: "Invalid product data was passed" });
        }

        const product = await Storage.db.products.create({
            productName,
            productOwner,
            scrumMaster,
            developerNames,
            startDate,
            methodology,
        });
        logger.info("Successfully created the product");
        res.status(200).json(getSuccessResponseBody(product));
    } catch (error) {
        logger.error("Error while adding a new product");
        sendErrorResponse(error, 500, res);
    }
}


/**
 * @swagger
 * /api/product/{productId}:
 *  put:
 *    summary: Updates the product by productId
 *    tags: [Products]
 *    parameters:
 *      - name: productId
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The product was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: No product was found with given productId
 *      500:
 *        description: Internal Server Error
 */
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { index } = Storage.db.products.getProductWithIndex(productId);
        if (index === -1) {
            logger.error("No Product was found with given product id")
            res.sendStatus(404);
        }

        const { productId: id, productName, scrumMaster, productOwner, developerNames, methodology, startDate, location } = req.body;
        if(!productId || !productName || !scrumMaster || !productOwner || !developerNames || !methodology || !startDate || !location) {
            logger.error("Invalid update data was passed")
            res.status(404).json({ error: "Invalid update data was passed" });
        }

        const updatedProduct = await Storage.db.products.updateProduct(productId, {
            productName, scrumMaster, productOwner, developerNames, startDate, methodology, location
        });
        console.log(updatedProduct)
        logger.info("Successfully updated the product")

        res.status(200).json(getSuccessResponseBody(updatedProduct));
    } catch (error) {
        logger.error("Error while updating the product");
        sendErrorResponse(error, 500, res);
    }
}


/**
 * @swagger
 * /api/product/{productId}:
 *  delete:
 *     summary: Deletes the product by productId
 *     tags: [Products]
 *     parameters:
 *       - name: productId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *       404:
 *         description: No Product was found with given productId
 *       500:
 *        description: Internal Server Error
 */

export const deleteProduct= async (req, res) => {
    try {
        const productId = req.params.productId;
        const {index} = Storage.db.products.getProductWithIndex(productId);
        if (index === -1) {
            logger.error("No Product was found with given product id")
            res.sendStatus(404);
        }
        await Storage.db.products.delete(productId);
        logger.info("Successfully deleted the product")
        res.sendStatus(200);
    } catch (error) {
        logger.error("Error while deleting the product");
        sendErrorResponse(error, 500, res);
    }
}

const getSuccessResponseBody = (data) => {
    return { payload: data }
}

const sendErrorResponse = (error, statusCode = 500, res) => {
    if (error instanceof Error) {
        res.status(statusCode).json({ error: error.message });
    }
}