import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import Logo from "./logo";

function header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        background: "linear-gradient(180deg, #C31432 0%, #240B36 92.19%)",
      }}
    >
      <Toolbar disableGutters>
        <Stack
          sx={{ width: "100%", p: 1 }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" sx={{ fontFamily: "Caveat" }}>
            Cardápio
          </Typography>
          <Logo isMini />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default header;
