import { ITEMS_INIT } from "../actions/items-actions";

export default function itemsReducer(state = null, action) {
  switch (action.type) {
    case ITEMS_INIT:
      return action.data;
    default:
      return state;
  }
}
