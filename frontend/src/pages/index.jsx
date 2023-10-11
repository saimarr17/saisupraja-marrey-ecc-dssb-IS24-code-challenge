import {createBrowserRouter} from "react-router-dom";
import Layout from "../Layout.jsx";
import Products from "./product/index.jsx";

export const router = createBrowserRouter([
    {
        Component: Layout,
        children: [
            {
                path: "/",
                Component: Products
            }
        ]
    }
]);