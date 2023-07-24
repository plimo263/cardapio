import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Logo from "./logo";
import useFetch from "../api/use-fetch";
import Icon from "./icon";
import { useHistory } from "react-router-dom";

const menuStr = {
  labelLogout: "Sair",
};

function Header() {
  const isMobile = useTheme()?.isMobile;
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState();
  const [verBotaoBack, setVerBotaoBack] = useState(false);
  const { data, setFetch } = useFetch("/usuario", "GET");
  useEffect(() => {
    setFetch({});
  }, [setFetch]);
  //
  // Altera entre exibir e ocultar o botao de volta
  useEffect(() => {
    const unlisten = history.listen(() => {
      if (history.action === "PUSH") {
        setVerBotaoBack(true);
      } else if (history.action === "POP") {
        setVerBotaoBack(false);
      }
    });
    return unlisten;
  }, [setVerBotaoBack, history]);
  // Funcao para controlar navegacao atras na pilha
  const onBackRoute = useCallback(() => {
    history.goBack();
  }, [history]);
  //
  const onViewMenu = useCallback(
    (e) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl]
  );
  //
  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  //
  const options = [
    {
      label: menuStr.labelLogout,
      icon: "Logout",
      onClick: () => (window.location.href = "/logout"),
    },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        //background: "linear-gradient(180deg, #C31432 0%, #240B36 82.19%)",
        background: "#9F0606",
      }}
    >
      <Toolbar disableGutters>
        <Stack
          sx={{ width: "100%", p: 1 }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {isMobile && verBotaoBack ? (
            <IconButton sx={{ color: "white" }} onClick={onBackRoute}>
              <Icon icon="ArrowBack" />
            </IconButton>
          ) : (
            <Box sx={{ width: 48, height: 48 }} />
          )}
          <Typography variant="h4" sx={{ fontFamily: "Caveat" }}>
            Cardápio
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo isMini />
            {data && (
              <IconButton sx={{ color: "white" }} onClick={onViewMenu}>
                <Icon icon="MoreVert" />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Toolbar>
      <Menu anchorEl={anchorEl} onClose={onClose} open={Boolean(anchorEl)}>
        {options.map((ele) => (
          <MenuItem key={ele.icon} onClick={ele.onClick}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Icon icon={ele.icon} />
              <Typography variant="body2">{ele.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}

export default Header;
