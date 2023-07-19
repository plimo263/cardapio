import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const MENU_INIT = "MENU_INIT";
export const MENU_SELECTED = "MENU_SELECTED";

const ROTAS = ["/cardapio/tipos"];

export const menuInit = () => (dispatch) => {
  // Obtendo a meta do mes atual
  fetchRedux(
    ROTAS[0],
    "GET",
    null,
    (resposta) => {
      dispatch({
        type: MENU_INIT,
        data: resposta,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
//
export const menuSelected = (value) => ({
  type: MENU_SELECTED,
  data: value,
});
