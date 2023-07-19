import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import Icon from "./icon";

const createPhrase = (total) => {
  return `${total} cliente${total < 2 ? "" : "s"} curti${
    total < 2 ? "u" : "ram"
  } isso.`;
};

function CardItem({
  image,
  title,
  description,
  isFav,
  totalOfFav,
  onClickFavorite,
  onCreateComment,
  labelThumbButton,
  labelComment,
}) {
  const isMobile = useTheme()?.isMobile;
  let phraseClientsOfFav = createPhrase(totalOfFav);
  if (isFav) {
    if (totalOfFav > 1) {
      const newTotalOfFav = totalOfFav - 1;
      phraseClientsOfFav = "Você e mais " + createPhrase(newTotalOfFav);
    } else {
      phraseClientsOfFav = "Você curtiu isso.";
    }
  }

  return (
    <Card
      elevation={3}
      sx={{
        m: 1,
        height: !isMobile && 430,
        overflowY: "hidden",
        width: isMobile ? "calc(100%-8px)" : "320px",
      }}
    >
      <CardHeader
        title={title}
        titleTypographyProps={{ fontFamily: "Caveat", fontSize: 28 }}
      />
      <CardMedia
        component="img"
        image={image}
        height={isMobile ? "auto" : 200}
      />
      <CardContent>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Stack sx={{ width: "100%" }} alignItems="center">
          <Button
            color="info"
            fullWidth
            startIcon={<Icon icon={isFav ? "ThumbUp" : "ThumbUpOffAlt"} />}
            onClick={onClickFavorite}
          >
            {labelThumbButton}
          </Button>
          {/* <Button
          onCreateComment={onCreateComment}
          fullWidth
          color="inherit"
          sx={{
            color: grey[600],
          }}
          startIcon={<Icon icon="Comment" />}
        >
          {labelComment}
        </Button> */}
          <Divider sx={{ my: 1 }} />
          {totalOfFav > 0 && (
            <Typography variant="caption">{phraseClientsOfFav}</Typography>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}

export default CardItem;
