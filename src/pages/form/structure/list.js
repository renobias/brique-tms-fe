import { ListStructureFormComponent } from "../../../components/pages/form/structure/components/list";
import { globalStateContext } from "../../../stateProvider";
import { useContext, useEffect } from "react";

export default function ListStructureFormPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <ListStructureFormComponent />;
}
