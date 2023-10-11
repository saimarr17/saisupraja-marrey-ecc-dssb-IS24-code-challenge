import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import router from "./routes/index.js";
import {Storage} from "./database/index.js";


const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product REST API docs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                requestInterceptor: function (request){
                    request.headers.Origin = `http://localhost:3000`;
                    return request;

                },
            }
        ]
    },
    apis: ["src/routes/product/*.js"]
};

const specs = swaggerJsDoc(options);

(async () => {
    await Storage.initialize();
    const app = express();
    app.use(express.json());
    app.use(cors({methods:['GET','PUT', 'POST', 'DELETE']}));
    // app.options('*', cors({methods:['GET','PUT', 'POST', 'DELETE']}));
    app.use("/api", router);
    app.use("/api/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


    app.listen(port,() => {
        console.log(`Server is running on port ${port}`)
    })
})()

