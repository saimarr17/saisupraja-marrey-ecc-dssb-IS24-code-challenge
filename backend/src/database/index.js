import {dirname, join} from "node:path"
import {fileURLToPath} from "node:url"

import {Low} from "lowdb";
import {JSONFile} from "lowdb/node";
import {ProductRepository} from "./productRepository.js";
import {faker} from "@faker-js/faker";

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json');
console.log(file);

export class Storage {
    static db;
    static async initialize() {
        if (Storage.db) {
            return;
        }

        const defaultData = Storage.#getDefaultData();
        const adapter = new JSONFile(file);
        const productDb = new Low(adapter, defaultData);

        await productDb.read();
        await productDb.write();

        const productRepository = new ProductRepository(productDb);
        Storage.db = {
            products: productRepository,
        }
    }

    static #getDefaultData() {
        const products = [];
        const maxProductsCount = 40;

        for (let i = 0; i < maxProductsCount; i++) {
            products.push(Storage.#generateRandomProduct());
        }

        return { products }
    }

    static #generateRandomProduct() {
        const productId = faker.string.uuid();
        const productName = faker.commerce.productName();
        const productOwner = faker.person.fullName();
        const scrumMaster = faker.person.fullName();
        const startDate = faker.date.anytime();
        const methodology = faker.helpers.arrayElement(["Agile", "Waterfall"]);
        const location = `github.com/bcgov/${productName.toLowerCase().replaceAll(" ", "_")}`;
        const developerNames = [];

        const randomNumber = faker.helpers.rangeToNumber({min: 1, max: 5});

        for (let i = 0; i <randomNumber; i++) {
            developerNames.push(faker.person.fullName());
        }

        return {
            productId,
            productName,
            productOwner,
            scrumMaster,
            startDate,
            methodology,
            location,
            developerNames,
        };
    }
}