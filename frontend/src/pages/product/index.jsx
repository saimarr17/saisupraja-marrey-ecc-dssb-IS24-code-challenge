import {Box, Paper, Typography} from "@mui/material";
import {ProductTable} from "./ProductTable.jsx";

function Products() {
    return (
        <Box>
            <Paper elevation={5} sx={{ padding: "30px" }}>
                <Typography variant={"h4"} sx={{ marginBottom: "12px" }} align="center">Products Catalog</Typography>
                <ProductTable />
            </Paper>
        </Box>
    );
}

export default Products;