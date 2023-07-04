import { ITEMS_INIT, ITEM_FAVORITE } from "../actions/items-actions";

export default function itemsReducer(state = null, action) {
  switch (action.type) {
    case ITEMS_INIT:
      return action.data;
    case ITEM_FAVORITE:
      return state?.map((ele) => {
        if (ele.id === action.data.id) {
          return action.data;
        }
        return ele;
      });
    default:
      return state;
  }
}
