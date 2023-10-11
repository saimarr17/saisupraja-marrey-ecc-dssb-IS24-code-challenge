import {useMutation, useQueryClient} from "react-query";
import * as productsApi from '../../api/product.js';
import {toast} from "react-toastify";


export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData) => {
            return await productsApi.addProduct(productData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["getProductList"]);
            toast.success("Successfully added the product");
        },
        onError: (error) => {
            toast.error(`Something went wrong with error ${error.message}`);
        }
    })
}

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData) => {
            return await productsApi.updateProduct(productData.productId, productData);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["getProductList"]);
            toast.success("Successfully updated the product");
        },
        onError: (error) => {
            toast.error(`Something went wrong with error ${error.message}`);
        }
    })
}

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId) => {
            return await productsApi.deleteProduct(productId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(["getProductList"]);
            toast.success("Successfully deleted the product");
        },
        onError: (error) => {
            toast.error(`Something went wrong with error ${error.message}`);
        }
    })
}