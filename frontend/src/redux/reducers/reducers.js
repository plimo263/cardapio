import { combineReducers } from "redux";
import menuReducer from "./menu-reducer";
import itemsReducer from "./items-reducer";
import userReducer from "./user-reducer";
import redeSocialReducer from "./rede-social-reducer";

export default combineReducers({
  menu: menuReducer,
  items: itemsReducer,
  user: userReducer,
  redeSocial: redeSocialReducer,
});
