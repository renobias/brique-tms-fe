import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";
import { AuthPage } from "../../components/pages/auth";
import { useWebGateSecurity } from "../../hooks/security/useWebGateSecurity";

export default function Index() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("auth");
  }, []);
  return <AuthPage type="login" title />;
}
