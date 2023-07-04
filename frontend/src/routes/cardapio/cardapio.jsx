import { Box, Container, Grow, Stack } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import _ from "lodash";
import BottomNavigationBar from "../../components/bottom-navigationbar";
import { useDispatch, useSelector } from "react-redux";
import { menuSelected } from "../../redux/actions/menu-actions";
import { AnimationNoData, CardItem } from "../../components";
import Splash from "../splash";
import { useHistory } from "react-router-dom";
import { itemFavoriteToggle } from "../../redux/actions/items-actions";

const selectMenus = (state) => state?.menu?.menus;
const selectMenuSelected = (state) => state?.menu?.selectMenu;
const selectItems = (state) => state?.items;

const CARDAPIO_STRINGS = {
  titleNoData: "Nenhum dado a ser exibido",
};

function Cardapio() {
  const dispatch = useDispatch();
  const history = useHistory();
  const menus = useSelector(selectMenus);
  const selectedMenu = useSelector(selectMenuSelected);
  const items = useSelector(selectItems);
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
      dispatch(itemFavoriteToggle(id));
    },
    [dispatch]
  );
  //
  let itemsSelected = [];
  if (items && menus) {
    const menuName = menus?.length > 0 ? menus[selectedMenu][1] : "";

    itemsSelected = _.filter(items, (val) => val.categoria === menuName);
  }

  return (
    <Stack>
      <Container disableGutters sx={{ px: 1, mb: 8 }}>
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
                <Box>
                  <CardItem
                    id={ele.id}
                    title={ele.nome}
                    description={ele.descricao}
                    image={ele.thumb}
                    isFav={ele.favoritado}
                    onClickFavorite={() => onFavoriteItem(ele.id)}
                  />
                </Box>
              </Grow>
            ))}
          </Stack>
        )}
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
