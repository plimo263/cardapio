import { Container, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

function ContainerAdaptative({ children, sx }) {
  const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));

  return (
    <Container
      sx={{
        width: ({ breakpoints }) => (isMobile ? "auto" : breakpoints.values.md),
        ...sx,
      }}
    >
      {children}
    </Container>
  );
}

export default ContainerAdaptative;
