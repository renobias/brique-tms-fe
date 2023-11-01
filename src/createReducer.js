import { combineReducers } from "redux";
import briqueReducer from "./modules/brique/reducer";

const rootReducer = combineReducers({
  brique: briqueReducer,
});

export default rootReducer;
