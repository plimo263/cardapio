import fetchRedux from "../../api/fetch_redux";
import ToastErro from "../../utils/toast-erro";

export const REDE_SOCIAL_INIT = "REDE_SOCIAL_INIT";

const ROTAS = ["/rede_social"];

export const redeSocialInit = () => (dispatch) => {
  // Obtendo a meta do mes atual
  fetchRedux(
    ROTAS[0],
    "GET",
    null,
    (resposta) => {
      dispatch({
        type: REDE_SOCIAL_INIT,
        data: resposta,
      });
    },
    () => {},
    (err) => ToastErro(err)
  );
};
