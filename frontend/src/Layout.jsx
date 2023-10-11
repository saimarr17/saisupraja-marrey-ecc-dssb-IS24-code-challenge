import {Outlet} from "react-router-dom";
import {Box, Paper} from "@mui/material";
import Topbar from "./components/Topbar.jsx";

function Layout() {
    return (
        <Box>
            <main>
                <Topbar/>
                <Box sx={{marginTop:"30px"}}>
                    <Paper>
                        <Outlet/>
                    </Paper>
                </Box>

            </main>
        </Box>
    );
}

export default Layout;