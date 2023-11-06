import { AppProvider } from "./AppProvider";
import { AppLayout } from "./components/layout";
import { useContext, useEffect, useState } from "react";
import { globalStateContext } from "./stateProvider";
import { reqresDataProvider } from "./rest-data-provider/reqres";
import { Router } from "./router";
import "./styles/globalStyles.scss";
import { useBaseApi } from "./hooks/utility/useBaseApi";
import { WebGateSecurity } from "./components/pages/security/WebGateSecurity";

export default function App() {
  const baseApi = useBaseApi();
  const reqresDataProv = reqresDataProvider(baseApi);
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  const RenderComponent = ({ children }) => {
    const globalState = useContext(globalStateContext);
    const { currentLayout } = globalState.layout.current;
    return <AppLayout type={currentLayout}>{baseApi && <Router />}</AppLayout>;
  };

  return (
    <AppProvider
      dataProvider={{
        default: reqresDataProv,
        reqres: reqresDataProv,
      }}
    >
      <WebGateSecurity>
        <RenderComponent />
      </WebGateSecurity>
    </AppProvider>
  );
}
