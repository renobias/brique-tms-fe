import { ShowFormComponent } from "../../components/pages/form/components/show";
import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";

export default function ShowFormPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <ShowFormComponent />;
}
