import { Stack } from "@mui/material";
import React from "react";

function Background({ children }) {
  return (
    <Stack
      justifyContent="center"
      sx={{
        height: "100vh",
        //background: "linear-gradient(180deg, #C31432 0%, #240B36 92.19%)",
      }}
    >
      {children}
    </Stack>
  );
}

export default Background;
