import {
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import Icon from "./icon";
import { useToggle } from "react-use";
import InputEditField from "./input-edit-field";
import { useDispatch } from "react-redux";
import {
  itemDelete,
  itemSendUpdate,
  itemSendUpdateImage,
} from "../redux/actions/items-actions";

import BackCardImg from "../images/fundo_card.jpeg";
import BackCardImgMobile from "../images/fundo_card_mobile.jpeg";
import { useHistory } from "react-router-dom";
import ImageItemMax from "../routes/cardapio/image-item-max";

const createPhrase = (total) => {
  return `${total} cliente${total < 2 ? "" : "s"} curti${
    total < 2 ? "u" : "ram"
  } isso.`;
};

const cardItemStr = {
  placeholderTitle: "Digite o nome do produto",
  titleEditCancel: "Cancele a edição do campo",
  titleEditSave: "Salve o campo editado.",
  placeholderDescription: "Digite uma descrição para o item",
  titleEditImage: "Clique para editar a imagem do item",
  labelDelete: "Deseja realmente excluir o item ?",
  titleDelete: "Clique para remover um item do cardapio",
};
//
const heightImgDesk = 400;
const sxTitleCard = { fontFamily: "Caveat", fontSize: 24, color: "#9F0606" };
const sxTextContent = { fontWeight: 600, color: "#9F0606" };
const sxTextFav = { fontWeight: 600, color: "#9F0606" };

function CardItem({
  image,
  imageMax,
  title,
  isEditor,
  category,
  id,
  description,
  isFav,
  totalOfFav,
  onClickFavorite,
  labelThumbButton,
  onCreateComment,
  labelComment,
}) {
  const isMobile = useTheme()?.isMobile;

  const viewOptions = {
    totalOfFav,
    isFav,
    title,
    image,
    imageMax,
    description,
    onClickFavorite,
    labelThumbButton,
    onCreateComment,
    labelComment,
    isMobile,
    isEditor,
    id,
  };
  const editOptions = {
    totalOfFav,
    title,
    image,
    description,
    category,
    isMobile,
    id,
  };

  return isEditor ? (
    <CardItemEdit {...editOptions} />
  ) : (
    <CardItemView {...viewOptions} />
  );
}
//
const WrapperCard = ({ children }) => {
  const isMobile = useTheme()?.isMobile;
  //
  return (
    <Card
      elevation={3}
      sx={{
        m: 1,
        height: !isMobile && "100%",
        overflowY: "hidden",
        width: isMobile ? "calc(100%-8px)" : "324px",
        backgroundImage: !isMobile && `url(${BackCardImg})`,
        backgroundPositionY: "bottom",
      }}
    >
      {children}
    </Card>
  );
};

const CardItemView = ({
  totalOfFav,
  isFav,
  isMobile,
  title,
  image,
  imageMax,
  description,
  onClickFavorite,
  labelThumbButton,
  onCreateComment,
  labelComment,
}) => {
  const history = useHistory();

  let phraseClientsOfFav = createPhrase(totalOfFav);
  if (isFav) {
    if (totalOfFav > 1) {
      const newTotalOfFav = totalOfFav - 1;
      phraseClientsOfFav = "Você e mais " + createPhrase(newTotalOfFav);
    } else {
      phraseClientsOfFav = "Você curtiu isso.";
    }
  }

  const sxPaper = {
    p: 0,
    width: 40,
    height: 40,
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  //
  const onViewImage = useCallback(
    (img) => {
      history.push(ImageItemMax.rota, img);
    },
    [history]
  );

  return (
    <WrapperCard>
      <CardHeader
        sx={{
          backgroundImage: `url(${BackCardImgMobile})`,
          backgroundPositionY: "top",
        }}
        title={title}
        titleTypographyProps={sxTitleCard}
      />
      <CardMedia
        sx={{ cursor: "pointer" }}
        onClick={() => onViewImage(imageMax)}
        component="img"
        image={image}
        height={isMobile ? "auto" : heightImgDesk}
      />
      <CardContent
        sx={{
          backgroundImage: isMobile && `url(${BackCardImgMobile})`,
          backgroundPositionY: isMobile && "bottom",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ ...sxTextContent, flex: 1 }} variant="body2">
            {description}
          </Typography>
          <ButtonBase
            sx={{
              borderRadius: "100%",
            }}
            onClick={onClickFavorite}
          >
            <Paper
              elevation={3}
              sx={{
                background: isFav ? "#f8eed6" : "#f8eed6", // 1=#f8eed6, 2=#dbc4a4
                ...sxPaper,
              }}
            >
              <Icon
                sx={{ color: "#9F0606", fontSize: 28 }}
                icon={isFav ? "Favorite" : "FavoriteBorder"}
              />
            </Paper>
          </ButtonBase>
        </Stack>
        {totalOfFav > 0 && (
          <Typography
            sx={sxTextFav}
            variant="caption"
            component="p"
            align="center"
          >
            {phraseClientsOfFav}
          </Typography>
        )}
      </CardContent>
    </WrapperCard>
  );
};

//
const CardItemEdit = ({
  totalOfFav,
  title,
  image,
  description,
  category,
  isMobile,
  id,
}) => {
  return (
    <WrapperCard>
      <CardItemEditTitle
        title={title}
        description={description}
        id={id}
        category={category}
      />
      <CardItemEditImage id={id} imageUrl={image} isMobile={isMobile} />
      <CardItemEditDescription
        title={title}
        description={description}
        id={id}
        category={category}
      />
    </WrapperCard>
  );
};
//
const CardItemEditTitle = ({ id, description, category, title }) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useToggle();
  const [wait, setWait] = useToggle();
  const [value, setValue] = useState(title);
  //
  const onSubmit = useCallback(() => {
    // Informa que a edição acabou
    setIsEditing();
    // Dados para enviar na atualizacao
    const jsonData = {
      descricao: description,
      categoria: category,
      nome: value,
    };
    //
    dispatch(itemSendUpdate(id, jsonData, setWait));
  }, [dispatch, value, setIsEditing, description, category, id, setWait]);
  //
  const onClose = useCallback(() => {
    setIsEditing();
  }, [setIsEditing]);
  //
  const onDelete = useCallback(() => {
    if (window.confirm(cardItemStr.labelDelete)) {
      dispatch(itemDelete(id));
    }
  }, [id, dispatch]);

  return (
    <CardHeader
      sx={{
        backgroundImage: `url(${BackCardImgMobile})`,
        backgroundPositionY: "top",
      }}
      title={
        isEditing ? (
          <InputEditField
            wait={wait}
            name={value}
            setName={setValue}
            onSubmit={onSubmit}
            onClose={onClose}
            label=""
            placeholder={cardItemStr.placeholderTitle}
            sx={sxTitleCard}
          />
        ) : (
          <Typography sx={sxTitleCard} onClick={setIsEditing} variant="body1">
            {title}
          </Typography>
        )
      }
      action={
        <IconButton
          title={cardItemStr.titleDelete}
          color="error"
          onClick={onDelete}
        >
          <Icon icon="Delete" />
        </IconButton>
      }
    />
  );
};
//
const CardItemEditDescription = ({ title, id, description, category }) => {
  const dispatch = useDispatch();
  const isMobile = useTheme()?.isMobile;

  const [isEditing, setIsEditing] = useToggle();
  const [wait, setWait] = useToggle();
  const [value, setValue] = useState(description);
  //
  const onSubmit = useCallback(() => {
    // Informa que a edição acabou
    setIsEditing();
    // Dados para enviar na atualizacao
    const jsonData = {
      descricao: value,
      categoria: category,
      nome: title,
    };
    //
    dispatch(itemSendUpdate(id, jsonData, setWait));
  }, [dispatch, value, setIsEditing, title, category, id, setWait]);
  //
  const onClose = useCallback(() => {
    setIsEditing();
  }, [setIsEditing]);

  return (
    <CardContent
      onClick={setIsEditing}
      sx={{
        backgroundImage: isMobile && `url(${BackCardImgMobile})`,
        backgroundPositionY: isMobile && "bottom",
      }}
    >
      {isEditing ? (
        <InputEditField
          wait={wait}
          name={value}
          setName={setValue}
          onSubmit={onSubmit}
          onClose={onClose}
          label=""
          placeholder={cardItemStr.placeholderDescription}
        />
      ) : (
        <Typography
          sx={{ ...sxTextContent, cursor: "pointer" }}
          variant="body2"
        >
          {description}
        </Typography>
      )}
    </CardContent>
  );
};
//
const CardItemEditImage = ({ id, imageUrl, isMobile }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const onIntentLoadImage = useCallback(() => {
    ref.current.click();
  }, [ref]);
  // Veja se a imagem foi upada
  const onLoadImage = useCallback(
    (e) => {
      let input = e.target;
      if (input.files && input.files[0]) {
        // Insere o valor da imagem no form
        dispatch(itemSendUpdateImage(id, input.files[0]));
      }
    },
    [dispatch, id]
  );
  return (
    <>
      <input
        accept=".png, .jpg, .jpeg"
        ref={ref}
        onChange={onLoadImage}
        type="file"
        style={{ display: "none" }}
      />
      <CardMedia
        onClick={onIntentLoadImage}
        title={cardItemStr.titleEditImage}
        sx={{ cursor: "pointer" }}
        component="img"
        image={imageUrl}
        height={isMobile ? "auto" : heightImgDesk}
      />
    </>
  );
};

export default CardItem;
