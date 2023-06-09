import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

function CardItem({ id, category, image, title, description }) {
  const isMobile = useTheme()?.isMobile;
  return (
    <Card
      sx={{
        m: 1,
        height: !isMobile && 380,
        overflowY: "hidden",
        width: isMobile ? "100%" : "320px",
      }}
    >
      <CardHeader
        title={title}
        titleTypographyProps={{ fontFamily: "Caveat", fontSize: 28 }}
      />
      <CardMedia component="img" image={image} height={200} />
      <CardContent>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
    </Card>
  );
}

export default CardItem;
