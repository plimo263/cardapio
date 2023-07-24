import { Container, Stack } from "@mui/material";
import React from "react";
import ZoomImage from "../../components/zoom-image";

import { useLocation } from "react-router-dom";

function ImageItemMax() {
  const imageMax = useLocation()?.state;

  return (
    <Container
      sx={{
        background: "#494949",
      }}
      disableGutters
      maxWidth="lg"
    >
      <Stack
        justifyContent="center"
        sx={{
          width: "100%",
          height: "95vh",
        }}
      >
        <ZoomImage
          style={{
            width: "100%",
            objectFit: "contain",
            maxHeight: "90vh",
          }}
          src={imageMax}
          alt="Foto imagem em tamanho maior"
        />
      </Stack>
    </Container>
  );
}

ImageItemMax.rota = "/cardapio_max_imagem";

export default ImageItemMax;
