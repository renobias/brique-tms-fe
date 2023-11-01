import { createStore } from "redux";
import storage from "redux-persist/lib/storage";
import rootReducer from "./createReducer";
import { persistReducer, persistStore } from "redux-persist";

export default function configureStore() {
  const persistConfig = {
    key: "brique-web-app",
    storage,
    whitelist: ["brique"],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  return { persistedReducer, persistor, store };
}
