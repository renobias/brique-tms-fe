import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";
import { AuthPage } from "../../components/pages/auth";

export default function Index() {
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("auth");
  }, []);
  return <AuthPage type="login" title />;
}
