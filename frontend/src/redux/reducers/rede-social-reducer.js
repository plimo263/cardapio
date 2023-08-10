import { REDE_SOCIAL_INIT } from "../actions/rede-social-actions";

export default function redeSocialReducer(state = null, action) {
  switch (action.type) {
    case REDE_SOCIAL_INIT:
      return action.data;
    default:
      return state;
  }
}
