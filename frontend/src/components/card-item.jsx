import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import Icon from "./icon";

function CardItem({
  id,
  category,
  image,
  title,
  description,
  // isFav,
  // onClickFavorite,
}) {
  const isMobile = useTheme()?.isMobile;
  return (
    <Card
      elevation={3}
      sx={{
        m: 1,
        height: !isMobile && 380,
        overflowY: "hidden",
        width: isMobile ? "calc(100%-8px)" : "320px",
      }}
    >
      <CardHeader
        title={title}
        titleTypographyProps={{ fontFamily: "Caveat", fontSize: 28 }}
        // action={
        //   <IconButton onClick={onClickFavorite} color="error">
        //     <Icon icon={isFav ? "Favorite" : "FavoriteBorder"} />
        //   </IconButton>
        // }
      />
      <CardMedia
        component="img"
        image={image}
        height={isMobile ? "auto" : 200}
      />
      <CardContent>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
}

export default CardItem;
