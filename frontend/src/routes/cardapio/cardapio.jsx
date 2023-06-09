import { Box, Container, Grow, Stack } from "@mui/material";
import React, { useCallback } from "react";
import _ from "lodash";
import BottomNavigationBar from "../../components/bottom-navigationbar";
import { useDispatch, useSelector } from "react-redux";
import { menuSelected } from "../../redux/actions/menu-actions";
import { CardItem } from "../../components";

const selectMenus = (state) => state?.menu?.menus;
const selectMenuSelected = (state) => state?.menu?.selectMenu;
const selectItems = (state) => state?.items;

function Cardapio() {
  const dispatch = useDispatch();
  const menus = useSelector(selectMenus);
  const selectedMenu = useSelector(selectMenuSelected);
  const items = useSelector(selectItems);
  //
  const onChangeMenu = useCallback(
    (value) => {
      dispatch(menuSelected(value));
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
                  image={ele.normal}
                />
              </Box>
            </Grow>
          ))}
        </Stack>
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
