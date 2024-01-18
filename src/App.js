import { AppProvider } from "./AppProvider";
import { AppLayout } from "./components/layout";
import { useContext, useEffect, useState } from "react";
import { globalStateContext } from "./stateProvider";
import { reqresDataProvider } from "./rest-data-provider/reqres";
import { Router } from "./router";
import "./styles/globalStyles.scss";
import { useBaseApi } from "./hooks/utility/useBaseApi";
import { WebGateSecurity } from "./components/pages/security/WebGateSecurity";
import { reqresAxios } from "./rest-data-provider/reqres/utils";
import { baseAPI } from "./definitions";
import { briqueTmsDataProvider } from "./rest-data-provider";

export default function App() {
  const baseApiBriqueTms = useBaseApi();
  const baseApiReqres = useBaseApi(reqresAxios);
  baseAPI["briqueTms"] = baseApiBriqueTms;
  baseAPI["reqres"] = baseApiReqres;

  const reqresDataProv = reqresDataProvider(baseApiReqres);
  const briqueTmsDataProv = briqueTmsDataProvider(baseApiBriqueTms);
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
    return (
      <AppLayout type={currentLayout}>
        {baseApiBriqueTms && <Router />}
      </AppLayout>
    );
  };

  return (
    <AppProvider
      dataProvider={{
        default: briqueTmsDataProv,
        briqueTms: briqueTmsDataProv,
        reqres: reqresDataProv,
      }}
    >
      <WebGateSecurity>
        <RenderComponent />
      </WebGateSecurity>
      {/* <RenderComponent /> */}
    </AppProvider>
  );
}
