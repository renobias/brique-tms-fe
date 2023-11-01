import React from "react";
import PropTypes from "prop-types";
import { DataContextProvider } from "./contexts/data";
import { NotificationProvider } from "./contexts/utility";
import { GlobalStateProvider } from "./stateProvider";
import { MessageProvider } from "./contexts/utility/message";
import { Provider } from "react-redux";
import configureStore from "./configStore";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistedReducer, persistor } = configureStore();

export const AppProvider = (props) => {
  const { children, dataProvider } = props;
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DataContextProvider {...dataProvider}>
            <NotificationProvider>
              <MessageProvider>
                <GlobalStateProvider>{children}</GlobalStateProvider>
              </MessageProvider>
            </NotificationProvider>
          </DataContextProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

AppProvider.defaultProps = {
  dataProvider: {},
};

AppProvider.propTypes = {
  dataProvider: PropTypes.object,
};
