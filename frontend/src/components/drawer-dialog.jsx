import PropTypes from "prop-types";
import { useMediaQuery, useTheme } from "@mui/material";
import DialogViewer from "./dialog-viewer";
import DrawerViewer from "./drawer-viewer";

//
const DrawerDialog = ({ fnGetBodyContent, closeModal }) => {
  const isMobile = useMediaQuery(useTheme()?.breakpoints?.down("md"));
  let bodyContent = fnGetBodyContent();

  return (
    <>
      {isMobile ? (
        <DrawerViewer bodyContent={bodyContent} closeDrawer={closeModal} />
      ) : (
        <DialogViewer
          bodyContent={bodyContent}
          withSlide
          closeDialog={closeModal}
        />
      )}
    </>
  );
};
//
DrawerDialog.propTypes = {
  /** Uma funcao que irá lidar com a logica para escolha do conteudo do modal. Se retornar null isto quer dizer que o modal não será exibido */
  fnGetBodyContent: PropTypes.func.isRequired,
  /** Uma funcao responsavel por fechar o modal. Lembre-se de que esta função deve de alguma forma influenciar no retorno da função fnGetCorpo fazendo ela retornar null */
  closeModal: PropTypes.func.isRequired,
};
export default DrawerDialog;
