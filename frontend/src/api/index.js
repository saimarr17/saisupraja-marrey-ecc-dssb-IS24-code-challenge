import ky from "ky";
import { BACKEND_URL } from "../configs/index.js";

export const apiClient = (routerPrefix) =>
    ky.extend({
        prefixUrl: `${BACKEND_URL}/${routerPrefix}`,
        retry: 0,
    });