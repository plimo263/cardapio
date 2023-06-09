import { MENU_INIT, MENU_SELECTED } from "../actions/menu-actions";

const INIT_STATE = {
  selectMenu: 0,
};

export default function menuReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case MENU_INIT:
      return {
        ...state,
        menus: action.data,
      };
    case MENU_SELECTED:
      return {
        ...state,
        selectMenu: action.data,
      };
    default:
      return state;
  }
}
