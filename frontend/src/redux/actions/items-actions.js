import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const ITEMS_INIT = "ITEMS_INIT";
export const ITEM_FAVORITE = "ITEM_FAVORITE";
//
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
//
export const itemFavoriteToggle = (id) => (dispatch) => {
  // Obtendo a meta do mes atual
  const formData = new FormData();
  formData.append("dados", JSON.stringify({ id }));

  fetchRedux(
    ROTAS[0],
    "PATCH",
    formData,
    (resposta) => {
      dispatch({
        type: ITEM_FAVORITE,
        data: resposta,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
