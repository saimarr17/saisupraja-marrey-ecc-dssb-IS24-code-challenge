import {apiClient} from "./index.js";

const productApiClient = apiClient("product");

export const getAllProducts = async () => {
    const { payload } = await productApiClient.get("").json();
    return payload;
};

export const getProduct = async (productId) => {
    const { payload } = await productApiClient.get(productId).json();
    return payload;
};

export const deleteProduct = async (productId) => {
    const response = await productApiClient.delete(productId);
    return response.ok;
};

export const updateProduct = async (productId, updateData) => {
    const { payload } = await productApiClient.put(productId, {
        json: {
            ...updateData,
        }
    });
};

export const addProduct = async (productInfo) => {
    const { payload } = await productApiClient.post("", {
        json: {
            ...productInfo,
        }
    });
};