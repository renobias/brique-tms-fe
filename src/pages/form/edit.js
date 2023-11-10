import { EditFormComponent } from "../../components/pages/form/components/edit";
import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";

export default function EditFormPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <EditFormComponent />;
}
