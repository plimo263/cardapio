import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const ITEMS_INIT = "ITEMS_INIT";
export const ITEM_FAVORITE = "ITEM_FAVORITE";
//
const ROTAS = ["/cardapio/item", "/cardapio/favorito"];

export const itemsInit = (id_identificador) => (dispatch) => {
  //
  let formData;
  if (id_identificador) {
    formData = new URLSearchParams();
    formData.append("id_identificador", id_identificador);
  }

  fetchRedux(
    ROTAS[0],
    "GET",
    formData,
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
export const itemFavoriteToggle = (id, id_identificador) => (dispatch) => {
  fetchRedux(
    ROTAS[1],
    "PATCH",
    { id, id_identificador },
    (resposta) => {
      dispatch({
        type: ITEM_FAVORITE,
        data: resposta.data,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
