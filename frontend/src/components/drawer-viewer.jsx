import React, { memo } from "react";
import PropTypes from "prop-types";
import { Paper, Box, styled, Drawer, SwipeableDrawer } from "@mui/material";
//
const Puller = styled(Box)(({ theme }) => ({
  width: 40,
  height: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 4,
  marginTop: 8,
  marginBottom: 8,
  marginLeft: "calc(50% - 20px)",
}));

const Deslizavel = ({ bodyContent, closeDrawer }) => (
  <SwipeableDrawer
    anchor="bottom"
    open={Boolean(bodyContent)}
    onClose={closeDrawer}
  >
    <Paper
      elevation={3}
      sx={{ borderRadius: 0, mb: 1, zIndex: 1000, position: "sticky", top: 0 }}
    >
      <Puller />
    </Paper>
    {bodyContent}
  </SwipeableDrawer>
);
// Componente para exibir o Drawer de exibicao. Para mobile
const DrawerViewer = ({ closeDrawer, bodyContent, isSlideable }) => {
  return isSlideable ? (
    <Deslizavel bodyContent={bodyContent} closeDrawer={closeDrawer} />
  ) : (
    <Drawer anchor="bottom" open={Boolean(bodyContent)} onClose={closeDrawer}>
      {bodyContent}
    </Drawer>
  );
};
//
DrawerViewer.defaultProps = {
  bodyContent: null,
  isSheep: true,
};

DrawerViewer.propTypes = {
  /** Uma função de callback para fechar o drawer. Ela deve fazer com que o bodyContent seja null, false ou undefined */
  closeDrawer: PropTypes.func.isRequired,
  /** Um Componente react para representar o bodyContent ou null (para manter ele fechado), neste caso não deve ser exibido o Drawer */
  bodyContent: PropTypes.node,
  /** Permite criar uma gaveta deslizavel (padrao) */
  isSlideable: PropTypes.bool,
};

export default memo(DrawerViewer);
