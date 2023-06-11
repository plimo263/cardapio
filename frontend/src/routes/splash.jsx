import React, { useEffect, useState } from "react";
import { Fade, Stack, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Logo, Background } from "../components";
//
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { menuInit } from "../redux/actions/menu-actions";
import { itemsInit } from "../redux/actions/items-actions";
import Cardapio from "./cardapio/cardapio";
import dataLottie from "../lotties/cafe.json";
import Lottie from "react-lottie";
import { red } from "@mui/material/colors";

//
const selectMenus = (state) => state?.menu?.menus;
const selectItems = (state) => state?.items;
//
const SPLASH_STRINGS = {
  titleCardapio: "Cardápio",
};
//
const defaultOptions = {
  loop: 2,
  //repeat: 3,
  autoplay: true,
  delay: 2000,
  animationData: dataLottie,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

//
function Splash() {
  const history = useHistory();
  const menus = useSelector(selectMenus);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const isMobile = useTheme()?.isMobile;
  //
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsShow(true), 1000);
  }, [setIsShow]);
  // Recupera os menus
  useEffect(() => {
    dispatch(menuInit());
  }, [dispatch]);
  // Recupera todos os itens
  useEffect(() => {
    dispatch(itemsInit());
  }, [dispatch]);
  // Verifica se os menus foram carregados
  useEffect(() => {
    if (menus && items) {
      setTimeout(() => {
        history.replace(Cardapio.rota);
      }, 5000);
    }
  }, [menus, items, history]);
  //
  return (
    <Background>
      <Stack justifyContent="center" alignItems="center">
        <Logo isLogo2 />
        <Fade in={isShow}>
          <Typography
            sx={{ color: red[700], mt: 2, fontFamily: "Caveat" }}
            variant="h3"
          >
            {SPLASH_STRINGS.titleCardapio}
          </Typography>
        </Fade>
        <Lottie
          options={defaultOptions}
          height={isMobile ? 200 : 400}
          width={isMobile ? 200 : 400}
        />
      </Stack>
    </Background>
  );
}
//
Splash.rota = "/";

export default Splash;
