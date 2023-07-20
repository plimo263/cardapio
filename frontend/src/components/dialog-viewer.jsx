import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Componente Dialog para outros tipos de conteudo
const DialogViewer = ({
  closeDialog,
  bodyContent,
  maxWidth,
  fullScreen,
  withSlide,
  sxContent,
}) => {
  return (
    <Dialog
      open={Boolean(bodyContent)}
      fullWidth={maxWidth}
      maxWidth={false}
      fullScreen={fullScreen}
      TransitionComponent={withSlide && Transition}
    >
      <DialogContent sx={sxContent}>{bodyContent}</DialogContent>
      <DialogActions>
        <Button startIcon={<CloseIcon />} onClick={closeDialog}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
DialogViewer.defaultProps = {
  sxContent: {},
};
//
DialogViewer.propTypes = {
  /** Uma função de callback para fechar o dialog. Ela deve fazer com que o bodyContent seja null, false ou undefined */
  closeDialog: PropTypes.func,
  /** Determina se o Dialog deve abrir como slide (de baixo para cima). É mais um efeito. */
  withSlide: PropTypes.bool,
  /** Um componente React para representar o bodyContent, ou null quando Dialog não deve ser exibido */
  bodyContent: PropTypes.node,
  /** Informa que o Dialog vai abrir com largura máxima (lg == 1200px) */
  maxWidth: PropTypes.bool,
  /** Informa que o Dialog vai ocupar toda a tabela da pagina. Isto funciona como sobreposição sobre o conteúdo principal */
  fullScreen: PropTypes.bool,
};

export default memo(DialogViewer);
