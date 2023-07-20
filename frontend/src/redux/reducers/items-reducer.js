import {
  ITEMS_INIT,
  ITEM_FAVORITE,
  ITEM_UPDATE,
  ADD_ITEM,
  DELETE_ITEM,
} from "../actions/items-actions";

export default function itemsReducer(state = null, action) {
  switch (action.type) {
    case ITEMS_INIT:
      return action.data;
    case ADD_ITEM:
      return [...state, action.data];
    case ITEM_FAVORITE:
      return state?.map((ele) => {
        if (ele.id === action.data.id) {
          return action.data;
        }
        return ele;
      });
    case DELETE_ITEM:
      return state?.filter((ele) => ele.id !== action.data);
    case ITEM_UPDATE:
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
