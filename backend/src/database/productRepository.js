import crypto from "crypto";

export class ProductRepository {
    #db;

    constructor(db) {
        this.#db = db;
    }

    getAllProducts() {
        return this.#db.data.products ?? [];
    }

    getProductWithIndex(productId) {
        const products = this.getAllProducts();
        const findIndex =  products.findIndex((product) => product.productId === productId);
        return { index: findIndex, product: products[findIndex] }
    }

    getProduct(productId) {
        const { product } = this.getProductWithIndex(productId);
        return product;
    }

    async updateProduct(productId, updateData) {
        const {index, product} = this.getProductWithIndex(productId);
        if (!product) {
            throw new Error(`Could not find a product with id: ${productId}`);
        }

        for (const [key, value] of Object.entries(updateData)) {
            if (key in product) {
                product[key] = value;
            }
        }

        this.#db.data.products[index] = product;
        await this.#db.write();
        return product;
    }

    async create(productData) {
        const product = {
            ...productData,
            location: "",
            productId: crypto.randomUUID(),
        }

        this.#db.data.products.push(product);
        await this.#db.write();
        return product;
    }

    async delete(productId) {
        const products = this.getAllProducts();
        this.#db.data.products = products.filter((product) => product.productId !== productId);
        await this.#db.write();
    }
}