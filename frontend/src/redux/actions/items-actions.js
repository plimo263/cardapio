import { toast } from "react-toastify";
import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const ITEMS_INIT = "ITEMS_INIT";
export const ITEM_FAVORITE = "ITEM_FAVORITE";
export const ITEM_UPDATE = "ITEM_UPDATE";
export const ADD_ITEM = "ADD_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
//
const ROTAS = ["/cardapio/item", "/cardapio/favorito"];

export const itemsInit = (id_identificador) => (dispatch) => {
  //
  let formData = null;
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
//
export const itemAdd = (jsonData, setWait, closeModal) => (dispatch) => {
  fetchRedux(
    ROTAS[0],
    "POST",
    jsonData,
    (resposta) => {
      // Fechar modal
      closeModal();
      //
      dispatch({
        type: ADD_ITEM,
        data: resposta,
      });
    },
    () => {
      if (setWait) setWait();
    },
    (err) => ToastErro(err)
  );
};
//
export const itemDelete = (id) => (dispatch) => {
  fetchRedux(
    `${ROTAS[0]}/${id}`,
    "DELETE",
    null,
    (resposta) => {
      toast.dark(resposta.sucesso, {
        type: "success",
      });
      //
      dispatch({
        type: DELETE_ITEM,
        data: id,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
//
export const itemSendUpdate = (id, jsonData, setWait) => (dispatch) => {
  fetchRedux(
    `${ROTAS[0]}/${id}`,
    "PUT",
    jsonData,
    (resposta) => {
      dispatch({
        type: ITEM_UPDATE,
        data: resposta,
      });
    },
    () => {
      if (setWait) setWait();
    },
    (err) => ToastErro(err)
  );
};

export const itemSendUpdateImage = (id, image) => (dispatch) => {
  const formData = new FormData();
  formData.append("arquivo", image);

  fetchRedux(
    `${ROTAS[0]}/${id}`,
    "PATCH",
    formData,
    (resposta) => {
      dispatch({
        type: ITEM_UPDATE,
        data: resposta,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
