import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";
import { HomePageComponent } from "../../components/pages/home";
import { useWebGateSecurity } from "../../hooks/security/useWebGateSecurity";

export default function Index(context) {
  // useWebGateSecurity(context);
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);

  return <HomePageComponent />;
}
