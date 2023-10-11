import {useQuery} from "react-query";
import * as productsApi from "../../api/product.js";


export const useProductListQuery = () => {
    return useQuery({
        queryKey: ["getProductList"],
        queryFn: productsApi.getAllProducts,
    });
}

export const useProductQuery = (productId) => {
    return useQuery({
        queryKey: ["getProductList", productId] ,
        queryFn: async (productId) => {
            return await productsApi.getAllProducts()
        },
        select: (products) => products.find((product) => product.productId === productId)

    })
}