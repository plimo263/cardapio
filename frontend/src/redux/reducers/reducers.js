import { combineReducers } from "redux";
import menuReducer from "./menu-reducer";
import itemsReducer from "./items-reducer";

export default combineReducers({
  menu: menuReducer,
  items: itemsReducer,
});
