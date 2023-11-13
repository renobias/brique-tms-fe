import { CreateFormComponent } from "../../components/pages/form/components/create";
import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";

export default function EditFormPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <CreateFormComponent />;
}
