import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { itemsInit } from "../../redux/actions/items-actions";
import { menuInit, menuSelected } from "../../redux/actions/menu-actions";
import {
  Box,
  Container,
  Fab,
  Grow,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AnimationNoData,
  CardItem,
  DrawerDialog,
  Icon,
} from "../../components";
import BottomNavigationBar from "../../components/bottom-navigationbar";
import ManutencaoItensModal from "./manutencao_itens_modal";

const selectItems = (state) => state?.items;
const selectMenus = (state) => state?.menu?.menus;
const selectMenuSelected = (state) => state?.menu?.selectMenu;

// Strings usadas na pagina
const manutencaoItensStr = {
  titleNoData: "Nenhum dado a ser exibido",
  labelFabAdd: "Adicionar",
  titleFabAdd: "Clique para incluir um novo item",
};

function ManutencaoItens() {
  const [modal, setModal] = useState();
  const items = useSelector(selectItems);
  const menus = useSelector(selectMenus);
  const selectedMenu = useSelector(selectMenuSelected);

  //
  let menuName;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(itemsInit());
    dispatch(menuInit());
  }, [dispatch]);
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
    menuName = menus?.length > 0 ? menus[selectedMenu].descricao : "";

    itemsSelected = _.filter(items, (val) => val.categoria === menuName);
  }

  const onCloseModal = useCallback(() => setModal(null), [setModal]);
  //
  const onIntentAdd = useCallback(
    () =>
      setModal({
        type: ManutencaoItensModal.modal.ADD_ITEM,
        data: menuName,
      }),
    [menuName, setModal]
  );

  return (
    <Stack>
      {modal && (
        <DrawerDialog
          fnGetBodyContent={() => {
            return (
              <ManutencaoItensModal closeModal={onCloseModal} modal={modal} />
            );
          }}
          closeModal={onCloseModal}
        />
      )}
      <ButtonAdd onClick={onIntentAdd} />

      <Container disableGutters sx={{ px: 1, mb: 8 }}>
        {!itemsSelected || itemsSelected.length === 0 ? (
          <AnimationNoData title={manutencaoItensStr.titleNoData} />
        ) : (
          <Stack
            direction={{ sm: "column", md: "row" }}
            sx={{ width: "100%" }}
            flexWrap={{ sm: "nowrap", md: "wrap" }}
            alignItems="stretch"
          >
            {itemsSelected.map((ele) => (
              <Grow in key={ele.id}>
                <Box sx={{ p: 1 }}>
                  <CardItem
                    id={ele.id}
                    isEditor
                    title={ele.nome}
                    description={ele.descricao}
                    image={ele.thumb}
                    isFav={ele.meu_favorito}
                    category={ele.categoria}
                    onClickFavorite={() => {}}
                    totalOfFav={ele.total_favoritos}
                    onCreateComment={() => {}}
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
//
const ButtonAdd = ({ onClick }) => {
  const isMobile = useTheme()?.isMobile;

  return (
    <Fab
      title={manutencaoItensStr.titleFabAdd}
      variant={!isMobile ? "extended" : "circular"}
      sx={{ position: "fixed", right: 16, bottom: 72 }}
      onClick={onClick}
      color="success"
    >
      <Icon icon="Add" />
      {!isMobile && (
        <Typography variant="body2">
          {manutencaoItensStr.labelFabAdd}
        </Typography>
      )}
    </Fab>
  );
};

ManutencaoItens.rota = "/manutencao_itens";

export default ManutencaoItens;
