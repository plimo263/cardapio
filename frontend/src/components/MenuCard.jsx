import React from "react";
import { motion } from "framer-motion";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

// MenuCard: mostra thumbnail e título. Recebe `item` e `onOpen`.
// Usa `layoutId` na imagem para shared element transition com MenuDetail.
export default function MenuCard({ item, onOpen }) {
  const id = String(item.id || item._id || item.nome);
  const img =
    item.imagem_url ||
    item.imagem?.url ||
    item.thumb_url ||
    "/static/no-image.png";

  return (
    <Card
      onClick={() => onOpen(item)}
      sx={{ cursor: "pointer", borderRadius: 2, overflow: "hidden" }}
      elevation={3}
    >
      <motion.div
        layoutId={`image-${id}`}
        style={{ overflow: "hidden", borderRadius: 12 }}
      >
        <CardMedia
          component="img"
          src={img}
          alt={item.nome}
          sx={{ width: "100%", height: 200, objectFit: "cover" }}
        />
      </motion.div>

      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {item.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {item.descricao}
        </Typography>
      </CardContent>
    </Card>
  );
}
