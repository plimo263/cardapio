import { Box, Container, Grow, Stack, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import BottomNavigationBar from "../../components/bottom-navigationbar";
import { useDispatch, useSelector } from "react-redux";
import { menuSelected } from "../../redux/actions/menu-actions";
import { AnimationHeart, AnimationNoData, CardItem } from "../../components";
import Splash from "../splash";
import { useHistory } from "react-router-dom";
import { itemFavoriteToggle } from "../../redux/actions/items-actions";
import { useLocalStorage, useToggle } from "react-use";
import { ID_IDENTIFICADOR } from "../../constants";
import { toast } from "react-toastify";

const selectMenus = (state) => state?.menu?.menus;
const selectMenuSelected = (state) => state?.menu?.selectMenu;
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
  const selectedMenu = useSelector(selectMenuSelected);
  const items = useSelector(selectItems);
  //
  let itemsSelected = useMemo(() => [], []);
  if (items && menus) {
    const menuName = menus?.length > 0 ? menus[selectedMenu].descricao : "";

    itemsSelected = _.filter(items, (val) => val.categoria === menuName);
  }
  //
  useEffect(() => {
    // Caso os itens não existam deve-se retornar a tela inicial
    if (!items) {
      history.replace(Splash.rota);
    }
  }, [history, items]);
  //
  const onChangeMenu = useCallback(
    (value) => {
      dispatch(menuSelected(value));
    },
    [dispatch]
  );
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
      <Container disableGutters sx={{ px: 0, mb: 8 }}>
        {!itemsSelected || itemsSelected.length === 0 ? (
          <AnimationNoData title={CARDAPIO_STRINGS.titleNoData} />
        ) : (
          <Stack
            direction={{ sm: "column", md: "row" }}
            sx={{ width: "100%" }}
            flexWrap={{ sm: "nowrap", md: "wrap" }}
          >
            {itemsSelected.map((ele) => (
              <Grow in key={ele.id}>
                <Box sx={{ p: 1 }}>
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
                    labelThumbButton={
                      ele.meu_favorito ? "Aprovado !" : "Curtir"
                    }
                  />
                </Box>
              </Grow>
            ))}
          </Stack>
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
      <BottomNavigationBar
        menus={menus}
        selectedMenu={selectedMenu}
        onChange={onChangeMenu}
      />
    </Stack>
  );
}

Cardapio.rota = "/cardapio";

export default Cardapio;
