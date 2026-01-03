import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import { LayoutGroup } from "framer-motion";
import MenuCard from "../components/MenuCard";
import MenuDetail from "../components/MenuDetail";

// Exemplo simples de página que lista itens e abre detalhe com shared layout
export default function Menu({ items }) {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (item) => {
    setActive(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    // delay limpar active para permitir animação reverse completar
    setTimeout(() => setActive(null), 250);
  };

  return (
    <LayoutGroup>
      <Container sx={{ py: 4 }} maxWidth="lg">
        <Grid container spacing={2}>
          {items.map((it) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={String(it.id || it._id || it.nome)}
            >
              <MenuCard item={it} onOpen={handleOpen} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <MenuDetail item={active} open={open} onClose={handleClose} />
    </LayoutGroup>
  );
}
