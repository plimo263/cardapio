import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const ITEMS_INIT = "ITEMS_INIT";
const ROTAS = ["/cardapio"];

export const itemsInit = () => (dispatch) => {
  // Obtendo a meta do mes atual
  fetchRedux(
    `${ROTAS[0]}?categoria=todas`,
    "GET",
    null,
    (resposta) => {
      dispatch({
        type: ITEMS_INIT,
        data: resposta,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
