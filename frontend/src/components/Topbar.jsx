import {AppBar, Box, Stack, Toolbar, Typography, useTheme} from "@mui/material";
import {useContext} from "react";
import {ColorModeContext} from "../ColorContext.jsx";

import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Topbar() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
       <Box sx={{ marginBottom: "30px" }}>
           <AppBar position="sticky">
               <Toolbar disableGutters>
                   <Typography
                       variant="h4"
                       component="h4"
                       sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', marginLeft: "12px" } }}
                   >
                       BC
                   </Typography>
                   <Box sx={{ width: "100%", paddingRight: "12px" }}>
                       <Stack direction="row" alignItems="center" justifyContent="flex-end">
                           <Box>
                               <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                                   {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                               </IconButton>
                           </Box>
                       </Stack>
                   </Box>
               </Toolbar>
           </AppBar>
       </Box>
    )

}

export default Topbar;