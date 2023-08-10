import {
  Box,
  Container,
  Grow,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  AnimationHeart,
  AnimationNoData,
  CardItem,
  Icon,
} from "../../components";
import Splash from "../splash";
import { useHistory } from "react-router-dom";
import { itemFavoriteToggle } from "../../redux/actions/items-actions";
import { useLocalStorage, useToggle } from "react-use";
import { ID_IDENTIFICADOR } from "../../constants";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";

const selectMenus = (state) => state?.menu?.menus;
const selectItems = (state) => state?.items;

const CARDAPIO_STRINGS = {
  titleNoData: "Nenhum dado a ser exibido",
};

function Cardapio() {
  const isMobile = useTheme()?.isMobile;
  const [animarCurtir, setAnimarCurtir] = useToggle();
  const [valueKey, ,] = useLocalStorage(ID_IDENTIFICADOR);

  const dispatch = useDispatch();
  const history = useHistory();
  const menus = useSelector(selectMenus);

  const items = useSelector(selectItems);

  //
  let itemsSelected = useMemo(() => [], []);
  if (items && menus) {
    itemsSelected = items;
  }
  //
  useEffect(() => {
    // Caso os itens não existam deve-se retornar a tela inicial
    if (!items) {
      history.replace(Splash.rota);
    }
  }, [history, items]);
  //
  const onFavoriteItem = useCallback(
    (id) => {
      if (!valueKey) {
        toast.dark("Para curtir os produtos é necessário ativar os cookies", {
          type: "info",
        });
      } else {
        const item = _.filter(itemsSelected, (val) => val.id === id);
        if (item.length > 0 && !item[0].meu_favorito) {
          setAnimarCurtir();
          setTimeout(() => {
            setAnimarCurtir();
          }, 1000);
        }

        dispatch(itemFavoriteToggle(id, valueKey));
      }
    },
    [dispatch, itemsSelected, setAnimarCurtir, valueKey]
  );

  return (
    <Stack>
      <Container disableGutters sx={{ px: 0, mb: 8 }} maxWidth={false}>
        {!itemsSelected || itemsSelected.length === 0 ? (
          <AnimationNoData title={CARDAPIO_STRINGS.titleNoData} />
        ) : (
          menus.map((menu) => (
            <Categoria
              key={menu.icone}
              descricao={menu.descricao}
              icone={menu.icone}
              itens={_.filter(
                itemsSelected,
                (val) => val.categoria === menu.descricao
              )}
              onFavoriteItem={onFavoriteItem}
            />
          ))
        )}
        <Grow in={animarCurtir} unmountOnExit>
          <Box
            sx={{
              position: "fixed",
              top: isMobile ? "calc(50vh - 150px)" : "calc(50vh - 300px)",
              left: isMobile ? "calc(50vw - 150px)" : "calc(50vw - 300px)",
            }}
          >
            <AnimationHeart />
          </Box>
        </Grow>
      </Container>
      <Footer />
    </Stack>
  );
}
//
const Categoria = ({ descricao, icone, itens, onFavoriteItem }) => {
  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1} alignItems="center">
        <Typography
          variant="h3"
          sx={{ color: "#9F0606", fontFamily: "Caveat" }}
        >
          {descricao}
        </Typography>
        <Icon
          icon={icone}
          sx={{
            color: "#9F0606",
            fontSize: ({ typography }) => typography.h3.fontSize,
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="stretch"
        sx={{ py: 1, width: "100vw", overflow: "auto" }}
      >
        {itens.map((ele) => (
          <CardItem
            id={ele.id}
            title={ele.nome}
            description={ele.descricao}
            image={ele.thumb}
            imageMax={ele.original}
            isFav={ele.meu_favorito}
            onClickFavorite={() => onFavoriteItem(ele.id)}
            totalOfFav={ele.total_favoritos}
            onCreateComment={() => {}}
            labelComment="Comentar"
            labelThumbButton={ele.meu_favorito ? "Aprovado !" : "Curtir"}
          />
        ))}
      </Stack>
    </Stack>
  );
};

Cardapio.rota = "/cardapio";

export default Cardapio;
